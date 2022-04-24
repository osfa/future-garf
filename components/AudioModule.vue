<template>
  <div class="audio-container">
    <div v-if="isPlaying && debug" class="flex justify-between w-full">
      <select v-model="currently1" @change="updateAmbiance">
        <option
          v-for="item in audioLibrary.availableReal"
          :key="item"
          :value="item"
        >
          {{ item.split('/').pop() }}
        </option>
      </select>
      <select v-model="currently2" @change="updateAmbiance">
        <option
          v-for="item in audioLibrary.availableFake"
          :key="item"
          :value="item"
        >
          {{ item.split('/').pop() }}
        </option>
      </select>
    </div>
    <div v-if="isPlaying && debug" class="vol-controls">
      <label>main: </label>
      <input
        v-model="volume"
        class="w-20 text-xs"
        type="number"
        @change="setVolume"
      />

      <label>noise</label>
      <input
        v-model="noiseVolume"
        class="w-20 text-xs"
        type="number"
        @change="updateVolumes"
      />

      <label>ambiance: </label>
      <input
        v-model="ambianceVolume"
        class="w-20 text-xs"
        type="number"
        @change="updateVolumes"
      />

      <label>ui: </label>
      <input
        v-model="uiVolume"
        class="w-20 text-xs"
        type="number"
        @change="updateVolumes"
      />

      <label>main: </label>
      <input
        v-model="mainSamplerVolume"
        class="w-20 text-xs"
        type="number"
        @change="updateVolumes"
      />

      <label>voice: </label>
      <input
        v-model="sampler1Volume"
        class="w-20 text-xs"
        type="number"
        @change="updateVolumes"
      />

      <label>xfade: </label>
      <input
        v-model="crossFadeVal"
        class="w-20 text-xs"
        type="number"
        @change="updateCrossfade"
      />

      <label>chorus: </label>
      <input
        v-model="chorusWetness"
        class="w-20 text-xs"
        type="number"
        @change="updateChorus"
      />
    </div>

    <div
      v-show="isActive && isPlaying"
      class="rec w-4 h-4 lg:w-4 lg:h-4 absolute rounded-full flex"
      :class="{ active: isActive }"
    >
      <span class="blink text-xs md:text-sm ml-14 md:ml-16 text-white">{{
        isActive ? 'REC' : 'GO'
      }}</span>
    </div>
    <transition mode="out-in" appear name="customFade">
      <div
        v-show="!isPlaying"
        class="main-play w-screen h-screen"
        @click="next()"
      >
        <div class="button-play"></div>
      </div>
    </transition>
    <transition mode="out-in" name="customFade">
      <div
        v-show="isPlaying && hasInit"
        class="w-4 h-4 xl:w-5 xl:h-5 v-controls active bg-white"
        @click="toggleAudio()"
      ></div>
    </transition>
  </div>
</template>

<script>
import * as Tone from 'tone'
import { audioLibrary } from '../pages/data/audioLibrary.js'
export const random = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}
const INITIAL_FREQ = 4
export default {
  name: 'AudioModule',
  props: {
    mainImageUrl: { type: String, default: '' },
    automaticFade: { type: Boolean, default: false },
    debug: { type: Boolean, default: false },
  },
  data() {
    return {
      audioLibrary,

      isActive: false,
      isPlaying: false,
      hasInit: false,

      currently1: '',
      currently2: '',

      volume: -12,
      noiseVolume: -16,
      noiseMin: -16,
      noiseMax: -9,
      toneVolume: -18,

      noiseRampTime: 15,
      toneRampTime: 20,

      uiVolume: 14,
      sampler1Volume: 3,
      mainSamplerVolume: -6,
      ambianceVolume: -3,

      sampler1: undefined,
      mainSampler: undefined,
      uiSampler: undefined,
      asmrChannel1: undefined,
      asmrChannel2: undefined,

      chorus: undefined,
      chorusWetness: 0.25,

      leftEar: undefined,
      rightEar: undefined,
      binauralBeat: INITIAL_FREQ,
      audioCtx: undefined,

      crossFadeVal: 0.5,
      crossFade: undefined,
      crossDirection: false,
      crossFadeInterval: undefined,
      crossFadeDuration: 30, // in seconds

      noiseMaker: undefined,

      audioDialog: true,

      ticks: 0,
    }
  },
  methods: {
    playSample() {
      if (!this.isPlaying) return

      if (this.uiSampler) {
        this.uiSampler.load(audioLibrary.uiSamples.sample())
        this.uiSampler.start()
      }

      if (this.mainSampler) {
        if (this.ticks % 8 === 0) {
          this.toggleActive(false)
          const s = audioLibrary.trailerSounds.sample()
          console.log('playsample 8', s)
          this.mainSampler.player(s).start()

          this.frequencyShift()
          this.noiseShift()

          // this.mainSampler.player(audioLibrary.trailer25.sample()).start()
        } else if (this.ticks % 4 === 0) {
          this.toggleActive(false)
          const s = audioLibrary.trailerSounds.sample()
          console.log('playsample 4', s)
          this.mainSampler.player(s).start()
          this.mainSampler.player(audioLibrary.hangDrum.sample()).start()
        }
      }

      if (this.ticks % 16 === 0) {
        this.toggleActive()
      }

      if (
        this.sampler1 &&
        this.sampler1.state === 'stopped' &&
        this.ticks % 16 === 0
      ) {
        this.sampler1.start()
      }
      this.ticks += 1

      if (!this.automaticFade) {
        this.doCrossFade()
      }
    },
    next(e) {
      this.toggleAudio()
      // this.$emit('next')
    },
    toggleActive(val) {
      this.isActive = val || !this.isActive
    },
    toggleAudio() {
      this.isPlaying = !this.isPlaying
      this.audioDialog = false
      this.$emit('toggleAudio')

      if (!this.audioCtx) {
        this.initAudio()
        this.hasInit = true
        return
      }

      if (this.audioCtx.state === 'running') {
        this.audioCtx.suspend().then(function () {})
      } else if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().then(function () {})
      }
    },
    doCrossFade() {
      const stepSize = 0.1
      // console.log('current cross fade val:', this.crossFade.fade.value)
      if (
        this.crossFade.fade.value === 1.0 ||
        this.crossFade.fade.value <= 0.0
      ) {
        this.crossDirection = !this.crossDirection
        if (this.crossFade.fade.value === 1.0) {
          const chosen = audioLibrary.availableReal.sample()
          this.currently1 = chosen
          console.log('new sample from real for 1: ', chosen)
          this.asmrChannel1.load(chosen)
        } else {
          const chosen = audioLibrary.availableFake.sample()
          console.log('new sample from fake for 2: ', chosen)
          this.currently2 = chosen
          this.asmrChannel2.load(chosen)
        }
      }

      // crossFadeVal = 0, only currently1
      // crossFadeVal = 1, only currently2
      if (this.crossDirection) {
        const val = Math.min(
          parseFloat(this.crossFade.fade.value + stepSize),
          1
        )
        this.crossFade.fade.value = val
        this.crossFadeVal = val.toFixed(1)
      } else {
        const val = Math.max(
          parseFloat(this.crossFade.fade.value - stepSize),
          0
        )
        this.crossFade.fade.value = val
        this.crossFadeVal = val.toFixed(1)
      }
    },
    setVolume() {
      Tone.getDestination().volume.rampTo(
        this.volume === -100 ? -Infinity : this.volume,
        0
      )
    },
    updateVolumes() {
      this.uiSampler.volume.value = this.uiVolume
      this.mainSampler.volume.value = this.mainSamplerVolume
      this.sampler1.volume.value = this.sampler1Volume
      this.asmrChannel1.volume.value = this.ambianceVolume
      this.asmrChannel2.volume.value = this.ambianceVolume
      this.noiseMaker.volume.value = this.noiseVolume
    },
    updateChorus() {
      // ramp to?
      this.chorus.wet.value = this.chorusWetness
    },
    updateAmbiance() {
      this.asmrChannel1.load(this.currently1)
      this.asmrChannel2.load(this.currently2)
    },
    updateCrossfade() {
      this.crossFade.fade.value = this.crossFadeVal
    },
    setFrequencies() {
      const freqs = this.calculateFrequencies(this.binauralBeat)
      this.leftEar.frequency.value = freqs.leftFrequency
      this.rightEar.frequency.value = freqs.rightFrequency
    },
    frequencyShift() {
      // const lowerBound = Math.max(0, this.binauralBeat + random(-4, 4))
      this.binauralBeat = random(1, 8)
      console.log('new bb: ', this.binauralBeat, this.toneRampTime)
      const freqs = this.calculateFrequencies(this.binauralBeat)
      this.leftEar.frequency.rampTo(freqs.leftFrequency, this.toneRampTime)
      this.rightEar.frequency.rampTo(freqs.rightFrequency, this.toneRampTime)
    },
    noiseShift() {
      const targetVolume = random(this.noiseMin, this.noiseMax)
      console.log('ramping rain to', targetVolume, this.noiseRampTime)
      this.noiseVolume = targetVolume
      this.noiseMaker.volume.rampTo(targetVolume, this.noiseRampTime)
    },
    calculateCarrierFrequency(binauralBeat) {
      // Formula retrieved by using excel on Oster's curve. Can be enhanced with real maths ;)
      // y = -0,2085x2 + 18,341x + 56,31
      return -0.2085 * Math.pow(binauralBeat, 2) + 18.341 * binauralBeat + 56.31
    },
    calculateFrequencies(binauralBeat) {
      const carrierFreq = this.calculateCarrierFrequency(binauralBeat)
      return {
        leftFrequency: carrierFreq + binauralBeat / 2,
        rightFrequency: carrierFreq - binauralBeat / 2,
      }
    },
    handleFrequencyChange(actualFrequency) {
      const { leftFrequency, rightFrequency } =
        this.calculateFrequencies(actualFrequency)
      console.log(leftFrequency, rightFrequency)
    },
    initAudio() {
      console.log('initAudio')
      const context = new Tone.Context()
      Tone.setContext(context)
      this.audioCtx = context.rawContext

      const merge = new Tone.Merge().toDestination()
      // const vol = new Tone.Volume(-90).toDestination();

      this.leftEar = new Tone.Oscillator().connect(merge, 0, 0)
      this.rightEar = new Tone.Oscillator().connect(merge, 0, 1)
      this.leftEar.volume.value = this.toneVolume
      this.rightEar.volume.value = this.toneVolume

      this.noiseMaker = new Tone.Noise('brown').toDestination()
      this.noiseMaker.volume.value = this.noiseVolume

      let def = {
        frequency: 1.5,
        delayTime: 3.5,
        depth: 0.7,
        spread: 180,
      }
      def = {
        frequency: 1.5,
        delayTime: 2.5,
        depth: 0.75,
        spread: 180,
        wet: this.chorusWetness,
      }

      this.chorus = new Tone.Chorus(def).toDestination()
      // this.chorus.wet.value = this.chorusWetness

      this.crossFade = new Tone.CrossFade().connect(this.chorus) // .toDestination()
      this.crossFade.fade.value = this.crossFadeVal // 0-currently1, 1-currently2

      this.currently1 = audioLibrary.availableReal.sample()
      this.asmrChannel1 = new Tone.Player(this.currently1).connect(
        this.crossFade.a
      )

      this.asmrChannel1.autostart = true
      this.asmrChannel1.loop = true
      this.asmrChannel1.volume.value = this.ambianceVolume

      this.currently2 = audioLibrary.availableFake.sample()
      this.asmrChannel2 = new Tone.Player(this.currently2).connect(
        this.crossFade.b
      )
      this.asmrChannel2.autostart = true
      this.asmrChannel2.loop = true
      this.asmrChannel2.volume.value = this.ambianceVolume

      if (this.automaticFade) {
        this.crossFadeInterval = setInterval(
          this.doCrossFade,
          (this.crossFadeDuration / 5) * 1000
        )
      }

      const reverb = new Tone.Reverb(0.8).toDestination()
      const file1 = audioLibrary.sampleSlot1.sample()
      const sampler1 = new Tone.Player(file1, () => {
        this.sampler1 = sampler1
        this.sampler1.playbackRate = 0.9
        this.sampler1.autostart = false
        this.sampler1.loop = false
        this.sampler1.volume.value = this.sampler1Volume
      }).connect(reverb)

      // uisamples
      const file2 = audioLibrary.uiSamples.sample()
      const uiSampler = new Tone.Player(file2, () => {
        this.uiSampler = uiSampler
        this.uiSampler.autostart = false
        this.uiSampler.loop = false
        this.uiSampler.volume.value = this.uiVolume
      }).toDestination()

      /* eslint-disable */
      const urls = audioLibrary.hangDrum
        .concat(audioLibrary.trailerSounds)
        .concat(audioLibrary.trailer25)
        .reduce((acc, curr) => ((acc[curr] = curr), acc), {})
      /* eslint-enable */

      console.log('loading: ', urls)
      const mainSampler = new Tone.Players(urls, () => {
        console.log('loaded mainSampler')
        this.mainSampler = mainSampler
        this.mainSampler.volume.value = this.mainSamplerVolume
      }).toDestination()

      // this.setNoiseVolume()
      this.setVolume()

      this.setFrequencies()

      this.leftEar.start()
      this.rightEar.start()
      this.noiseMaker.start()
    },
  },
}
</script>
<style scoped>
.button-play {
  position: relative;
}

.button-play:before {
  content: '';
  position: absolute;
  width: 35px;
  height: 35px;
  background: black;
  opacity: 0.25;
  right: -6px;
  top: -7px;
}

.button-play:after {
  display: block;
  position: absolute;
  content: '';
  right: 0;
  width: 0;
  height: 0;
  border: 20px solid transparent;
  border-width: 10px 0px 10px 18px;
  border-radius: 0;
  border-left-color: white;
}

.v-controls {
  top: 1rem;
  right: 1rem;
  position: absolute;
  z-index: 1000;
  cursor: pointer;
}

.rec {
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  background-color: rgb(108, 254, 108);
  box-shadow: 0 0 9px rgb(108, 254, 108);
  justify-content: center;
  align-items: center;
}
/* .rec span {
  margin-left: 70px;
  color: white;
} */
.rec.active {
  background-color: red;
  box-shadow: 0 0 9px rgb(254, 108, 108);
}

.main-play {
  z-index: 1000;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-controls.active {
  transform: scale(1);
  /* animation: pulse 2s infinite; */
  /* background: red; */
}
.customFade-enter-active,
.customFade-leave-active {
  transition: all 250ms cubic-bezier(1, 0.5, 0.8, 1);
  /*transition: opacity 5s;*/
}

.customFade-enter,
.customFade-leave-to {
  opacity: 0;
  /* transform: scale(1.05); */
}

.vol-controls {
  position: fixed;
  width: 100vw;
  bottom: 0;
  left: 0;
}
@keyframes pulse {
  0% {
    transform: scale(0.85);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }

  100% {
    transform: scale(0.85);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

.blink {
  animation: blink-animation 1s steps(5, start) infinite;
}
@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
@-webkit-keyframes blink-animation {
  to {
    visibility: hidden;
  }
}

.close {
  position: absolute;
}
.close:hover {
  opacity: 1;
}
.close:before,
.close:after {
  position: absolute;
  left: 15px;
  content: ' ';
  height: 33px;
  width: 4px;
  background-color: #fff;
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}
</style>
