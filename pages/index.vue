<template>
    <!-- <div class="page" :style="{ backgroundImage: `url(${image})`}"> -->
      <div class="page" :style="backgroundStyles">
<!-- <nuxt-img
        id="vert"
        class="lg:hidden w-full h-full"
        src="/imgs/cmyk-false-floyd-test-v.png"
        alt="vert"
        fit="contain"
        sizes="xl:100vw lg:100vw md:100vw sm:100vw xs:100vw"
      />
      <nuxt-img
        id="hori"
        fit="contain"
        class="hidden lg:block w-full h-full"
        src="/imgs/cmyk-false-floyd-test.png"
        alt="hori"
        sizes="xl:100vw lg:100vw md:100vw sm:100vw xs:100vw"
      /> -->
    </div>
</template>

<script>
// import bkgImg from "/imgs/1987-12-11-0-10e-1646988554-1024x2048-10e-1646990976-splinter-0-gigapixel-lines-scale-2_00x.png";
export default {
  name: 'IndexPage',
  // props: {
  //   containerWidth: { type: Number, required: true }
  // },
  data() {
    return {
      mainImageUrl: '/imgs/2048-false-floyd.png',
      requestUrl: '',
      image: `${require('@/static/imgs/cmyk-false-floyd-test.png?w=1280&nf_resize=fit')}`,    
    };
  },
  computed: {
    backgroundStyles() {
      let baseUrl = '/imgs/cmyk-false-floyd.png'
      baseUrl = this.mainImageUrl
      let imgUrl = this.$img(baseUrl, { width: 960 })
      if (process.client) {
        const width = window.innerWidth;
        console.log(width)
        if (width > 2000){
          imgUrl = this.$img(baseUrl, { width: 2600 })
        }
        else if (width > 1534){
          imgUrl = this.$img(baseUrl, { width: 1920 })
        }
        else if(width > 1280){
          imgUrl = this.$img(baseUrl, { width: 1534 })
        }
        else if(width > 1024){
          imgUrl = this.$img(baseUrl, { width: 1280 })
        }
        else {
          imgUrl = this.$img(baseUrl, { width: 1280 })
        }
      }
      return {
        backgroundImage: `url('${imgUrl}')`
      }
    }
  },
  beforeMount() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize(e) {
      console.log('resize and force update?')
      this.$forceUpdate();
      // const baseUrl = '/imgs/2048-false-floyd.png'
      // let imgUrl = this.$img(baseUrl, { width: 960 })
      // this.containerWidth = window.innerWidth
    }
  },
}
</script>
<style scoped>
.page {
  width:  100vw;
  height:  100vh;
  background-size: cover;
  /*width: 98vw;
  height: 98vh;
  padding-top: 1vh;
  padding-bottom: 1vh;
  padding-left:  1vw;
  padding-right: 1vw;*/
}
</style>