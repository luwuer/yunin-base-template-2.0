<template>
  <div id="container">
    <div id="topContainer">
      <top-bar></top-bar>
    </div>
    <div id="mainContainer">
      <div id="menuContainer"
           ref="menuContainer">
        <main-menu type="context"
                   @shrink="changeMenuStyle"></main-menu>
      </div>
      <div id="mainBoard">
        <div id="navContainer">
          <nav-board ref="navBoard"></nav-board>
        </div>
        <div id="pageContainer"
             ref="pageContainer">
          <transition name="fade"
                      mode="out-in">
            <keep-alive :exclude="keepAliveExclude">
              <router-view v-if="$route.meta.keepAlive" />
            </keep-alive>
          </transition>
          <transition name="fade"
                      mode="out-in">
            <router-view v-if="!$route.meta.keepAlive" />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topBar from '@main/components/TopBar'
import mainMenu from '@main/components/MainMenu'
import navBoard from '@main/components/NavBoard'
import { windowResize } from '@/assets/js/common'

export default {
  name: 'container',
  components: {
    topBar,
    mainMenu,
    navBoard
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      keepAliveExclude: [
        'appraiseEventDetail',
        'appraiseRequestDetail',
        'appraiseCustomerDetail'
      ]
    }
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      let timer = null
      window.addEventListener('resize', () => {
        if (timer) {
          return
        }
        timer = setTimeout(() => {
          timer = null
          this.calcTableHeight()
        }, 50)
      })
      this.calcTableHeight()
    })
  },
  methods: {
    changeMenuStyle(flag) {
      console.log('changeMenuStyle...')
      if (flag) {
        // 严格模式下ie不允许对style直接修改，比如 dom.style = xxx，其认为style是只读属性
        this.$refs.menuContainer.setAttribute('style', 'flex: 0 0 40px;')
        // 菜单宽度改变后触发window resize, 动画时间200ms
        setTimeout(() => {
          windowResize()
        }, 211)
      } else {
        this.$refs.menuContainer.setAttribute('style', 'flex: 0 0 160px;')
        // 菜单宽度改变后触发window resize, 兼容菜单出现滚动条的时间（未统计），暂定300ms
        setTimeout(() => {
          windowResize()
        }, 300)
      }
    },
    /**
     * @description 获取pageContainer的高度以便之后页面获取实时变动元素高度
     */
    calcTableHeight() {
      if (this.$refs.pageContainer) {
        let pageCH = this.$refs.pageContainer.offsetHeight
        let pageCW = this.$refs.pageContainer.offsetWidth
        this.$store.commit('setCssDatas', {
          target: 'pageContainerHeight',
          val: pageCH
        })
        this.$store.commit('setCssDatas', {
          target: 'pageContainerWidth',
          val: pageCW
        })
      }
    },
    reload() {
      this.$route.meta.keepAlive = true
      this.$nextTick(() => (this.$route.meta.keepAlive = false))
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@css/variable.styl'

#container {
  display flex
  flex-direction column
  height 100%

  #topContainer {
    flex 0 0 50px
    height 50px
  }

  #mainContainer {
    flex 1 1 auto
    display flex
    overflow hidden

    #menuContainer {
      flex 0 0 160px
      overflow visible
      background $menu-bg
      transition all 0.2s
    }

    #mainBoard {
      flex 1 1 auto
      display flex
      flex-direction column
      background $container-bg
      overflow auto // 可以使mainBoard在浏览器缩放时保持和父flex容器一致宽度，不设置overflow就不行

      #navContainer {
        flex 0 0 35px
      }

      #pageContainer {
        flex 1 1 auto
        display flex
        flex-direction column
        position relative
        height 100%
        padding 12px 16px
        overflow-x hidden
        overflow-y auto

        .fade-enter-active {
          transition opacity 0.3s
        }

        .fade-enter {
          opacity 0
        }
      }
    }
  }
}
</style>
