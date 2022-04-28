<template>
  <div class="overflow-hidden">
    <audio-module ref="audioModule" />
    <Fog />
    <clock-component />
  </div>
</template>

<script>
import Fog from '../components/Fog'
import AudioModule from '../components/AudioModule.vue'
import ClockComponent from '../components/Clock.vue'

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
  components: { Fog, ClockComponent, 'audio-module': AudioModule },
  mounted() {
    console.log('mounted')
  },
  // beforeMount() {
  //   window.addEventListener('resize', this.handleResize)
  // },
  // beforeDestroy() {
  //   clearInterval(this.crossFadeInterval)
  //   window.removeEventListener('resize', this.handleResize)
  // },
  methods: {},
}
</script>
<style scoped>
body {
  background-color: #333 !important;
}
</style>
