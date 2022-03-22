<template>
  <!-- <div :style="{ backgroundImage: `url(${image})`}"> -->
    <div>
            <Tutorial />

  <nuxt-img
    src="/imgs/1987-12-11-0-10e-1646988554-1024x2048-10e-1646990976-splinter-0-gigapixel-lines-scale-2_00x.png"
    alt="Space by Jeremy Thomas on Unsplash"
    sizes="xl:50vw lg:50vw md:50vw sm:100vw xs:100vw"
    />
  </div>

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
