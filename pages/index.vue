<template>
    <!-- <div class='page' :style='{ backgroundImage: `url(${image})`}'> -->
    <div class='page' :style='randomBackgroundStyles' @click="newRandomBackground()">
    <!-- <nuxt-img
      id='vert'
      class='lg:hidden w-full h-full'
      src='/imgs/cmyk-false-floyd-test-v.png'
      alt='vert'
      fit='contain'
      sizes='xl:100vw lg:100vw md:100vw sm:100vw xs:100vw'
    />
    <nuxt-img
      id='hori'
      fit='contain'
      class='hidden lg:block w-full h-full'
      src='/imgs/cmyk-false-floyd-test.png'
      alt='hori'
      sizes='xl:100vw lg:100vw md:100vw sm:100vw xs:100vw'
    /> -->
    </div>
</template>

<script>
// import bkgImg from '/imgs/1987-12-11-0-10e-1646988554-1024x2048-10e-1646990976-splinter-0-gigapixel-lines-scale-2_00x.png';
export default {
  name: 'IndexPage',
  // props: {
  //   containerWidth: { type: Number, required: true }
  // },
  data() {
    return {
      imgs: [
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
      ],
      mainImageUrl: '/imgs/dithered-8bit/1992-09-22-2-10e.png',
      currentWidth: '',
      // image: `${require('@/static/imgs/dithered-8bit/1992-10-10-0-60e.png?w=1280&nf_resize=fit')}`,    
    };
  },
  computed: {
    randomBackgroundStyles() {
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
    backgroundStyles() {
      console.log('backgroundStyles?')
      const baseUrl = this.mainImageUrl
      let imgUrl = this.$img(baseUrl, { width: 960 })
      if (process.client) {
        if (this.currentWidth > 2000){
          imgUrl = this.$img(baseUrl, { width: 2600 })
        }
        else if (this.currentWidth > 1534){
          imgUrl = this.$img(baseUrl, { width: 1920 })
        }
        else if(this.currentWidth > 1280){
          imgUrl = this.$img(baseUrl, { width: 1534 })
        }
        else if(this.currentWidth > 1024){
          imgUrl = this.$img(baseUrl, { width: 1280 })
        }
        // else {
        //   // baseUrl = '/imgs/1992-10-01-2-60e-1647998796-1024x2048-60e-1648001223-splinter-0-512-perc-32.png'
        //   // baseUrl = '/imgs/1992-10-01-2-60e-1647998796-1024x2048-60e-1648001223-splinter-0-16-perc.png'
        //   // baseUrl = '/imgs/1992-10-01-2-60e-1647998796-1024x2048-60e-1648001223-splinter-0-percp8.png'
        //   imgUrl = this.$img(this.randomItem(), { width: 1280 })
        // }
      }
      return {
        backgroundImage: `url('${imgUrl}')`
      }
    }
  },
  beforeMount() {
    this.currentWidth = window.innerWidth
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    newRandomBackground() {
      const oldUrl = this.mainImageUrl
      while(oldUrl === this.mainImageUrl){
        this.mainImageUrl = this.imgs[Math.floor(Math.random()*this.imgs.length)]
      }
      // return this.imgs[Math.floor(Math.random()*this.imgs.length)]
    },
    handleResize(e) {
      // console.log('resize and force update?')
      // console.log('should mutate a prop here? its coming back to me..')
      this.currentWidth = window.innerWidth
      // this.newRandomBackground()
      // this.$forceUpdate();
    }
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
  background-position: top;
  background-size: cover;
  /*background-size: clamp(1000px, 80%, 1500px) auto;*/
/*  max-width: 2048px;
  background-position: center;*/
/*  width: 96vw;
  height: 96vh;
  margin-top: 2vh;
  margin-bottom: 2vh;
  margin-left:  2vw;
  margin-right: 2vw;*/
}
</style>