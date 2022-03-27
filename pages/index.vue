<template>
  <div class="overflow-hidden">
    <vue-topprogress ref="topProgress" :speed="100" color="#fff" :height="1" />
    <transition mode="out-in" appear name="customFade">
      <div
        v-show="isPlaying"
        class="w-8 h-8 volume active bg-white rounded-full border"
        @click="toggleAudio()"
      ></div>
    </transition>
    <transition mode="out-in" appear name="customFade">
      <div
        v-show="!isPlaying"
        class="w-8 h-8 volume bg-white border-4 border-black rounded-full"
        @click="toggleAudio()"
      ></div>
    </transition>

    <div v-for="(card, index) in cards" :key="index">
      <!-- set-animation="customFade" -->
      <ImageCard
        set-animation="customFade"
        :key="index"
        :style="animationDuration"
        :main-image-url="card.imgUrl"
        :current-width="currentWidth"
        @click.native="next()"
      />
    </div>
    <!--     <ImageCard :style="animationDuration" :main-image-url='imgs.sample()' :current-width='currentWidth' @click.native="next()" set-animation='fade' /> -->
  </div>
</template>

<script>
import * as Tone from 'tone'
import { vueTopprogress } from 'vue-top-progress'
import ImageCard from '../components/ImageCard'

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

const allImgs = [
  '/imgs/2k-dithered-16bit/1992-09-22-2-10e.png',
  '/imgs/2k-dithered-16bit/1992-09-22-2-25e.png',
  '/imgs/2k-dithered-16bit/1992-09-22-2-5e.png',
  '/imgs/2k-dithered-16bit/1992-09-22-2-60e.png',
  '/imgs/2k-dithered-16bit/1992-10-01-0-10e.png',
  '/imgs/2k-dithered-16bit/1992-10-01-0-25e.png',
  '/imgs/2k-dithered-16bit/1992-10-01-0-5e.png',
  '/imgs/2k-dithered-16bit/1992-10-01-0-60e.png',
  '/imgs/2k-dithered-16bit/1992-10-01-1-10e.png',
  '/imgs/2k-dithered-16bit/1992-10-01-1-25e.png',
  '/imgs/2k-dithered-16bit/1992-10-01-1-5e.png',
  '/imgs/2k-dithered-16bit/1992-10-01-1-60e.png',
  '/imgs/2k-dithered-16bit/1992-10-01-2-10e.png',
  '/imgs/2k-dithered-16bit/1992-10-01-2-25e.png',
  '/imgs/2k-dithered-16bit/1992-10-01-2-5e.png',
  '/imgs/2k-dithered-16bit/1992-10-01-2-60e.png',
  '/imgs/2k-dithered-16bit/1992-10-10-0-10e.png',
  '/imgs/2k-dithered-16bit/1992-10-10-0-25e.png',
  '/imgs/2k-dithered-16bit/1992-10-10-0-5e.png',
  '/imgs/2k-dithered-16bit/1992-10-10-0-60e.png',
  '/imgs/2k-dithered-16bit/1992-10-10-1-10e.png',
  '/imgs/2k-dithered-16bit/1992-10-10-1-25e.png',
  '/imgs/2k-dithered-16bit/1992-10-10-1-5e.png',
  '/imgs/2k-dithered-16bit/1992-10-10-1-60e.png',
  '/imgs/2k-dithered-16bit/1992-11-06-0-10e.png',
  '/imgs/2k-dithered-16bit/1992-11-06-0-25e.png',
  '/imgs/2k-dithered-16bit/1992-11-06-0-5e.png',
  '/imgs/2k-dithered-16bit/1992-11-06-0-60e.png',
  '/imgs/2k-dithered-16bit/1995-04-04-0-10e.png',
  '/imgs/2k-dithered-16bit/1995-04-04-0-25e.png',
  '/imgs/2k-dithered-16bit/1995-04-04-0-5e.png',
  '/imgs/2k-dithered-16bit/1995-04-04-0-60e.png',
  '/imgs/2k-dithered-16bit/1995-04-04-1-10e.png',
  '/imgs/2k-dithered-16bit/1995-04-04-1-25e.png',
  '/imgs/2k-dithered-16bit/1995-04-04-1-5e.png',
  '/imgs/2k-dithered-16bit/1995-04-04-1-60e.png',
  '/imgs/2k-dithered-16bit/1995-04-04-2-10e.png',
  '/imgs/2k-dithered-16bit/1995-04-04-2-25e.png',
  '/imgs/2k-dithered-16bit/1995-04-04-2-5e.png',
  '/imgs/2k-dithered-16bit/1995-04-04-2-60e.png',
  '/imgs/2k-dithered-16bit/1995-05-05-0-10e.png',
  '/imgs/2k-dithered-16bit/1995-05-05-0-25e.png',
  '/imgs/2k-dithered-16bit/1995-05-05-0-5e.png',
  '/imgs/2k-dithered-16bit/1995-05-05-0-60e.png',
  '/imgs/2k-dithered-16bit/1995-05-05-1-10e.png',
  '/imgs/2k-dithered-16bit/1995-05-05-1-25e.png',
  '/imgs/2k-dithered-16bit/1995-05-05-1-5e.png',
  '/imgs/2k-dithered-16bit/1995-05-05-1-60e.png',
  '/imgs/2k-dithered-16bit/1995-05-05-2-10e.png',
  '/imgs/2k-dithered-16bit/1995-05-05-2-5e.png',
]

export default {
  name: 'IndexPage',
  components: { ImageCard, vueTopprogress },
  data() {
    return {
      isPlaying: false,
      counter: 0,
      cards: [{ imgUrl: allImgs.sample(), show: true }],
      imgs: allImgs,
      currentWidth: 1280,
      isAnimating: false,
      animationTime: 750,
      debounceTime: 100,
      mustWait: true,
      volume: -30,
      rainVolume: -6,
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
      uiSampler: undefined,
      asmrChannel1: undefined,
      asmrChannel2: undefined,
      availableAsmr1: [
        '/audio/tapping1.mp3',
        '/audio/tapping2.mp3',
        '/audio/tapping3.mp3',
        '/audio/server1.mp3',
        '/audio/server2.mp3',
        '/audio/rain1.mp3',
        '/audio/rain2.mp3',
        '/audio/rain3.mp3',
        '/audio/tiktock.mp3',
        '/audio/war.mp3',
      ],
      availableAsmr2: [
        '/audio/cave.mp3',
        '/audio/war-propeller.mp3',
        '/audio/tropical.mp3',
        '/audio/wind1.mp3',
        '/audio/wind2.mp3',
        '/audio/airplane1.mp3',
        '/audio/airplane2.mp3',
        '/audio/ocean.mp3',
        '/audio/fireplace.mp3',
      ],
      sampleSlot1: [
        '/audio/tos/homer-facebook.mp3',
        '/audio/tos/krusty-insta.mp3',
        '/audio/tos/scooby-facebook.mp3',
        '/audio/tos/shaggy-instagram.mp3',
        '/audio/tos/sponge-tos-complete.mp3',
      ],
      uiSamples: ['/audio/ui/pop1.ogg'],
      availableTos: [
        '/audio/tos/homer-facebook.mp3',
        '/audio/tos/krusty-insta.mp3',
        '/audio/tos/scooby-facebook.mp3',
        '/audio/tos/shaggy-instagram.mp3',
        '/audio/tos/sponge-tos-complete.mp3',
      ],
    }
  },
  mounted() {
    console.log('mounted')
    // this.initAudio();
    // var synth = new Tone.Synth().toMaster();
    // synth.triggerAttackRelease("C4", "8n");
  },
  beforeMount() {
    this.currentWidth = window.innerWidth
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
      return this.imgs[Math.floor(Math.random() * this.imgs.length)]
    },
    newRandomBackgroundForPreload() {
      let newUrl = this.randomBackgroundUrl()
      while (
        newUrl.replace('/imgs/', '') ===
        this.preloadedImage.src.split('/imgs/')[1]
      ) {
        newUrl = this.randomBackgroundUrl()
      }
      if (this.currentWidth < 1024) {
        newUrl = newUrl.replace('.png', '-v.png')
      }
      const desiredResolution = '2k'
      return newUrl.replace('2k', desiredResolution)
    },
    pushCard() {
      console.log('pushCard')
      this.counter += 1
      this.cards.push({
        imgUrl: this.preloadedImage.src.replace('-v.png', '.png'),
        show: true,
      })
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
      if (!this.audioCtx) {
        this.toggleAudio()
      } else {
        if (this.uiSampler.state === 'stopped') {
          // this.uiSampler.start()
        }
      }

      if (this.isAnimating && this.mustWait) return
      this.isAnimating = true
      this.$refs.topProgress.start()
      this.pushCard()

      const newBkgUrl = this.newRandomBackgroundForPreload()
      this.preloadedImage = new Image()
      this.preloadedImage.src = newBkgUrl
      this.preloadedImage.onload = this.doneLoad() // this.pushCard();
      this.frequencyShift()
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
      const stepSize = 0.15
      if (this.crossFade.fade.value === 1.0 || this.crossFade.fade.value <= 0) {
        this.crossDirection = !this.crossDirection
        if (this.crossFade.fade.value === 1.0) {
          const chosen = this.availableAsmr1.sample()
          console.log('new sample 1: ', chosen)
          this.asmrChannel1.load(chosen)
        } else {
          const chosen = this.availableAsmr2.sample()
          console.log('new sample 2: ', chosen)
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
      this.binauralBeat = random(1, 6)
      const freqs = this.calculateFrequencies(this.binauralBeat)
      const rampSeconds = 60
      this.leftEar.frequency.rampTo(freqs.leftFrequency, rampSeconds)
      this.rightEar.frequency.rampTo(freqs.rightFrequency, rampSeconds)
    },
    rainShift() {
      const rampSeconds = 15
      const targetVolume = random(-6, 3)
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
      this.leftEar.volume.value = -16
      this.rightEar.volume.value = -16

      this.rainMaker = new Tone.Noise('brown').toDestination()

      // new Tone.Noise("pink").toDestination().start();

      this.crossFade = new Tone.CrossFade().toDestination()
      this.crossFade.fade.value = 0.5 // 0-a

      this.asmrChannel1 = new Tone.Player(this.availableAsmr1.sample()).connect(
        this.crossFade.a
      )
      this.asmrChannel1.autostart = true
      this.asmrChannel1.loop = true
      this.asmrChannel1.volume.value = 6

      this.asmrChannel2 = new Tone.Player(this.availableAsmr2.sample()).connect(
        this.crossFade.b
      )
      this.asmrChannel2.autostart = true
      this.asmrChannel2.loop = true
      this.asmrChannel2.volume.value = 6
      this.crossFadeInterval = setInterval(this.doCrossFade, 1000)

      const file1 = this.sampleSlot1.sample()
      this.sampler1 = new Tone.Player(file1).toDestination()
      this.sampler1.autostart = false
      this.sampler1.loop = false
      this.sampler1.volume.value = 0

      const file2 = this.uiSamples.sample()
      this.uiSampler = new Tone.Player(file2).toDestination()
      this.uiSampler.autostart = false
      this.uiSampler.loop = false
      this.uiSampler.volume.value = 18
      // this.uiSampler.load(this.uiSamples.sample())

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
.volume {
  /* width: 2vw;
  height: 2vw; */
  /* border-radius: 2vw; */
  top: 1vw;
  right: 1vw;
  position: absolute;
  z-index: 1000;
  cursor: pointer;
  /* border-style: solid; */
}

.page {
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
  background-color: black;
  width: 100vw;
  height: 100vh;
  background-size: 98%;
  background-repeat: no-repeat;
  background-position: top;
  background-size: cover;
}

.customFade-enter-active,
.customFade-leave-active {
  transition: all 250ms cubic-bezier(1, 0.5, 0.8, 1);
  /*transition: opacity 5s;*/
}
.customFade-enter,
.customFade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100vw);
  opacity: 0;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
.volume.active {
  transform: scale(1);
  animation: pulse 2s infinite;
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
</style>
