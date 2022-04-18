<template>
  <div>
    <div class="curated px-5 full-w bg-white flex flex-row">
      <div v-for="(savedComp, idx) in savedComps" :key="idx">
        <a class="text-xs pr-5" href="#" @click="setActiveComp(idx)"
          >Set {{ idx + 1 }}</a
        >
      </div>
    </div>
    <div class="toolbar flex flex-col fixed right p-10">
      <a @click="isViewing = !isViewing">Toggle View</a>
      <a @click="saveComp">Save</a>
      <a @click="clearComp">Clear</a>
      <a @click="dumpComps">Dump</a>
      <span>{{ activeComp.length }} selected</span>
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
          panel.replace(folderPath, '').substring(0, 16)
        }}</span>
        <img
          :src="
            panel
              .replace(folderPath, folderPath4k)
              .replace('.png.jpg', '-gigapixel-standard-scale-2_00x.png')
          "
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
            row.replace(folderPath, '').substring(0, 16)
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
import { tsne8x85 } from './data/tsne8x85.js'
import { sel4, thirdSel, genSel, sel110, sel94 } from './data/selected72.js'

/* eslint-disable */
Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)]
}
/* eslint-disable */
const activeComp = sel94

const grouped = []

export default {
  name: 'selector72',
  components: {},
  data() {
    return {
      folderPath: '/imgs/_all-prune-test-512-x1024/',
      // folderPath4k: '/imgs/_selected4k/',
      folderPath4k: '/imgs/_out/_out-681/4k/png8-64-noise-p/',
      cols: [],
      isViewing: false,
      activeMap: tsne8x85,
      activeComp: activeComp.sort(),
      savedComps: [sel4, thirdSel, genSel, sel110, sel94],
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
        '/content/drive/MyDrive/ML/_ins/_all-prune-test-512-x1024/',
        this.folderPath
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
    setActiveComp(idx) {
      this.activeComp = this.savedComps[idx]
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
      console.log(JSON.stringify(this.activeComp))
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
.toolbar a:hover,
.curated a:hover {
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
.curated {
  align-items: center;
}
</style>
