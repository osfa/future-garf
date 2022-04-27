<template>
  <div class="clock-container text-sm md:text-lg font-weight-light">
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

<style scoped>
.clock-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  flex-direction: column;
  font-family: 'Roboto';
  /* pointer-events: none; */

  /* font-size: 1rem; */
  letter-spacing: 0.4rem;

  color: white;
  position: fixed;

  width: 100vw;
  height: auto;
  z-index: 10000;

  top: 1rem;
  left: 0;

  background-color: transparent;
  /* kiosk */
  text-shadow: 0 0 9px rgb(255, 255, 255);

  /* non-kiosk */
  text-shadow: 0 0 5px rgb(255, 255, 255);
}

@media (orientation: landscape) {
  .clock-container {
    letter-spacing: 1rem;
  }
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
