<template>
    <!-- <div class="page" :style="{ backgroundImage: `url(${image})`}"> -->
      <div class="page" :style="{ backgroundImage: `url(${image})`}">
<!--       <nuxt-img
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
      const imgUrl = this.$img('/imgs/cmyk-false-floyd-test-v.png', { width: 960 })
      return imgUrl
      // return {
      //   backgroundImage: `url('${imgUrl}')`
      // }
    }
  }
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