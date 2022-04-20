<template>
  <div class="audio-container">
    <div
      class="rec w-7 h-7 absolute rounded-full flex"
      :class="{ active: isActive }"
      @click="toggle"
    >
      <span class="text-sm">{{ isActive ? 'REC' : 'GO' }}</span>
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
        class="w-6 h-6 v-controls active bg-white"
        @click="toggleAudio()"
      ></div>
    </transition>
    <!-- <transition mode="out-in" appear name="customFade">
      <div
        v-show="!isPlaying && hasInit"
        class="v-controls button-play"
        @click="toggleAudio()"
      ></div>
    </transition> -->
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
  name: 'ImageCard',
  props: {
    mainImageUrl: { type: String, default: '' },
  },
  data() {
    return {
      isActive: true,
      isPlaying: false,
      hasInit: false,
      volume: -24,
      rainVolume: -16,
      leftEar: undefined,
      rightEar: undefined,
      binauralBeat: INITIAL_FREQ,
      audioCtx: undefined,
      crossFade: undefined,
      crossDirection: false,
      crossFadeInterval: undefined,
      rainMaker: undefined,
      audioDialog: true,
      sampler1: undefined,
      mainSampler: undefined,
      uiSampler: undefined,
      asmrChannel1: undefined,
      asmrChannel2: undefined,
      ticks: 0,
    }
  },
  computed: {},
  created() {},
  methods: {
    playSample() {
      if (!this.isPlaying) return
      console.log('playSample')
      if (this.uiSampler) {
        this.uiSampler.load(audioLibrary.uiSamples.sample())
        this.uiSampler.start()
      }
      if (this.mainSampler) {
        if (this.ticks % 8 === 0) {
          this.toggle()
          this.mainSampler.player(audioLibrary.trailerSounds.sample()).start()

          // this.mainSampler.player(audioLibrary.trailer25.sample()).start()
        } else if (this.ticks % 4 === 0) {
          this.toggle()
          this.mainSampler.player(audioLibrary.trailerSounds.sample()).start()
          // this.mainSampler.player(audioLibrary.hangDrum.sample()).start()
        }
      }
      // if (this.ticks % 8 === 0) {
      //   if (this.mainSampler) {
      //     this.mainSampler.player(audioLibrary.hangDrum.sample()).start()
      //   }
      // }
      // if (this.ticks % 16 === 0) {
      //   if (this.mainSampler) {
      //     this.mainSampler.player(audioLibrary.hangDrum.sample()).start()
      //   }
      // }
      if (
        this.sampler1 &&
        this.sampler1.state === 'stopped' &&
        this.ticks % 16 === 0
      ) {
        this.sampler1.start()
      }
      this.ticks += 1
    },
    next(e) {
      console.log('next audiomodule')
      this.toggleAudio()
      this.$emit('next')
    },
    toggle() {
      console.log('wtf')
      this.isActive = !this.isActive
      // this.playSample()
    },
    toggleAudio() {
      console.log('audiomodule toggleAudio')
      this.isPlaying = !this.isPlaying
      this.audioDialog = false

      if (!this.audioCtx) {
        this.initAudio()
        this.hasInit = true
        return
      }

      if (this.audioCtx.state === 'running') {
        this.audioCtx.suspend().then(function () {
          console.log('suspended audio')
        })
      } else if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().then(function () {
          console.log('resumed audio')
        })
      }
    },
    doCrossFade() {
      const stepSize = 0.1
      if (this.crossFade.fade.value === 1.0 || this.crossFade.fade.value <= 0) {
        this.crossDirection = !this.crossDirection
        if (this.crossFade.fade.value === 1.0) {
          const chosen = audioLibrary.availableReal.sample()
          console.log('new sample from real for 1: ', chosen)
          this.asmrChannel1.load(chosen)
        } else {
          const chosen = audioLibrary.availableFake.sample()
          console.log('new sample from fake for 2: ', chosen)
          this.asmrChannel2.load(chosen)
        }
      }
      if (this.crossDirection) {
        const val = Math.min(
          parseFloat(this.crossFade.fade.value + stepSize),
          1
        )
        this.crossFade.fade.value = val
      } else {
        const val = Math.max(
          parseFloat(this.crossFade.fade.value - stepSize),
          0
        )
        this.crossFade.fade.value = val
      }
    },
    setVolume() {
      Tone.getDestination().volume.rampTo(
        this.volume === -100 ? -Infinity : this.volume,
        0
      )
    },
    setRainVolume() {
      const volume = this.rainVolume === -100 ? -Infinity : this.rainVolume
      this.rainMaker.volume.value = volume
    },
    setFrequencies() {
      const freqs = this.calculateFrequencies(this.binauralBeat)
      this.leftEar.frequency.value = freqs.leftFrequency
      this.rightEar.frequency.value = freqs.rightFrequency
    },
    frequencyShift() {
      // const lowerBound = Math.max(0, this.binauralBeat + random(-4, 4))
      this.binauralBeat = random(1, 8)
      console.log('new bb: ', this.binauralBeat)
      const freqs = this.calculateFrequencies(this.binauralBeat)
      const rampSeconds = 20
      this.leftEar.frequency.rampTo(freqs.leftFrequency, rampSeconds)
      this.rightEar.frequency.rampTo(freqs.rightFrequency, rampSeconds)
    },
    rainShift() {
      const rampSeconds = 15
      const targetVolume = random(this.rainVolume, this.rainVolume + 6)
      this.rainMaker.volume.rampTo(targetVolume, rampSeconds)
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
      this.leftEar.volume.value = -20
      this.rightEar.volume.value = -20

      this.rainMaker = new Tone.Noise('brown').toDestination()

      this.crossFade = new Tone.CrossFade().toDestination()
      this.crossFade.fade.value = 0.5 // 0-a

      this.asmrChannel1 = new Tone.Player(
        audioLibrary.availableReal.sample()
      ).connect(this.crossFade.a)
      this.asmrChannel1.autostart = true
      this.asmrChannel1.loop = true
      this.asmrChannel1.volume.value = -3

      this.asmrChannel2 = new Tone.Player(
        audioLibrary.availableFake.sample()
      ).connect(this.crossFade.b)
      this.asmrChannel2.autostart = true
      this.asmrChannel2.loop = true
      this.asmrChannel2.volume.value = -3
      this.crossFadeInterval = setInterval(this.doCrossFade, 5000)

      const reverb = new Tone.Reverb(0.8).toDestination()
      const file1 = audioLibrary.sampleSlot1.sample()
      // this.sampler1 = new Tone.Player(file1).connect(reverb)
      const sampler1 = new Tone.Player(file1, () => {
        this.sampler1 = sampler1
        this.sampler1.playbackRate = 0.9
        this.sampler1.autostart = false
        this.sampler1.loop = false
        this.sampler1.volume.value = 6
        // this.sampler1.volume.value = 12
      }).connect(reverb) // .toDestination()
      // this.sampler1 = new Tone.Player(file1).toDestination()

      // uisamples
      const file2 = audioLibrary.uiSamples.sample()
      const uiSampler = new Tone.Player(file2, () => {
        this.uiSampler = uiSampler
        this.uiSampler.autostart = false
        this.uiSampler.loop = false
        this.uiSampler.volume.value = 18
      }).toDestination()

      /* eslint-disable */
      const urls = audioLibrary.hangDrum
        .concat(audioLibrary.trailerSounds)
        .concat(audioLibrary.trailer25)
        .reduce((acc, curr) => ((acc[curr] = curr), acc), {})
      /* eslint-enable */

      console.log('loading: ', urls)
      const mainSampler = new Tone.Players(urls, () => {
        console.log('loaded hangdrums')
        this.mainSampler = mainSampler
        this.mainSampler.volume.value = -12
      }).toDestination()

      this.setRainVolume()
      this.setVolume()
      this.setFrequencies()

      this.leftEar.start()
      this.rightEar.start()
      this.rainMaker.start()
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
  cursor: pointer;
  background-color: rgb(108, 254, 108);
  box-shadow: 0 0 9px rgb(108, 254, 108);
  justify-content: center;
  align-items: center;
}
.rec span {
  margin-left: 80px;
  color: white;
}
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
  animation: pulse 2s infinite;
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
