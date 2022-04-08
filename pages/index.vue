<template>
  <div class="overflow-hidden">
    <vue-topprogress ref="topProgress" :speed="30" color="#f00" :height="3" />
    <transition mode="out-in" appear name="customFade">
      <!-- :style="{ backgroundColor: '#86ff77' }" -->
      <div
        v-show="isPlaying"
        class="w-6 h-6 v-controls active bg-white rounded-full"
        @click="toggleAudio()"
      ></div>
    </transition>
    <transition mode="out-in" appear name="customFade">
      <div
        v-show="!isPlaying"
        class="v-controls button-play"
        @click="toggleAudio()"
      ></div>
    </transition>
    <Fog />
    <div v-for="(card, index) in cards" :key="index">
      <!-- set-animation="customFade" -->
      <ImageCard
        :key="index"
        :set-animation="firstImg ? 'fade' : undefined"
        :style="[animationDuration, { backgroundColor: card.color }]"
        :main-image-url="card.color ? undefined : card.imgUrl"
        :current-width="currentWidth"
        :current-height="currentHeight"
        @loaded="doneLoad"
        @click.native="next()"
      />
    </div>
  </div>
</template>

<script>
import * as Tone from 'tone'
import { vueTopprogress } from 'vue-top-progress'
import ImageCard from '../components/ImageCard'
import Fog from '../components/Fog'
import { allImgs } from './data/panelLibrary.js'
import { audioLibrary } from './data/audioLibrary.js'

const INITIAL_FREQ = 4

/* eslint-disable */
Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)]
}
/* eslint-disable */

export const random = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

export default {
  name: 'IndexPage',
  components: { ImageCard, vueTopprogress, Fog },
  data() {
    return {
      hasLoaded: false,
      isPlaying: false,
      firstImg: true,
      counter: 0,
      epochSwitchIdx: 8,
      cards: [{ imgUrl: allImgs.sample(), show: true }],
      imgs: allImgs,
      colors: ['#fbcbff', '#c1d3fd', '#fffd81'], // '#fea71a'], //
      availableEpochs: [10, 25, 50],
      currentEpoch: 10,
      currentWidth: 1280,
      isAnimating: false,
      animationTime: 750,
      debounceTime: 250,
      mustWait: true,
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
    }
  },
  mounted() {
    console.log('mounted')
    const first = new Image()
    first.src = this.cards[0].imgUrl
    first.onload = () => {
      this.hasLoaded = true
    }
  },
  beforeMount() {
    this.currentWidth = window.innerWidth
    this.currentHeight = window.innerHeight
    this.preloadedImage = new Image()
    this.preloadedImage.src = this.newRandomBackgroundForPreload()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    clearInterval(this.crossFadeInterval)
    window.removeEventListener('resize', this.handleResize)
  },
  computed: {
    animationDuration() {
      return { animationDuration: this.animationTime.toString() + 'ms' }
    },
  },
  methods: {
    randomBackgroundUrl() {
      let picked = this.imgs[Math.floor(Math.random() * this.imgs.length)]
      let epoch = picked.split('-')[6].replace('.png', '')
      return this.currentEpoch
        ? picked.replace(epoch, `${this.currentEpoch}e`)
        : picked
    },
    isHorisontal() {
      return this.currentWidth / this.currentHeight > 1
    },
    newRandomBackgroundForPreload() {
      let newUrl = this.randomBackgroundUrl()
      while (
        newUrl.replace('/imgs/', '') ===
        this.preloadedImage.src.split('/imgs/')[1]
      ) {
        newUrl = this.randomBackgroundUrl()
      }
      if (!this.isHorisontal()) {
        newUrl = newUrl.replace('.png', '-v.png')
      }
      const desiredResolution = '2k'
      return newUrl.replace('2k', desiredResolution)
    },
    switchSuite() {
      console.log('switch suite')
      // new audio? ui sounds swap here?
      let selected = this.availableEpochs.sample()
      while (this.currentEpoch == selected) {
        selected = this.availableEpochs.sample()
      }
      this.currentEpoch = selected
    },
    pushCard(color) {
      this.counter += 1
      this.cards.push({
        color: color,
        imgUrl: this.preloadedImage.src.replace('-v.png', '.png'),
      })
      if (this.counter % this.epochSwitchIdx === 0) {
        this.switchSuite()
      }
      setTimeout(() => {
        this.isAnimating = false
      }, this.debounceTime)
    },
    doneLoad() {
      setTimeout(() => {
        this.$refs.topProgress.done()
      }, 1)
    },
    next(e) {
      this.firstImg = false
      if (!this.audioCtx) {
        this.toggleAudio()
      } else {
        if (this.uiSampler) {
          this.uiSampler.load(audioLibrary.uiSamples.sample())
          this.uiSampler.start()
        }
        if (this.mainSampler) {
          this.mainSampler.player(audioLibrary.hangDrum.sample()).start()
        }
        if (this.sampler1.state === 'stopped') {
          this.sampler1.start()
        }
      }

      if (this.isAnimating && this.mustWait) return
      this.isAnimating = true
      const doColor = random(0, 10) > 7 ? this.colors.sample() : undefined
      this.pushCard(doColor)
      if (!doColor) {
        console.log('loader started?')
        this.$refs.topProgress.start()
        const newBkgUrl = this.newRandomBackgroundForPreload()
        this.preloadedImage = new Image()
        this.preloadedImage.src = newBkgUrl
        this.preloadedImage.onload = this.doneLoad() // this.pushCard();
      }
      this.frequencyShift()
      this.rainShift()
    },
    handleResize(e) {
      this.currentWidth = window.innerWidth
    },
    /* AUDIO */
    toggleAudio() {
      console.log('toggleAudio')
      this.isPlaying = !this.isPlaying
      this.audioDialog = false

      if (!this.audioCtx) {
        this.initAudio()
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
      let volume = this.rainVolume === -100 ? -Infinity : this.rainVolume
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
      this.sampler1 = new Tone.Player(file1).connect(reverb)
      // this.sampler1 = new Tone.Player(file1).toDestination()
      this.sampler1.playbackRate = 0.9
      this.sampler1.autostart = false
      this.sampler1.loop = false
      this.sampler1.volume.value = 6
      // this.sampler1.volume.value = 12

      //uisamples
      const file2 = audioLibrary.uiSamples.sample()
      const uiSampler = new Tone.Player(file2, () => {
        this.uiSampler = uiSampler
        this.uiSampler.autostart = false
        this.uiSampler.loop = false
        this.uiSampler.volume.value = 18
      }).toDestination()

      const urls = audioLibrary.hangDrum.reduce(
        (acc, curr) => ((acc[curr] = curr), acc),
        {}
      )
      console.log('loading: ', urls)
      const mainSampler = new Tone.Players(urls, () => {
        console.log('loaded hangdrums')
        this.mainSampler = mainSampler
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
  /* width: 50px;
  height: 50px;
  background: black;
  padding-top: 10px; */
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
  top: 2rem;
  right: 2rem;
  position: absolute;
  z-index: 1000;
  cursor: pointer;
}

.page {
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
  background-color: white;
  width: 100vw;
  height: 100vh;
  background-size: 98%;
  background-repeat: no-repeat;
  background-position: top;
  background-size: cover;
  cursor: pointer;
  padding: 1rem;
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
.v-controls.active {
  transform: scale(1);
  animation: pulse 2s infinite;
  /* background: red; */
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
