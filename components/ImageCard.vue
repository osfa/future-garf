<template>
    <div class='page' :style='backgroundStyles'>
    </div>
</template>

<script>
// import bkgImg from '/imgs/1987-12-11-0-10e-1646988554-1024x2048-10e-1646990976-splinter-0-gigapixel-lines-scale-2_00x.png';
export default {
  name: 'ImageCard',
  props: {
    mainImageUrl: { type: String, required: true },
    currentWidth: { type: Number, required: true }
  },
  // data() {
  //   return {
  //     currentWidth: '',
  //   }
  // },
  computed: {
    backgroundStyles() {
      let imgUrl = this.mainImageUrl
      if (process.client) {
        if (this.currentWidth < 1024){
          imgUrl = imgUrl.replace('.png', '-v.png')
        }
      }
      return {
        backgroundImage: `url('${imgUrl}')`
      }
    },
  },
  // beforeMount() {
  //   this.currentWidth = window.innerWidth
  //   window.addEventListener('resize', this.handleResize);
  // },
  // beforeDestroy() {
  //   window.removeEventListener('resize', this.handleResize);
  // },
  methods: {
    // handleResize(e) {
    //   this.currentWidth = window.innerWidth
    // },
    // clickHandler(e) {
    //   console.log('clickHandler')
    // }
  },
}
</script>
<style scoped>
.page {
  background-color: #fff;
  width:  100vw;
  height:  100vh;
  background-size: 98%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>