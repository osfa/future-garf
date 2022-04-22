<template>
  <div id="app">
    <Tinder
      ref="tinder"
      key-name="id"
      :queue.sync="queue"
      :max="4"
      :offset-y="10"
      allow-down
      @submit="onSubmit"
    >
      <template slot-scope="scope">
        <div class="pic" :class="{ active: scope.data.counter % 4 === 0 }">
          <transition appear name="fade">
            <img
              v-show="scope.data.loaded"
              :src="`/imgs/2k/png8-16-noise-p/${scope.data.id}`"
              @load="scope.data.loaded = true"
            />
          </transition>
        </div>
      </template>
    </Tinder>
    <Fog />
    <SmallClock />
    <audio-module
      ref="audioModule"
      :automatic-fade="false"
      @next="next"
      @toggleAudio="toggleAudio"
    />
  </div>
</template>

<script>
import Tinder from '../components/vue-tinder/Tinder.vue'
import Fog from '../components/Fog'
import SmallClock from '../components/SmallClock'
import AudioModule from '../components/AudioModule.vue'
import { the330 as source } from './data/panelLibrary.js'

/* eslint-disable */
Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)]
}
/* eslint-disable */
export default {
  name: 'App',
  components: { Tinder, Fog, SmallClock, 'audio-module': AudioModule },
  data: () => ({
    queue: [],
    offset: 0,
    history: [],
    tickInterval: 1000,
    isPaused: true,
  }),
  created() {
    this.$gtag.pageview(this.$route)
    this.mock()
  },
  mounted() {
    this.kioskMode = this.$route.query.kioskMode
    if (this.kioskMode) {
      this.tick()
    }
  },
  methods: {
    tick() {
      setTimeout(() => {
        if (!this.isPaused) this.decide(['like', 'nope', 'super'].sample())
        this.tick()
      }, [10000, 2500, 1000].sample())
    },
    next(e) {
      console.log('next')
      this.decide(['like', 'nope', 'super'].sample())
    },
    toggleAudio() {
      this.isPaused = !this.isPaused
    },
    mock(count = 5, append = true) {
      const list = []
      for (let i = 0; i < count; i++) {
        list.push({
          id: source[this.offset % source.length],
          counter: this.offset,
          loaded: false,
        })
        this.offset++
      }
      if (append) {
        this.queue = this.queue.concat(list)
      } else {
        this.queue.unshift(...list)
      }
    },
    onSubmit({ item }) {
      if (this.$refs.audioModule) {
        this.$refs.audioModule.playSample()
      }
      if (this.queue.length < 3) {
        this.mock()
      }
      this.history.push(item)
    },
    decide(choice) {
      console.log('decide:', choice)
      this.$refs.tinder.decide(choice)
    },
  },
}
</script>

<style>
body {
  margin: 0;

  background-color: lightblue;
  animation: backgroundAnimate 15s infinite;

  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@keyframes backgroundAnimate {
  from {
    background-color: lightblue;
  }
  to {
    background-color: darkgrey;
  }
}

#app .vue-tinder {
  position: absolute;
  z-index: 1000;

  left: 0;
  right: 0;
  top: 6%;
  margin: auto;

  width: calc(100% - 10%);
  /* height: calc(100% - 23px - 65px - 47px - 16px); */

  height: calc(100% - 6% - 65px);
  max-width: 85vw;
}

@media (orientation: landscape) {
  #app .vue-tinder {
    top: 5%;
    height: calc(100% - 5% - 65px);
    max-width: 25vw;
    min-width: 480px;
  }
}

/* 4k standing */
/* handle via zoom and rem instead? */
@media (orientation: portrait) and (min-width: 2000px) {
  #app .vue-tinder {
    top: 3%;
    height: calc(100% - 6% - 65px);
    max-width: 80vw;
  }
}

.tinder-card {
  border: 7px solid white;
}

.pic {
  width: 100%;
  height: 100%;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pic {
  background-color: #ededed;
  background: linear-gradient(
      100deg,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 60%
    )
    #ededed;
  background-size: 200% 100%;
  background-position-x: 180%;
  animation: 2s loading ease-in-out infinite;
}

@keyframes loading {
  to {
    background-position-x: -20%;
  }
}

.pic img {
  pointer-events: none;
  object-fit: cover;
  height: 100%;
  width: 100%;
}

@keyframes scale {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.1);
  }
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(1px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-1px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(1px, 0, 0);
  }
}

.btns {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30px;
  margin: auto;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 300px;
  max-width: 516px;
}

.btns img {
  margin-right: 12px;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.btns img:nth-child(2n + 1) {
  width: 53px;
}

.btns img:nth-child(2n) {
  width: 65px;
}

.btns img:nth-last-child(1) {
  margin-right: 0;
}

/* .vue-tinder.right-end,
.vue-tinder.left-end {
  transform: translateZ(20px);
}
.vue-tinder.right-end .tinder-card:nth-child(1) {
  animation: rightEnd 0.2s ease-in-out;
}
.vue-tinder.left-end .tinder-card:nth-child(1) {
  animation: leftEnd 0.2s ease-in-out;
}
@keyframes leftEnd {
  50% {
    transform: rotateY(8deg);
  }
}
@keyframes rightEnd {
  50% {
    transform: rotateY(-8deg);
  }
} */
</style>
