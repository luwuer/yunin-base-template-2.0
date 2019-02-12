<template>
  <div id="navBoard">
    <i class="move-left"
       :title="showMove ? '左移' : ''"
       @click="moveLeft">
      <svg class="icon"
           v-show="showMove"
           aria-hidden="true">
        <use xlink:href="#icon-xiangzuo"></use>
      </svg>
    </i>
    <div class="tab-container"
         ref="tabContainer">
      <ul class="tab-con-inner"
          ref="tabConInner"
          :style="{left: `-${moveLeftLen}px`}">
        <li v-for="(item, index) in tabs"
            :key="index"
            class="tab-item"
            :title="item.des"
            @click="showTab(index)"
            @contextmenu="newContextMenu(index, $event)"
            :class="Number(currentTab) === index ? 'current' : ''">
          <router-link class="title"
                       :to="item.routePath">{{item.des}}</router-link>
          <i class="close-tab"
             v-if="index"
             @click.stop="closeTab(index)">
            <svg class="icon"
                 aria-hidden="true">
              <use xlink:href="#icon-guanbi-"></use>
            </svg>
          </i>
        </li>
      </ul>
    </div>
    <i class="move-right"
       :title="showMove ? '右移' : ''"
       @click="moveRight">
      <svg class="icon"
           v-show="showMove"
           aria-hidden="true">
        <use xlink:href="#icon-xiangyou"></use>
      </svg>
    </i>
  </div>
</template>

<script>
import contextMenu from './nav-board-expand/s-context-menu/index.js'
import { mapGetters } from 'vuex'

const MOVELENSINGLE = 180
export default {
  name: 'navBoard',
  data() {
    return {
      showMove: false,
      navWidth: 0, // 容器宽度
      innerWidth: 0, // 内容宽度
      moveLeftLen: 0 // 左移长度，大于等于0
    }
  },
  computed: {
    ...mapGetters(['tabs', 'currentTab']),
    overlenght() {
      // 超长长度，大于等于0
      let temp = this.innerWidth - this.navWidth
      return temp > 0 ? temp : 0
    }
  },
  methods: {
    showTab(index) {
      var oldMenu = document.querySelector(
        '.menu-container .h-menu-item-active'
      )
      if (oldMenu) {
        oldMenu.classList.remove('h-menu-item-active', 'h-menu-item-selected')
      }
      this.$store.commit('setCurrentTab', index)
    },
    closeTab(index) {
      this.$store.commit(
        'addClosedTab',
        this.tabs[index].routePath.replace(/\?.*$/, '')
      )
      if (this.currentTab === index) {
        if (this.currentTab === this.tabs.length - 1) {
          this.$store.commit('setCurrentTab', index - 1)
          this.$router.replace(this.tabs[this.currentTab].routePath)
        } else {
          // removeTab还未执行
          this.$router.replace(this.tabs[this.currentTab + 1].routePath)
        }
      } else if (this.currentTab > index) {
        this.$store.commit('setCurrentTab', this.currentTab - 1)
      }
      this.$store.commit('removeTab', index)
    },
    newContextMenu(index, e) {
      e.preventDefault()

      let winWidth = window.screen.availWidth
      let maxLeft = winWidth - 120
      contextMenu.init({
        tabIndex: index,
        left: e.clientX > maxLeft ? maxLeft : e.clientX,
        top: e.clientY,
        closeCurrent: this.closeCurrent,
        closeOthers: this.closeOthers,
        closeRight: this.closeRight,
        closeLeft: this.closeLeft,
        closeAll: this.closeAll
      })
    },
    moveRight() {
      if (this.overlenght - this.moveLeftLen > MOVELENSINGLE) {
        this.moveLeftLen += MOVELENSINGLE
      } else {
        this.moveLeftLen = this.overlenght
      }
    },
    moveLeft() {
      if (this.moveLeftLen > MOVELENSINGLE) {
        this.moveLeftLen -= MOVELENSINGLE
      } else {
        this.moveLeftLen = 0
      }
    },
    /**
     * @description 如果tab被挡住，移动它
     */
    autoMove() {
      let $cur = document.querySelector('.current')
      let curWidth = $cur.offsetWidth
      let oLeft = $cur.offsetLeft

      if (!this.navWidth) {
        this.navWidth = this.$refs.tabContainer.offsetWidth
      }

      if (this.navWidth - curWidth + this.moveLeftLen < oLeft) {
        this.moveLeftLen = oLeft - (this.navWidth - curWidth)
      }

      if (this.overlenght < this.moveLeftLen) {
        this.moveLeftLen = this.overlenght
      }
    },
    /**
     * @description 关闭当前
     */
    closeCurrent(index) {
      this.closeTab(index)
    },
    /**
     * @description 关闭其他
     */

    closeOthers(index) {
      let tabsNum = this.tabs.length
      for (let i = tabsNum - 1; i > 0; i--) {
        if (i !== index) {
          this.closeTab(i)
        }
      }
    },
    /**
     * @description 关闭右侧
     */

    closeRight(index) {
      let tabsNum = this.tabs.length
      for (let i = tabsNum - 1; i > index; i--) {
        this.closeTab(i)
      }
    },
    /**
     * @description 关闭左侧
     */

    closeLeft(index) {
      for (let i = index - 1; i > 0; i--) {
        this.closeTab(i)
      }
    },
    /**
     * @description 关闭所有
     */

    closeAll() {
      let tabsNum = this.tabs.length
      for (let i = tabsNum - 1; i > 0; i--) {
        this.closeTab(i)
      }
    }
  },
  watch: {
    tabs: {
      immediate: true,
      handler: function() {
        this.$nextTick(() => {
          this.navWidth = this.$refs.tabContainer.offsetWidth
          this.innerWidth = this.$refs.tabConInner.offsetWidth
          if (this.overlenght > 0) {
            this.showMove = true
            this.autoMove()
          } else {
            this.showMove = false
          }
        })
      }
    },
    currentTab: {
      immediate: true,
      handler: function() {
        this.$nextTick(() => {
          this.autoMove()
        })
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.tabContainer.oncontextmenu = e => {
        e.preventDefault()
      }
    })

    window.addEventListener('resize', () => {
      this.navWidth = this.$refs.tabContainer.offsetWidth
      this.overlenght > 0 ? this.showMove = true : this.showMove = false
      this.autoMove()
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~@css/variable.styl'

#navBoard {
  display flex
  line-height 35px

  .move-left, .move-right {
    flex 0 0 16px
    font-size 12px
    text-align center
    cursor pointer
    color $nav-font
    background-color $tab-bg
    &:hover {
      color $menu-font-hover
    }
  }

  .tab-container {
    flex 1 1 auto
    display flex
    overflow hidden
    font-size 12px
    height 35px
    line-height 35px
    background $tab-bg

    .tab-con-inner {
      position relative
      left 0
      display flex
      transition left 0.5s

      .tab-item {
        display flex
        // max-width 120px
        position relative

        a {
          display inline-block
          padding 0 16px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          color $nav-font
        }

        .close-tab {
          display none
          font-size 16px
          color $cm-font-color-tint
          position absolute
          right -2px
        }

        &:hover .close-tab {
          display inline-block
          flex 0 0 10px
          font-size 14px
          cursor pointer
          color $nav-font
        }
      }
    }

    .current {
      border-bottom 2px solid $nav-pick-bg

      .close-tab {
        font-size 16px
        color $nav-font-checked
        display inline-block
      }
    }
  }
}
</style>
