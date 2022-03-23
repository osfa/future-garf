<template>
    <div>
        <transition name="fade">
          <ImageCard v-show='firstCardActive' :main-image-url='mainImageUrl' :current-width='currentWidth' @click.native="toggle()"/>
        </transition>
        <transition name="fade">
          <ImageCard v-show='secondCardActive' :main-image-url='backImageUrl' :current-width='currentWidth' @click.native="toggle()"/>
        </transition>
    </div>
</template>


<!-- have some sort of list that u pop? -->
<script>
import ImageCard from '../components/ImageCard'
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
// import bkgImg from '/imgs/1987-12-11-0-10e-1646988554-1024x2048-10e-1646990976-splinter-0-gigapixel-lines-scale-2_00x.png';
export default {
  name: 'IndexPage',
  components: { ImageCard },
  data() {
    return {
      imgs: allImgs,
      mainImageUrl: allImgs[0],
      backImageUrl: allImgs[1],
      currentWidth: 1280,
      firstCardActive: true,
      secondCardActive: false,
      isAnimating: false,
    };
  },
  beforeMount() {
    this.currentWidth = window.innerWidth
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    randomBackgroundUrl() {
      return this.imgs[Math.floor(Math.random()*this.imgs.length)]
    },
    newRandomBackground() {
      const oldUrl = this.mainImageUrl
      while(oldUrl === this.mainImageUrl){
        this.mainImageUrl = this.randomBackgroundUrl()
      }
    },
    toggle(e) {
      if(this.isAnimating) return

      if(this.firstCardActive){
        setTimeout(() => { this.mainImageUrl = this.randomBackgroundUrl() }, 5000);
      }
      else {
        setTimeout(() => { this.backImageUrl = this.randomBackgroundUrl() }, 5000);
      }
      this.firstCardActive = !this.firstCardActive
      this.secondCardActive = !this.secondCardActive
    },
    handleResize(e) {
      this.currentWidth = window.innerWidth
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
  background-color: #fff;
  width: 100vw;
  height: 100vh;
  background-size: 98%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 5s;
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
  transform: translateX(20px);
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