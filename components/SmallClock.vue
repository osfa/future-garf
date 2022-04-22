<template>
  <div class="clock-container font-weight-light">
    <div v-if="isUnixTime" class="clock-inner">
      <div class="hour text-white">{{ unix }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClockComponent',
  props: {
    isUnixTime: { type: Boolean, default: true },
  },
  data() {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      unix: '-',
    }
  },
  mounted() {
    this.setTime()
  },
  methods: {
    setTime() {
      setInterval(() => {
        this.unix = Math.round(new Date().getTime() / 100)
      }, 100)
    },
  },
}
</script>

<style>
.clock-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  flex-direction: column;
  z-index: 10000;
  font-family: 'Roboto';
  pointer-events: none;

  font-size: 1rem;
  letter-spacing: 1rem;

  color: white;
  position: fixed;

  width: 100vw;
  height: auto;

  top: 0.5rem;
  left: 0;

  background-color: transparent;
  pointer-events: none;
  text-shadow: 0 0 9px rgb(255, 255, 255);
}

/* .hour,
.min,
.secs,
.dots {
  font-size: 14.5px;
} */

.clock-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.text-red {
  color: red;
}
</style>
