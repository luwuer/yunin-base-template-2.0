<template>
  <transition name="msgbox-fade">
    <div id="sContextMenu"
         v-show="visible"
         :style="{left: `${left}px`, top: `${top}px`}">
      <ul class="menu-wrapper">
        <li v-for="(value, key) in cmMap"
            :key="key"
            class="menu-item"
            @click="choose(key)">
          {{value}}
          <span class="shortcut">{{shortcut[key]}}</span>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
const CONTEXTMENUMAP = {
  current: '关闭当前标签页',
  others: '关闭其他标签页',
  right: '关闭右侧标签页',
  left: '关闭左侧标签页',
  all: '关闭所有标签页'
}

const SHORCUTMAP = {
  current: 'Q',
  others: 'W',
  right: 'E',
  left: 'A',
  all: 'S'
}

export default {
  data() {
    return {
      visible: false,
      cmMap: CONTEXTMENUMAP,
      shortcut: SHORCUTMAP,
      tabIndex: 0,
      top: 0,
      left: 0,
      closeCurrent: null,
      closeOthers: null,
      closeRight: null,
      closeLeft: null,
      closeAll: null
    }
  },
  methods: {
    choose(key) {
      switch (key) {
        case 'current':
          this.closeCurrent(this.tabIndex)
          break
        case 'others':
          this.closeOthers(this.tabIndex)
          break
        case 'right':
          this.closeRight(this.tabIndex)
          break
        case 'left':
          this.closeLeft(this.tabIndex)
          break
        default:
          this.closeAll()
      }
      this.dom.remove()
    },
    mouseupListener(e) {
      // 左键 + 点击对象为菜单时不移除
      if (e.target.className !== 'menu-item' || e.button !== 0) {
        this.dom.remove()
      }
      window.removeEventListener('mouseup', this.mouseupListener)
      window.removeEventListener('keyup', this.keyupListener)
    },
    keyupListener(e) {
      switch (e.key) {
        case 'q':
          this.choose('current')
          break
        case 'w':
          this.choose('others')
          break
        case 'e':
          this.choose('right')
          break
        case 'a':
          this.choose('left')
          break
        default:
          this.choose('all')
      }

      window.removeEventListener('mouseup', this.mouseupListener)
      window.removeEventListener('keyup', this.keyupListener)
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('mouseup', this.mouseupListener, {capture: false})
      window.addEventListener('keyup', this.keyupListener)
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~@css/variable.styl'

.msgbox-fade-enter-active {
  // animation msgbox-fade-in 0.3s
}

.msgbox-fade-leave-active {
  // animation msgbox-fade-out 0.3s
}

@keyframes msgbox-fade-in {
  0% {
    opacity 0.5
  }

  100% {
    opacity 1
  }
}

@keyframes msgbox-fade-out {
  0% {
    opacity 1
  }

  100% {
    opacity 0
  }
}

#sContextMenu {
  position fixed

  .menu-wrapper {
    width 160px
    padding-top 1px
    font-size 12px
    color #333
    line-height 20px
    text-align left
    background $main-bg
    // box-shadow 2px 3px 3px rgba(0, 0, 0, 0.3)
    // border 1px solid #ccc
    box-shadow 1px 2px 6px rgba(0, 0, 0, 0.3)
    border-radius 4px

    .menu-item {
      height 24px
      padding 2px 10px
      cursor pointer

      &:hover {
        background $menu-font-hover
        color $tab-bg

        .shortcut {
          color #fff
        }
      }

      .shortcut {
        float right
        color $cm-font-color-tint
      }
    }
  }
}
</style>
