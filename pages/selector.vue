<template>
  <div>
    <div class="toolbar flex flex-col fixed right p-10">
      <a @click="isViewing = !isViewing">Toggle View</a>
      <a @click="saveComp">Save</a>
      <a @click="clearComp">Clear</a>
      <a @click="dumpComps">Dump</a>
    </div>
    <div
      :class="{ isViewing: isViewing, 'gap-5': isViewing }"
      class="block grid grid-cols-10"
    >
      <div
        v-for="(panel, idx) in activeComp"
        :key="panel"
        :class="{ isActive: idx === swap }"
        class="display-panel"
      >
        <span class="tooltip">{{
          panel.replace('/imgs/raw/5/', '').substring(0, 16)
        }}</span>
        <img
          :src="panel"
          class="disp-panel-img"
          @click="setSwap(idx)"
          @contextmenu="remove($event, idx)"
        />
      </div>
    </div>
    <div class="grid grid-cols-8 gap-4">
      <div v-for="(col, idx) in cols" :key="idx">
        <div v-for="row in col" :key="row" class="py-2 display-panel">
          <span class="tooltip">{{
            row.replace('/imgs/raw/5/', '').substring(0, 16)
          }}</span>
          <img
            :class="{ invisible: activeComp.includes(row) }"
            :src="row"
            @click="addPath(row)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageCard from '../components/ImageCard'
import { tsneMap15groups } from './data/tsne.js'

/* eslint-disable */
Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)]
}
/* eslint-disable */
const init1 = [
  '/imgs/raw/5/1978-07-07-1-25e-1645949643-1024x2048-25e-1645951757-splinter-0.png',
  '/imgs/raw/5/1978-07-08-2-25e-1646048151-1024x2048-25e-1646050268-splinter-0.png',
  '/imgs/raw/5/1978-07-10-2-50e-1646076126-1024x2048-50e-1646078245-splinter-0.png',
  '/imgs/raw/5/1978-06-20-2-25e-1645689499-1024x2048-25e-1645691614-splinter-0.png',
  '/imgs/raw/5/1987-10-23-2-50e-1646919941-1024x2048-50e-1646922358-splinter-0.png',
  '/imgs/raw/5/1992-09-22-2-25e-1647945452-1024x2048-25e-1647947871-splinter-0.png',
  '/imgs/raw/5/1978-07-08-0-25e-1646006150-1024x2048-25e-1646008263-splinter-0.png',
  '/imgs/raw/5/1978-07-07-1-10e-1645947500-1024x2048-10e-1645949613-splinter-0.png',
  '/imgs/raw/5/1978-09-11-0-25e-1646563180-1024x2048-25e-1646565596-splinter-0.png',
  '/imgs/raw/5/yeet.png-50e-1646461111-1024x2048-50e-1646463530-splinter-0.png',
]
const init2 = [
  '/imgs/raw/5/1987-10-23-2-50e-1646919941-1024x2048-50e-1646922358-splinter-0.png',
  '/imgs/raw/5/1978-07-08-0-25e-1646006150-1024x2048-25e-1646008263-splinter-0.png',
  '/imgs/raw/5/1978-06-20-2-25e-1645689499-1024x2048-25e-1645691614-splinter-0.png',
  '/imgs/raw/5/1978-09-11-0-25e-1646563180-1024x2048-25e-1646565596-splinter-0.png',
  '/imgs/raw/5/1978-07-10-2-50e-1646076126-1024x2048-50e-1646078245-splinter-0.png',
  '/imgs/raw/5/1978-07-08-2-25e-1646048151-1024x2048-25e-1646050268-splinter-0.png',
  '/imgs/raw/5/1978-07-07-1-25e-1645949643-1024x2048-25e-1645951757-splinter-0.png',
  '/imgs/raw/5/yeet.png-50e-1646461111-1024x2048-50e-1646463530-splinter-0.png',
  '/imgs/raw/5/1978-06-20-1-50e-1645685213-1024x2048-50e-1645687329-splinter-0.png',
  '/imgs/raw/5/1992-10-01-1-10e-1647974160-1024x2048-10e-1647976579-splinter-0.png',
]
const init3 = [
  '/imgs/raw/5/1978-06-20-0-50e-1645678773-1024x2048-50e-1645680888-splinter-0.png',
  '/imgs/raw/5/1978-07-08-2-25e-1646048151-1024x2048-25e-1646050268-splinter-0.png',
  '/imgs/raw/5/1978-07-10-2-50e-1646076126-1024x2048-50e-1646078245-splinter-0.png',
  '/imgs/raw/5/1978-06-20-2-25e-1645689499-1024x2048-25e-1645691614-splinter-0.png',
  '/imgs/raw/5/1987-10-23-2-50e-1646919941-1024x2048-50e-1646922358-splinter-0.png',
  '/imgs/raw/5/1978-07-08-0-25e-1646006150-1024x2048-25e-1646008263-splinter-0.png',
  '/imgs/raw/5/1992-09-22-2-25e-1647945452-1024x2048-25e-1647947871-splinter-0.png',
  '/imgs/raw/5/1978-09-11-0-25e-1646563180-1024x2048-25e-1646565596-splinter-0.png',
  '/imgs/raw/5/1978-07-07-1-10e-1645947500-1024x2048-10e-1645949613-splinter-0.png',
  '/imgs/raw/5/yeet.png-50e-1646461111-1024x2048-50e-1646463530-splinter-0.png',
]
export default {
  name: 'selector',
  components: { ImageCard },
  data() {
    return {
      cols: [],
      isViewing: false,
      activeMap: tsneMap15groups,
      activeComp: init1,
      savedComps: [],
      compLength: 10,
      swap: null,
    }
  },
  mounted() {},
  beforeMount() {
    this.cols = new Array(8)
    for (var i = 0; i < this.cols.length; i++) {
      this.cols[i] = new Array(16)
    }
    this.activeMap.forEach((data) => {
      const x = data['point'][0]
      const y = data['point'][1]
      const path = data['path'].replace(
        '/content/drive/MyDrive/ML/_ins/garf-elites/',
        '/imgs/raw/'
      )
      this.cols[x][y] = path
    })
    console.log(this.cols)
  },
  beforeDestroy() {},
  computed: {},
  methods: {
    addPath(path) {
      if (this.activeComp.includes(path)) {
        return
      }
      console.log(this.swap)
      if (this.activeComp[this.swap]) {
        this.activeComp.splice(this.swap, 1, path)
        this.swap = null
      } else {
        this.activeComp.push(path)
      }
    },
    setSwap(idx) {
      console.log('setSwap')
      if (this.swap == idx) {
        this.swap = null
        return
      }
      if (this.swap != null) {
        const currentSelect = this.activeComp[this.swap]
        const toSwap = this.activeComp[idx]
        this.activeComp.splice(this.swap, 1, toSwap)
        this.activeComp.splice(idx, 1, currentSelect)
        this.swap = null
      } else {
        this.swap = idx
      }
      console.log(this.swap)
    },
    handleResize(e) {
      this.currentWidth = window.innerWidth
    },
    remove(e, idx) {
      e.preventDefault()
      console.log('remove')
      this.activeComp.splice(idx, 1)
    },
    saveComp() {
      this.savedComps.push(this.activeComp)
      //this.activeComp = []
    },
    clearComp() {
      this.activeComp = []
    },
    dumpComps() {
      console.log(JSON.stringify(this.savedComps))
    },
  },
}
</script>
<style scoped>
.isViewing {
  width: 300vw;
  background: white;
  height: 100vh;
  align-items: center;
  padding: 0 50px;
  overflow-y: scroll;
  overflow-x: scroll;
}
.toolbar {
  background: white;
  padding: 5px;
  right: 5px;
  top: 5px;
  font-size: 8px;
  z-index: 1000;
}
.toolbar a {
  padding: 5px;
  cursor: pointer;
}
.toolbar a:hover {
  text-decoration: underline;
}
.isActive {
  border: 3px solid red;
}
.display-panel {
  position: relative;
  box-sizing: border-box;
}
.tooltip {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  font-size: 12px;
  padding: 5px;
  background: white;
}
.display-panel:hover .tooltip {
  display: block;
}
.disp-panel-img {
  max-height: 95vh;
}
</style>
