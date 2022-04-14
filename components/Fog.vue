<template>
  <transition mode="out-in" appear name="fade">
    <div class="fog-wrapper">
      <div id="fog1" class="fog"></div>
      <div id="fog2" class="fog"></div>
      <!-- <div id="fog3" class="fog">
      </div> -->
    </div>
  </transition>
</template>

<script>
export default {
  name: 'FogLayer',
  props: {
    mainImageUrl: { type: String, default: undefined },
  },
  data() {
    return {
      isLoading: true,
    }
  },
  computed: {
    backgroundStyles() {
      return {
        backgroundImage: `url('${this.imgUrl()}')`,
      }
    },
  },
  created() {},
  methods: {
    hasLoaded() {
      this.isLoading = false
      this.$emit('loaded')
    },
  },
}
</script>
<style scoped>
.fog-wrapper {
  height: 100%;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 100;
  opacity: 0.8;
  pointer-events: none;
  overflow: hidden;
}
.fog {
  height: 100%;
  position: absolute;
  width: 200%;
}
#fog1 {
  animation: foglayer_01_opacity 10s linear infinite,
    foglayer_moveme 90s linear infinite;
}
#fog2 {
  animation: foglayer_02_opacity 21s linear infinite,
    foglayer_moveme 92s linear infinite;
}
#fog3 {
  animation: foglayer_02_opacity 21s linear infinite,
    foglayer_moveme 94s linear infinite;
}

#fog1 {
  background: url('/imgs/fog1.png') center center/cover no-repeat transparent;
}
#fog2,
#fog3 {
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
