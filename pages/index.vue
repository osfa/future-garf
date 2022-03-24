<template>
    <div class="overflow-hidden">
    <vue-topprogress ref="topProgress" :speed="100" color="#fff" :height="1"/>
    <div v-for="(card, index) in cards" :key="index">
      <ImageCard :key="index" :style="animationDuration" :main-image-url='card.imgUrl' :current-width='currentWidth' @click.native="next()"/>
    </div>
    </div>
</template>

<script>
import * as Tone from 'tone'
import { vueTopprogress } from 'vue-top-progress'
import ImageCard from '../components/ImageCard'

const INITIAL_FREQ = 4;

/* eslint-disable */
 Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};
/* eslint-disable */

export const random = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

const allImgs = [
  '/imgs/dithered-8bit/1992-09-22-2-10e.png',
  '/imgs/dithered-8bit/1992-09-22-2-25e.png',
  '/imgs/dithered-8bit/1992-09-22-2-5e.png',
  '/imgs/dithered-8bit/1992-10-01-0-25e.png',
  '/imgs/dithered-8bit/1992-10-01-0-5e.png',
  '/imgs/dithered-8bit/1992-10-01-0-60e.png',
  '/imgs/dithered-8bit/1992-10-01-1-10e.png',
  '/imgs/dithered-8bit/1992-10-01-1-25e.png',
  '/imgs/dithered-8bit/1992-10-01-1-5e.png',
  '/imgs/dithered-8bit/1992-10-01-1-60e.png',
  '/imgs/dithered-8bit/1992-10-01-2-10e.png',
  '/imgs/dithered-8bit/1992-10-01-2-25e.png',
  '/imgs/dithered-8bit/1992-10-01-2-5e.png',
  '/imgs/dithered-8bit/1992-10-10-0-10e.png',
  '/imgs/dithered-8bit/1992-10-10-0-25e.png',
  '/imgs/dithered-8bit/1992-10-10-0-5e.png',
  '/imgs/dithered-8bit/1992-10-10-0-60e.png',
]

export default {
  name: 'IndexPage',
  components: { ImageCard, vueTopprogress },
  data() {
    return {
      counter: 0,
      cards: [ { imgUrl: allImgs[0], show: true }],
      imgs: allImgs,
      mainImageUrl: allImgs[0],
      currentWidth: 1280,
      isAnimating: false,
      animationTime: 1500,
      mustWait: true,
      volume: -30,
      rainVolume: -3,
      leftEar: undefined,
      rightEar: undefined,
      binauralBeat: INITIAL_FREQ,
      audioCtx: undefined,
      crossFade: undefined,
      crossDirection: false,
      crossFadeInterval: undefined,
      rainMaker: undefined,
      audioDialog: true,
      tosPlayer: undefined,
      asmrChannel1: undefined,
      asmrChannel2: undefined,
      availableAsmr1: [
        "/audio/tapping1.mp3",
        "/audio/tapping2.mp3",
        "/audio/tapping3.mp3",
        "/audio/server1.mp3",
        "/audio/server2.mp3",
        "/audio/rain1.mp3",
        "/audio/rain2.mp3",
        "/audio/rain3.mp3",
        "/audio/tiktock.mp3",
      ],
      availableAsmr2: [
        "/audio/cave.mp3",
        "/audio/war-propeller.mp3",
        "/audio/tropical.mp3",
        "/audio/wind1.mp3",
        "/audio/wind2.mp3",
        "/audio/airplane1.mp3",
        "/audio/airplane2.mp3",
        "/audio/ocean.mp3",
        "/audio/fireplace.mp3",
      ],
      availableTos: [
        "/audio/tos/homer-facebook.mp3",
        "/audio/tos/krusty-insta.mp3",
        "/audio/tos/scooby-facebook.mp3",
        "/audio/tos/shaggy-instagram.mp3",
        "/audio/tos/sponge-tos-complete.mp3",
      ]
    };
  },
  mounted() {
    console.log('mounted');
    // this.initAudio();
    // var synth = new Tone.Synth().toMaster();
    // synth.triggerAttackRelease("C4", "8n");
  },
  beforeMount() {
    this.currentWidth = window.innerWidth
    this.preloadedImage = new Image(); 
    this.preloadedImage.src = this.newRandomBackgroundForPreload();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    clearInterval(this.crossFadeInterval);
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {
    animationDuration(){
      return { animationDuration: this.animationTime.toString() + 'ms' }
    }
  },
  methods: {
    randomBackgroundUrl() {
      return this.imgs[Math.floor(Math.random()*this.imgs.length)]
    },
    newRandomBackgroundForPreload() {
      let newUrl = this.randomBackgroundUrl();
      const prev = this.preloadedImage ? this.preloadedImage.src : '';
      while(newUrl === prev){
        newUrl = this.randomBackgroundUrl();
      }
      return newUrl;
    },
    pushCard(){        
        this.counter += 1
        this.cards.push({ imgUrl: this.preloadedImage.src, show: true })
        setTimeout(() => { 
          this.isAnimating = false
        }, this.animationTime);
    },
    doneLoad(){
      setTimeout(() => { 
        this.$refs.topProgress.done();
      }, 1);
    },
    next(e) {
      if(!this.audioCtx){
        this.toggleAudio()
      }

      if(this.isAnimating && this.mustWait) return
      this.isAnimating = true
      this.$refs.topProgress.start()
      this.pushCard();

      const newBkgUrl = this.newRandomBackgroundForPreload();
      this.preloadedImage = new Image(); 
      this.preloadedImage.src = newBkgUrl;
      this.preloadedImage.onload = this.doneLoad(); // this.pushCard();
      this.frequencyShift();
    },
    handleResize(e) {
      this.currentWidth = window.innerWidth
    },
    /* AUDIO */
    toggleAudio() {
      console.log("toggleAudio");
      this.audioDialog = false;

      if (!this.audioCtx) {
        this.initAudio();
        return;
      }

      if (this.audioCtx.state === "running") {
        this.audioCtx.suspend().then(function () {
          console.log("suspended audio");
        });
      } else if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume().then(function () {
          console.log("resumed audio");
        });
      }
    },
    doCrossFade() {
      const stepSize = 0.1;
      if (this.crossFade.fade.value === 1.0 || this.crossFade.fade.value <= 0) {
        this.crossDirection = !this.crossDirection;
        if (this.crossFade.fade.value === 1.0) {
          this.asmrChannel1.load(this.availableAsmr1.sample());
        } else {
          this.asmrChannel2.load(this.availableAsmr2.sample());
        }
      }
      if (this.crossDirection) {
        const val = Math.min(
          parseFloat(this.crossFade.fade.value + stepSize),
          1
        );
        this.crossFade.fade.value = val;
      } else {
        const val = Math.max(
          parseFloat(this.crossFade.fade.value - stepSize),
          0
        );
        this.crossFade.fade.value = val;
      }
    },
    setVolume() {
      Tone.getDestination().volume.rampTo(
        this.volume === -100 ? -Infinity : this.volume,
        0
      );
    },
    setRainVolume() {
      let volume = this.rainVolume === -100 ? -Infinity : this.rainVolume;
      this.rainMaker.volume.value = volume;
    },
    setFrequencies() {
      const freqs = this.calculateFrequencies(this.binauralBeat);
      this.leftEar.frequency.value = freqs.leftFrequency;
      this.rightEar.frequency.value = freqs.rightFrequency;
    },
    frequencyShift() {
      this.binauralBeat = random(1, 6);
      const freqs = this.calculateFrequencies(this.binauralBeat);
      const rampSeconds = 60;
      this.leftEar.frequency.rampTo(freqs.leftFrequency, rampSeconds);
      this.rightEar.frequency.rampTo(freqs.rightFrequency, rampSeconds);
    },
    rainShift() {
      const rampSeconds = 15;
      const targetVolume = random(-6, 3);
      this.rainMaker.volume.rampTo(targetVolume, rampSeconds);
    },
    calculateCarrierFrequency(binauralBeat) {
      // Formula retrieved by using excel on Oster's curve. Can be enhanced with real maths ;)
      // y = -0,2085x2 + 18,341x + 56,31
      return (
        -0.2085 * Math.pow(binauralBeat, 2) + 18.341 * binauralBeat + 56.31
      );
    },
    calculateFrequencies(binauralBeat) {
      const carrierFreq = this.calculateCarrierFrequency(binauralBeat);
      return {
        leftFrequency: carrierFreq + binauralBeat / 2,
        rightFrequency: carrierFreq - binauralBeat / 2,
      };
    },
    handleFrequencyChange(actualFrequency) {
      const { leftFrequency, rightFrequency } =
        this.calculateFrequencies(actualFrequency);
    },
    initAudio() {
      console.log('initAudio');
      const context = new Tone.Context();
      Tone.setContext(context);
      this.audioCtx = context.rawContext;

      const merge = new Tone.Merge().toDestination();
      // const vol = new Tone.Volume(-90).toDestination();
      // merge.connect()
      this.leftEar = new Tone.Oscillator().connect(merge, 0, 0);
      this.rightEar = new Tone.Oscillator().connect(merge, 0, 1);
      this.leftEar.volume.value = -12;
      this.rightEar.volume.value = -12;

      this.rainMaker = new Tone.Noise("brown").toDestination();

      // new Tone.Noise("pink").toDestination().start();

      this.crossFade = new Tone.CrossFade().toDestination();
      this.crossFade.fade.value = 0.5; // 0-a

      this.asmrChannel1 = new Tone.Player(this.availableAsmr1.sample()).connect(
        this.crossFade.a
      );
      this.asmrChannel1.autostart = true;
      this.asmrChannel1.loop = true;
      this.asmrChannel1.volume.value = 12;

      this.asmrChannel2 = new Tone.Player(this.availableAsmr2.sample()).connect(
        this.crossFade.b
      );
      this.asmrChannel2.autostart = true;
      this.asmrChannel2.loop = true;
      this.asmrChannel2.volume.value = 6;
      this.crossFadeInterval = setInterval(this.doCrossFade, 5000);

      const file = this.availableTos.sample()
      this.tosPlayer = new Tone.Player(file).toDestination();
      this.tosPlayer.autostart = false;
      this.tosPlayer.loop = false;
      this.tosPlayer.volume.value = 0;

      this.setRainVolume();
      this.setVolume();
      this.setFrequencies();

      this.leftEar.start();
      this.rightEar.start();
      this.rainMaker.start();
    },

  },
}
</script>
<style scoped>

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
  background-position: center;
  background-size: cover;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 2.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
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
</style>