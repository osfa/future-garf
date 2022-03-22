<template>
  <!-- <div :style="{ backgroundImage: `url(${image})`}"> -->
    <div>
      <nuxt-img
        id="vert"
        class="lg:hidden h-screen w-screen"
        src="/imgs/cmyk-false-floyd-test-v.png"
        alt="vert"
        fit="contain"
        sizes="xl:100vw lg:100vw md:100vw sm:100vw xs:100vw"
      />
      <nuxt-img
        id="hori"
        fit="contain"
        class="hidden lg:block h-screen"
        src="/imgs/cmyk-false-floyd-test.png"
        alt="hori"
        sizes="xl:100vw lg:100vw md:100vw sm:100vw xs:100vw"
      />
    </div>

</template>

<script>
// import bkgImg from "/imgs/1987-12-11-0-10e-1646988554-1024x2048-10e-1646990976-splinter-0-gigapixel-lines-scale-2_00x.png";
export default {
  name: 'IndexPage',
  data() {
    return {
      image: `url(${require('@/static/imgs/cmyk-false-floyd-test.png')})`,    
    };
  }
}
</script>
