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
  data() {
    return {
      image: `${require('@/static/imgs/cmyk-false-floyd-test.png?w=1280&nf_resize=fit')}`,    
    };
  },
  computed: {
    backgroundStyles() {
      let imgUrl = this.$img('/imgs/cmyk-false-floyd-test.png', { width: 960 })
      if (process.client) {
        const width = window.innerWidth;
        console.log(width)
        if (width > 2000){
          imgUrl = this.$img('/imgs/cmyk-false-floyd-test.png', { width: 2600 })
        }
        else if (width > 1534){
          imgUrl = this.$img('/imgs/cmyk-false-floyd-test.png', { width: 1920 })
        }
        else if(width > 1280){
          imgUrl = this.$img('/imgs/cmyk-false-floyd-test.png', { width: 1534 })
        }
        else if(width > 1024){
          imgUrl = this.$img('/imgs/cmyk-false-floyd-test-v.png', { width: 1280 })
        }
        else {
          imgUrl = this.$img('/imgs/cmyk-false-floyd-test-v.png', { width: 1280 })
        }
      }
      return {
        backgroundImage: `url('${imgUrl}')`
      }
    }
  }
}
</script>
<!-- computed: {
    css () {
      if (process.client) {
        let width = window.innerWidth

        // ... mobile { ... styles }
        // ... desktop { ... styles }

        // ... if width is less than 700, return mobile
        // ... if width greater than 700, return desktop
      } else {
        return { /*empty style object*/ }
      }
    }
  } -->
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