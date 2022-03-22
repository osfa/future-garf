<template>
  <!-- <div :style="{ backgroundImage: `url(${image})`}"> -->
  <nuxt-img
    src="/imgs/1987-12-11-0-10e-1646988554-1024x2048-10e-1646990976-splinter-0-gigapixel-lines-scale-2_00x.png"
    alt="Space by Jeremy Thomas on Unsplash"
    sizes="xl:100vw lg:100vw md:100vw sm:100vw xs:100vw"
    />
  <!-- </div> -->
 <!--  <Tutorial /> -->
</template>

<script>
// import bkgImg from "/imgs/1987-12-11-0-10e-1646988554-1024x2048-10e-1646990976-splinter-0-gigapixel-lines-scale-2_00x.png";
export default {
  name: 'IndexPage',
  data() {
    return {
      image: `url(${require('@/static/imgs/1987-12-11-0-10e-1646988554-1024x2048-10e-1646990976-splinter-0-gigapixel-lines-scale-2_00x.png')})`,    
    };
  }
}
</script>
