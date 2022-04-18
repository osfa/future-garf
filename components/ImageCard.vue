<template>
  <transition mode="out-in" :appear="animationOn" :name="getAnimation">
    <img
      v-show="!isLoading"
      class="page"
      :src="imgUrl"
      @load="hasLoaded"
      @error="hasLoaded"
    />
    <div
      v-if="!mainImageUrl"
      class="page solid"
      :style="{ backroundColor: mainColor }"
    ></div>
  </transition>
</template>

<script>
const randomAnimation = (array) => {
  return [
    // "bounce",
    // "bounceDown",
    // "bounceLeft",
    // "bounceRight",
    // "bounceUp",
    // 'fade',
    // 'fadeDown',
    // 'fadeLeft',
    // 'fadeRight',
    // 'fadeUp',
    // 'fadeUpBig',
    // 'fadeRightBig',
    // 'fadeLeftBig',
    // 'fadeDownBig',
    // "rotate",
    // "rotateDownLeft",
    // "rotateDownRight",
    // "rotateUpLeft",
    // "rotateUpRight",
    'slideDown',
    'slideUp',
    'slideLeft',
    'slideRight',
    // "zoom",
    // "zoomDown",
    // "zoomUp",
    // "zoomLeft",
    // "zoomRight",
  ].sample()
}
export default {
  name: 'ImageCard',
  props: {
    mainImageUrl: { type: String, default: '' },
    mainColor: { type: String, default: '#fea71a' },
    currentWidth: { type: Number, required: true },
    currentHeight: { type: Number, required: true },
    setAnimation: { type: String, default: '' },
    animationOn: { type: Boolean, default: true },
    // animationDuration: { type: Object, required: true, default: () => return {} },
  },
  data() {
    return {
      isLoading: true,
      imagesToPreload: [
        !this.isHorisontal()
          ? this.mainImageUrl.replace('.png', '-v.png')
          : this.mainImageUrl,
      ],
    }
  },
  computed: {
    imgUrl() {
      let imgUrl = this.mainImageUrl
      if (process.client) {
        if (!this.isHorisontal()) {
          imgUrl = imgUrl.replace('.png', '-v.png')
        }
      }
      return imgUrl
    },
    backgroundStyles() {
      return {
        backgroundImage: `url('${this.imgUrl()}')`,
      }
    },
    getAnimation() {
      if (this.setAnimation !== '') {
        return this.setAnimation
      }
      const a = randomAnimation()
      return a
    },
  },
  created() {
    // const images = this.imagesToPreload.map((imageSrc) => {
    //   return new Promise((resolve, reject) => {
    //     const img = new Image()
    //     img.src = imageSrc
    //     img.onload = resolve
    //     img.onerror = reject
    //   })
    // })
    // Promise.all(images).then(() => {
    //   this.isLoading = false
    // })
    // .catch((error) => {
    //   console.error(error.message)
    // })
  },
  methods: {
    hasLoaded() {
      this.isLoading = false
      this.$emit('loaded')
    },
    isHorisontal() {
      return true
      // return this.currentWidth / this.currentHeight > 1
    },
  },
}
</script>
<style scoped>
.page.solid {
  background-color: black;
  width: 100vw;
  height: 100vh;
  border: 1rem solid white;
  /* background-size: 98%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover; */
}
.page {
  /* transition: transform 300ms linear; */
  /* will-change: transform; */
  object-fit: cover;
  animation-duration: 250ms !important;
  /* animation-delay: 1000ms; */
}
</style>
