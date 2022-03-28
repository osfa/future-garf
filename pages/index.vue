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
      <!-- <div
        v-show="!isPlaying"
        class="w-8 h-8 volume bg-white rounded-full"
        @click="toggleAudio()"
      ></div> -->
      <div
        v-show="!isPlaying"
        class="w-8 h-8 volume close"
        @click="toggleAudio()"
      >
        <!-- <span class="w-4 h-4 bg-black absolute"></span> -->
      </div>
    </transition>
    <div class="fogwrapper">
      <div id="foglayer_01" class="fog">
        <div class="image01"></div>
        <div class="image02"></div>
      </div>
      <div id="foglayer_02" class="fog">
        <div class="image01"></div>
        <div class="image02"></div>
      </div>
      <div id="foglayer_03" class="fog">
        <div class="image01"></div>
        <div class="image02"></div>
      </div>
    </div>
    <div v-for="(card, index) in cards" :key="index">
      <!-- set-animation="customFade" -->
      <ImageCard
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
      epochSwitchIdx: 8,
      cards: [{ imgUrl: allImgs.sample(), show: true }],
      imgs: allImgs,
      availableEpochs: [10, 25, 60],
      currentEpoch: 10,
      currentWidth: 1280,
      isAnimating: false,
      animationTime: 750,
      debounceTime: 250,
      mustWait: true,
      volume: -36,
      rainVolume: -9,
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
      availableReal: [
        '/audio/normalized/natural/flies.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-3-windintrees.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-4-anime-ocean.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-7-blizzard.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-8-blizzard2.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-9-river.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-10-rain-thunder.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-11-rain-thunder2.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-12-forest1.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-13-forest2.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-15-rain5.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-16-cicada.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-25-ocean1.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-26-bees1.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-38-ants.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-39-rain1.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-41-fire1.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-42-forest4.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-43-campfire1.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-47-forest3.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-52-fire2.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-53-campfire2.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-54-howling-wind.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-56-rain4.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-57-rain3.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-58-rain2.mp3',
        '/audio/normalized/natural/garf-arr-amb-n-relaxing-wind.mp3',
        '/audio/normalized/natural/garfprayer-3-cave.mp3',
        '/audio/normalized/natural/garfprayer-4-ocean.mp3',
        '/audio/normalized/natural/garfprayer-5-rain1.mp3',
        '/audio/normalized/natural/garfprayer-6-rain2.mp3',
        '/audio/normalized/natural/garfprayer-7-rain3.mp3',
        '/audio/normalized/natural/garfprayer-14-tropical.mp3',
        '/audio/normalized/natural/garfprayer-15-tropical2.mp3',
        '/audio/normalized/natural/garfprayer-17-war.mp3',
        '/audio/normalized/natural/garfprayer-18-wind1.mp3',
        '/audio/normalized/natural/garfprayer-19-wind2.mp3',
      ],
      availableFake: [
        '/audio/normalized/synth/garf-arr-amb-n-2-truck-idling.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-5-pod-sound1.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-6-pod-sound2.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-14-fan.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-17-scifi3.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-18-scifi4.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-19-radio1.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-20-radio2.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-21-scifi1.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-22-scifi2.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-23-flying-above-clouds.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-24-millenium-falcon.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-27-flag sounds.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-28-templar1.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-29-templar2.mp3',
        // '/audio/normalized/synth/garf-arr-amb-n-30-library.mp3',
        // '/audio/normalized/synth/garf-arr-amb-n-31-dark-academia.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-32-bowl1.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-33-anime-cicada.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-34-village-ambience.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-35-heavy-rain.mp3',
        // '/audio/normalized/synth/garf-arr-amb-n-36-bacon.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-37-pod-sound3.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-40-rain-woods-bowl.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-44-meditation-bowls-2.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-45-bowl3.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-46-bowl2.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-48-office.mp3',
        // '/audio/normalized/synth/garf-arr-amb-n-49-prayers.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-50-talking.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-51-meditation-bowls.mp3',
        '/audio/normalized/synth/garf-arr-amb-n-55-engine-shifting.mp3',
        '/audio/normalized/synth/garfprayer-1-airplane1.mp3',
        '/audio/normalized/synth/garfprayer-2-airplane2.mp3',
        '/audio/normalized/synth/garfprayer-8-server1.mp3',
        '/audio/normalized/synth/garfprayer-9-server2.mp3',
        '/audio/normalized/synth/garfprayer-10-tapping1.mp3',
        '/audio/normalized/synth/garfprayer-11-tapping2.mp3',
        '/audio/normalized/synth/garfprayer-12-tapping3.mp3',
        '/audio/normalized/synth/garfprayer-13-tiktock.mp3',
        '/audio/normalized/synth/garfprayer-16-war-propeller.mp3',
      ],
      sampleSlot1: [
        '/audio/prayers/prayer1.mp3',
        '/audio/prayers/prayer2.mp3',
        '/audio/prayers/prayer3.mp3',
        '/audio/prayers/prayer4.mp3',
      ],
      uiSamples: ['/audio/ui/pop1.mp3'],
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
      let picked = this.imgs[Math.floor(Math.random() * this.imgs.length)]
      let epoch = picked.split('-')[6].replace('.png', '')
      return this.currentEpoch
        ? picked.replace(epoch, `${this.currentEpoch}e`)
        : picked
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
      console.log('pushCard')
      this.counter += 1
      this.cards.push({
        imgUrl: this.preloadedImage.src.replace('-v.png', '.png'),
        show: true,
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
      if (!this.audioCtx) {
        this.toggleAudio()
      } else {
        if (this.uiSampler.state === 'stopped') {
          this.uiSampler.start()
        }
        if (this.sampler1.state === 'stopped') {
          this.sampler1.start()
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
          const chosen = this.availableReal.sample()
          console.log('new sample from real for 1: ', chosen)
          this.asmrChannel1.load(chosen)
        } else {
          const chosen = this.availableFake.sample()
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
      this.leftEar.volume.value = -16
      this.rightEar.volume.value = -16

      this.rainMaker = new Tone.Noise('brown').toDestination()

      this.crossFade = new Tone.CrossFade().toDestination()
      this.crossFade.fade.value = 0.5 // 0-a

      this.asmrChannel1 = new Tone.Player(this.availableReal.sample()).connect(
        this.crossFade.a
      )
      this.asmrChannel1.autostart = true
      this.asmrChannel1.loop = true
      this.asmrChannel1.volume.value = -3

      this.asmrChannel2 = new Tone.Player(this.availableFake.sample()).connect(
        this.crossFade.b
      )
      this.asmrChannel2.autostart = true
      this.asmrChannel2.loop = true
      this.asmrChannel2.volume.value = -3
      this.crossFadeInterval = setInterval(this.doCrossFade, 5000)

      const reverb = new Tone.Reverb(0.8).toDestination()
      const file1 = this.sampleSlot1.sample()
      this.sampler1 = new Tone.Player(file1).connect(reverb)
      // this.sampler1 = new Tone.Player(file1).toDestination()
      this.sampler1.playbackRate = 0.9
      this.sampler1.autostart = false
      this.sampler1.loop = false
      this.sampler1.volume.value = 6
      // this.sampler1.volume.value = 12

      const file2 = this.uiSamples.sample()
      this.uiSampler = new Tone.Player(file2).toDestination()
      this.uiSampler.autostart = false
      this.uiSampler.loop = false
      this.uiSampler.volume.value = 18

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
  cursor: pointer;
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

.close {
  position: absolute;
  /* right: 32px;
  top: 32px;
  width: 32px;
  height: 32px;
  opacity: 0.3; */
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

html,
body {
  margin: 0;
  padding: 0;
}
body {
  background: #000;
  background: rgba(0, 0, 0, 1);
  overflow-x: hidden;
}

/* ---------- Fog ---------- */
.fogwrapper {
  height: 100%;
  position: absolute;
  top: 0;
  width: 100%;
  /* -webkit-filter: blur(1px) grayscale(0.2) saturate(1.2) sepia(0.2);
  filter: blur(1px) grayscale(0.2) saturate(1.2) sepia(0.2); */
  z-index: 100;
  opacity: 0.8;
  pointer-events: none;
}
#foglayer_01,
#foglayer_02,
#foglayer_03 {
  height: 100%;
  position: absolute;
  width: 200%;
}
#foglayer_01 {
  animation: foglayer_01_opacity 10s linear infinite,
    foglayer_moveme 90s linear infinite;
}
#foglayer_02 {
  animation: foglayer_02_opacity 21s linear infinite,
    foglayer_moveme 92s linear infinite;
}
#foglayer_03 {
  animation: foglayer_02_opacity 21s linear infinite,
    foglayer_moveme 94s linear infinite;
}

#foglayer_01,
#foglayer_01 {
  background: url('/imgs/fog1.png') center center/cover no-repeat transparent;
}
#foglayer_02,
#foglayer_03 {
  background: url('/imgs/2fog2.png') center center/cover no-repeat transparent;
}
/* 
@keyframes foglayer_01_opacity {
  0% {
    opacity: 0.1;
  }
  22% {
    opacity: 0.5;
  }
  40% {
    opacity: 0.28;
  }
  58% {
    opacity: 0.4;
  }
  80% {
    opacity: 0.16;
  }
  100% {
    opacity: 0.1;
  }
}
@keyframes foglayer_02_opacity {
  0% {
    opacity: 0.5;
  }
  25% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.1;
  }
  80% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.5;
  }
}
@-webkit-keyframes foglayer_03_opacity {
  0% {
    opacity: 0.8;
  }
  27% {
    opacity: 0.2;
  }
  52% {
    opacity: 0.6;
  }
  68% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.8;
  }
}
@keyframes foglayer_03_opacity {
  0% {
    opacity: 0.8;
  }
  27% {
    opacity: 0.2;
  }
  52% {
    opacity: 0.6;
  }
  68% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.8;
  }
} */
/* ---------- Keyframe moveMe ---------- */
@keyframes foglayer_moveme {
  0% {
    left: 0;
  }
  50% {
    left: -100%;
  }
  100% {
    left: 0%;
  }
}
</style>
