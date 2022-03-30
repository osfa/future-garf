<template>
  <transition mode="out-in" :appear="animationOn" :name="getAnimation">
    <img
      v-if="mainImageUrl"
      v-show="!isLoading"
      class="page"
      :src="imgUrl"
      @load="hasLoaded"
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
    'fade',
    'fadeDown',
    'fadeDownBig',
    'fadeLeft',
    'fadeLeftBig',
    'fadeRight',
    'fadeRightBig',
    'fadeUp',
    'fadeUpBig',
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
// import bkgImg from '/imgs/1987-12-11-0-10e-1646988554-1024x2048-10e-1646990976-splinter-0-gigapixel-lines-scale-2_00x.png';
export default {
  name: 'ImageCard',
  props: {
    mainImageUrl: { type: String, default: '' },
    mainColor: { type: String, default: '#fea71a' },
    currentWidth: { type: Number, required: true },
    setAnimation: { type: String, default: '' },
    animationOn: { type: Boolean, default: true },
    // animationDuration: { type: Object, required: true, default: () => return {} },
  },
  data() {
    return {
      isLoading: true,
      imagesToPreload: [
        this.currentWidth < 1024
          ? this.mainImageUrl.replace('.png', '-v.png')
          : this.mainImageUrl,
      ],
    }
  },
  computed: {
    imgUrl() {
      let imgUrl = this.mainImageUrl
      if (process.client) {
        if (this.currentWidth < 1024) {
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
  object-fit: cover;
}
</style>
