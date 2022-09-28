import Vue from 'vue'
import VueGtag from 'vue-gtag'

// https://matteo-gabriele.gitbook.io/vue-gtag/v/master/auto-tracking
// import VueRouter from 'vue-router'

// const router = new VueRouter({
//   routes: [
//     { name: 'Index', path: '/' },
//     { name: 'App', path: '/swiper-test' },
//   ],
// })

// Vue.use(VueGtag, {
//   config: {
//     id: 'G-HTJ35SW3G3',
//     // enable: process.env.NODE_ENV === 'production',
//   },
// })

export default ({ app }) => {
  Vue.use(
    VueGtag,
    {
      config: { id: 'G-HTJ35SW3G3' },
      appName: 'mondays.cloud',
      // enable: process.env.NODE_ENV === 'production',
    },
    app.router
  )
}
