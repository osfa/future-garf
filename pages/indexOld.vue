<template>
  <div class="overflow-hidden">
    <vue-topprogress ref="topProgress" :speed="50" color="#000" :height="3" />
    <!-- <div class="toolbar flex flex-col fixed left p-10">
      <a @click="dumpComps">Dump</a>
      <span>{{ counter }} /{{ imgs.length }}</span>
      <div v-for="(q, idx) in qualities" :key="idx">
        <a class="pr-5" href="#" @click="setQuality(idx)">{{ q + 1 }}</a>
      </div>
    </div> -->
    <transition mode="out-in" appear name="customFade">
      <div
        v-show="!hasInit"
        class="main-play w-screen h-screen"
        @click="next()"
      >
        <div class="button-play"></div>
      </div>
    </transition>
    <transition mode="out-in" appear name="customFade">
      <div
        v-show="isPlaying && hasInit"
        class="w-6 h-6 v-controls active bg-white rounded-full"
        @click="toggleAudio()"
      ></div>
    </transition>
    <transition mode="out-in" appear name="customFade">
      <div
        v-show="!isPlaying && hasInit"
        class="v-controls button-play"
        @click="toggleAudio()"
      ></div>
    </transition>
    <!-- <Fog /> -->
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
import { the681, seedSeq, pSeq, sel80raw } from './data/panelLibrary.js'
import { audioLibrary } from './data/audioLibrary.js'

const INITIAL_FREQ = 4
// const VOTING = false

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

const baseFolder = '/imgs/_out/_out-681'
const seedFolder = '/imgs/_out/_out-seq'
const quality = '/4k/png8-64-noise-p/'

let activeSelection = the681.map(
  (item) => baseFolder + item.replace('/4k/png8-64-noise-p/', quality)
)

const PATTERN = 'gigapixel-lines'

activeSelection = pSeq
  .map((item) => seedFolder + item)
  .filter(function (str) {
    return str.indexOf(PATTERN) === -1
  })

activeSelection = seedSeq
  .map((item) => seedFolder + item)
  .filter(function (str) {
    return str.indexOf(PATTERN) === -1
  })

activeSelection = sel80raw.map(
  (item) =>
    baseFolder +
    quality +
    item.replace('.png', '-gigapixel-standard-scale-2_00x.png')
)

const start = 0
export default {
  name: 'IndexPage',
  components: { ImageCard, vueTopprogress, Fog },
  data() {
    return {
      toRemove: [],
      hasLoaded: false,
      isPlaying: false,
      hasInit: false,
      firstImg: true,
      counter: start,
      epochSwitchIdx: 8,
      cards: [{ imgUrl: activeSelection[start], show: true }], // allImgs.sample()
      imgs: activeSelection,
      availableEpochs: [10, 25, 50],
      currentEpoch: 10,
      currentWidth: 1280,
      currentHeight: 720,
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
      console.log('first image fire')
      this.hasLoaded = true
    }
  },
  beforeMount() {
    this.currentWidth = window.innerWidth
    this.currentHeight = window.innerHeight
    this.preloadedImage = new Image()
    this.preloadedImage.src = this.newRandomBackgroundForPreload()
    this.preloadedImage.onload = this.donePreLoad()
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
    markForDeletion(e, identifier) {
      e.preventDefault()
      this.toRemove.push(identifier)
      this.next()
    },
    setQuality(idx) {
      console.log(idx)
    },
    dumpComps() {
      console.log(JSON.stringify(this.toRemove))
    },
    currentImage() {
      return this.cards[this.cards.length - 1].imgUrl
    },
    randomBackgroundUrl() {
      let picked = this.imgs[Math.floor(Math.random() * this.imgs.length)]
      let epoch = picked.split('-')[6].replace('.png', '')
      return this.currentEpoch
        ? picked.replace(epoch, `${this.currentEpoch}e`)
        : picked
    },
    isHorisontal() {
      return true
      // return this.currentWidth / this.currentHeight > 1
    },
    newRandomBackgroundForPreload() {
      let newUrl = this.imgs[this.counter + 1] //this.randomBackgroundUrl()
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
    pushCard() {
      console.log('showing:', this.preloadedImage.src)
      this.counter += 1
      this.cards.push({
        imgUrl: this.preloadedImage.src.replace('-v.png', '.png'),
      })
      if (this.counter % this.epochSwitchIdx === 0) {
        this.switchSuite()
      }
      setTimeout(() => {
        this.isAnimating = false
      }, this.debounceTime)
    },
    donePreLoad(newBkgUrl) {
      console.log('donePreLoad: ', newBkgUrl)
    },
    doneLoad() {
      setTimeout(() => {
        this.mustWait = false
        this.$refs.topProgress.done()
      }, 1)
    },
    dblclick() {
      console.log('dblclick')
    },
    next(e) {
      this.firstImg = false
      this.hasInit = true

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
        if (this.sampler1 && this.sampler1.state === 'stopped') {
          this.sampler1.start()
        }
      }

      if (this.isAnimating || this.mustWait) return
      this.isAnimating = true
      this.mustWait = true
      this.$refs.topProgress.start()

      this.pushCard()

      const newBkgUrl = this.newRandomBackgroundForPreload()

      console.log('loader started:', newBkgUrl)

      this.preloadedImage = new Image()
      this.preloadedImage.src = newBkgUrl
      this.preloadedImage.onload = this.donePreLoad(newBkgUrl)

      this.frequencyShift()
      this.rainShift()

      // setTimeout(this.next, 10000)
    },
    handleResize(e) {
      this.currentWidth = window.innerWidth
      this.currentHeight = window.innerHeight
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
      // this.sampler1 = new Tone.Player(file1).connect(reverb)
      const sampler1 = new Tone.Player(file1, () => {
        this.sampler1 = sampler1
        this.sampler1.playbackRate = 0.9
        this.sampler1.autostart = false
        this.sampler1.loop = false
        this.sampler1.volume.value = 6
        // this.sampler1.volume.value = 12
      }).connect(reverb) //.toDestination()
      // this.sampler1 = new Tone.Player(file1).toDestination()

      // uisamples
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

.main-play {
  z-index: 1000;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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

.voting {
  position: absolute;
  left: 0;
  top: 0;
  background: black;
  color: white;
  z-index: 1000;
}
.voting li {
  padding: 10px;
  cursor: pointer;
}

.toolbar {
  background: white;
  padding: 5px;
  left: 5px;
  top: 5px;
  font-size: 8px;
  z-index: 1000;
}
.toolbar a {
  padding: 5px;
  cursor: pointer;
}
.toolbar a:hover,
.curated a:hover {
  text-decoration: underline;
}
.isActive {
  border: 3px solid red;
}
.display-panel {
  position: relative;
  box-sizing: border-box;
}
.tooltip {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  font-size: 12px;
  padding: 5px;
  background: white;
}
.display-panel:hover .tooltip {
  display: block;
}
.disp-panel-img {
  max-height: 95vh;
}
.curated {
  align-items: center;
}
</style>
