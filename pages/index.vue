<template>
    <div class="overflow-hidden">
        <transition mode="out-in" :name="currentAnimation">
          <ImageCard v-show='firstCardActive' :style="animationDuration" :main-image-url='mainImageUrl' :current-width='currentWidth' @click.native="toggle()"/>
        </transition>
        <transition mode="out-in" appear :name="currentAnimation">
          <ImageCard  v-show='secondCardActive' :style="animationDuration" :main-image-url='backImageUrl' :current-width='currentWidth' @click.native="toggle()"/>
        </transition>
    </div>
</template>

<!-- have some sort of list that u pop? -->
<!-- always want one in back that it slides OVER -->

<!-- better to pop in more and prune? -->
<script>
import ImageCard from '../components/ImageCard'
/* eslint-disable */
 Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};
/* eslint-disable */

const randomAnimation = (array) => {
  return [
    "bounce",
    "bounceDown",
    "bounceLeft",
    "bounceRight",
    "bounceUp",
    "fade",
    "fadeDown",
    "fadeDownBig",
    "fadeLeft",
    "fadeLeftBig",
    "fadeRight",
    "fadeRightBig",
    "fadeUp",
    "fadeUpBig",
    "rotate",
    "rotateDownLeft",
    "rotateDownRight",
    "rotateUpLeft",
    "rotateUpRight",
    "slideDown",
    "slideUp",
    "slideLeft",
    "slideRight",
    // "zoom",
    // "zoomDown",
    // "zoomUp",
    // "zoomLeft",
    // "zoomRight",
  ].sample();
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
      currentAnimation: randomAnimation(),
      animationTime: 10000
    };
  },
  beforeMount() {
    this.currentWidth = window.innerWidth
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {
    animationDuration(){
      return { animationDuration: (this.animationTime/1000).toString() + 's' }
    }
  },
  methods: {
    newAnim(){
      this.currentAnimation = randomAnimation()
    },
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
      this.isAnimating = true
      if(this.firstCardActive){
        setTimeout(() => { 
          this.mainImageUrl = this.randomBackgroundUrl()
          this.isAnimating = false
        }, this.animationTime);
      }
      else {
        setTimeout(() => { 
          this.backImageUrl = this.randomBackgroundUrl()
          this.isAnimating = false
        }, this.animationTime);
      }
      this.firstCardActive = !this.firstCardActive
      this.secondCardActive = !this.secondCardActive
      this.newAnim()
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