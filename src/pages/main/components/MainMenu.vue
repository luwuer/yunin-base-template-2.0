<template>
  <div id="mainMenu">
    <div class="search-container"
         :style="{paddingLeft: shrink ? '5px' : '10px'}">
      <div class="input-container"
           v-show="!shrink">
        <h-input v-model="searchValue"
                 placeholder="输入关键词"
                 icon="search"></h-input>
      </div>
      <div class="shrink-container"
           @click="menuShrink"
           title="伸缩菜单">
        <svg class="icon"
             aria-hidden="true">
          <use xlink:href="#icon-menu"></use>
        </svg>
      </div>
    </div>
    <div class="menu-container"
         :class="{'shrink': shrink}"
         :style="menuContainerStyle">
      <m-menu :data="filterFlag ? filterMenus : menus"
              :active-name="activeName"
              :open-names="openNames"
              :accordion="!searchValue.length"
              :collapse="shrink"
              :hiddenList="hiddenList"
              @on-select="activeRouteByName"></m-menu>
    </div>
  </div>
  <!-- 菜单属性说明
    accordion：是否开启手风琴模式，开启后每次至多展开一个子菜单
    open-names：展开的Submenu的name集合
    active-name：激活菜单的 name 值
   -->
</template>

<script>
import mMenu from './m-menu/index.js'
import { mapGetters } from 'vuex'
import { deepcopy } from '@/assets/js/common.js'

export default {
  name: 'mainMenu',
  components: {
    mMenu
  },
  data() {
    return {
      timer: 0,
      shrink: false,
      searchValue: '',
      filterFlag: 0, // 过滤标识
      filterMenus: [], // 过滤后的菜单
      enterFlag: true, // 第一次进入
      hiddenList: ['cusSupport'],
      openNames: [], // 展开菜单项
      activeName: '' // 激活菜单项的name
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {},
  computed: {
    ...mapGetters([
      'accountType',
      'tabs',
      'currentTab',
      'menus',
      'routesInfo',
      'routesMap',
      'lang',
      'cssDatas'
    ]),
    /**
     * @description 以路由name为key的路由映射对象
     */
    routesNameMap() {
      let tmp = {}
      this.routesInfo.forEach(item => {
        tmp[item.name] = item
      })
      return tmp
    },
    /**
     * @description 激活菜单项的des
     */
    activeDes() {
      let path = this.tabs[this.currentTab].routePath
      return this.routesMap[path] ? this.routesMap[path].des : ''
    },
    menuContainerStyle() {
      if (this.shrink) {
        return 'overflow: visible;'
      } else {
        return 'overflow: auto; height: 0px;'
      }
    },
    admin() {
      return this.accountType === '0'
    }
  },
  methods: {
    fetchData() {
    },
    /**
     * @description 菜单收缩
     */
    menuShrink() {
      this.shrink = !this.shrink
      this.$emit('shrink', this.shrink)
      // 展开时需要处理下二级菜单的展开
      if (!this.shrink) {
        setTimeout(() => {
          this.ifExpand()
        }, 100)
      } else {
        let $li = document.querySelectorAll('.menu-container .h-menu-submenu')
        // 二级菜单ul容器
        $li.forEach((current, index) => {
          let $ul = $li[index].childNodes[2]
          if (!$ul.getAttribute('style').match(/none/g)) {
            current.setAttribute('expand', 'true')
          } else {
            current.removeAttribute('expand', 'true')
          }
        })
        var $expandLi = document.querySelectorAll('li[expand=true]')
        $expandLi.forEach((current, index) => {
          $expandLi[index].childNodes[0].click()
        })
      }

      this.$store.commit('setCssDatas', {
        target: 'menuShrink',
        val: this.shrink
      })

      // 动画延时200
      setTimeout(() => {
        this.$store.commit('setCssDatas', {
          target: 'resizeCount',
          val: this.cssDatas.resizeCount + 1
        })
      }, 200)
    },
    /**
     * @description 激活路由
     */
    activeRouteByName(id) {
      var oldMenu = document.querySelector(
        '.menu-container .h-menu-item-active'
      )
      if (oldMenu) {
        oldMenu.classList.remove('h-menu-item-active', 'h-menu-item-selected')
      }
      this.$store.dispatch('activeMenu', {
        routePath: this.routesNameMap[id].path,
        des: this.routesNameMap[id].des
      })
      this.$router.push(this.routesNameMap[id].path)
    },
    /**
     * @description 过滤菜单 / 后续可添加上拼音过滤
     * @param {String} filterVal 过滤值
     * @param {Array} menus menus数据
     */
    menusFilter(filterVal, menus) {
      const filter = ([start, ...others]) => {
        // 数组递归结束
        if (start === undefined) {
          return []
        }

        // 为伪菜单
        if (start.type === 0) {
          return []
        }

        let hasChild = start.children && start.children.length && start.children[0].type !== 0
        // 如果该菜单有子菜单，则过滤其子菜单
        if (hasChild) {
          return [...filter(start.children), ...filter(others)]
        }
        // 如果包含过滤值，则返回该菜单
        if (start.title.includes(filterVal)) {
          return [start, ...filter(others)]
        }
        // 如果又没子菜单又不包含过滤值，则放弃返回该菜单
        return [...filter(others)]
      }

      let temp = deepcopy(menus)
      let ret = filter(temp)
      // 修改level确保菜单显示一致
      ret.forEach(t => {
        t.level = -1
      })

      return ret
    },
    /**
     * @description currentTab改变时匹配到确定的菜单对象
     * @param {String} des 查找字符串
     */
    menusFilterActiveMenu(des) {
      if (!des) {
        return false
      }

      let ret = null
      debugger
      ret = this.filterByTitle(this.menus, {
        des,
        parents: []
      })
      this.openNames = ret.parents.map(menu => menu.code)
    },
    filterByTitle(menus, obj) {
      let isArray = /Array/.test(Object.prototype.toString.call(menus))

      if (isArray) {
        // 数组就循环执行
        for (let i = 0; i < menus.length; i++) {
          let ret = this.filterByTitle(menus[i], {
            des: obj.des,
            parents: [...obj.parents]
          })

          if (ret) return ret
        }
      } else {
        // 找到目标菜单返回
        if (menus.title === obj.des) {
          return obj
        }

        // 存在children则返回函数继续执行
        if (menus.children && menus.children.length) {
          return this.filterByTitle(menus.children, {
            des: obj.des,
            parents: [menus, ...obj.parents]
          })
        }

        // 默认返回
        return null
      }
    }
    // ifExpand() {
    //   var $expandLi = document.querySelectorAll('li[expand=true]')
    //   if ($expandLi.length) {
    //     $expandLi.forEach((current, index) => {
    //       $expandLi[index].removeAttribute('expand')
    //       $expandLi[index].childNodes[0].click()
    //     })
    //   } else {
    //     // 切换tab时展开菜单
    //     let expandName = this.activeMenu.code
    //     let $li = document.querySelector('li[expand-name=' + expandName + ']')
    //     if (!$li) {
    //       return false
    //     }
    //     // 二级菜单ul容器
    //     let $ul = $li.childNodes[2]
    //     if ($ul.getAttribute('style').match(/none/g)) {
    //       $li.childNodes[0].click()
    //     }
    //   }
    // }
  },
  watch: {
    searchValue: function(val) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // let _this = this
        if (val) {
          this.filterFlag = 1
          this.filterMenus = this.menusFilter(val, this.menus)

          // if (this.filterMenus.length) {
          //   setTimeout(() => {
          //     var $li = document.querySelectorAll(
          //       '.menu-container .h-menu-submenu'
          //     )
          //     if ($li.length) {
          //       $li.forEach(current => {
          //         if (current.querySelector('ul').style.display === 'none') {
          //           current.querySelector('div').click()
          //         }
          //       })
          //     }
          //     console.log(_this.activeName)
          //     this.$nextTick(() => {
          //       let $currentMenu = document.querySelector(
          //         'li[munu-name=' + _this.activeName + ']'
          //       )
          //       if ($currentMenu) {
          //         $currentMenu.classList.add(
          //           'h-menu-item-active',
          //           'h-menu-item-selected'
          //         )
          //       }
          //     })
          //   })
          // }
        } else {
          this.filterFlag = 0
          this.activeName += ' '
          this.openNames.push(' ')
          this.$nextTick(() => {
            this.activeName = this.activeName.trim()
            this.openNames.splice(this.openNames.length - 1, 1)
          })
        }
      }, 300)
    },
    /**
     * @description 当前tab值改变时判断是否需要展开菜单
     */
    currentTab: {
      immediate: true,
      handler: function() {
        // 激活菜单的名字
        let path = this.tabs[this.currentTab].routePath
        this.activeName = this.routesMap[path] ? this.routesMap[path].name : ''

        this.menusFilterActiveMenu(this.activeDes)
      }
    }
  }
}
</script>

<style lang="stylus" scope>
@import '~@css/variable.styl'

#mainMenu {
  min-height 100%
  display flex
  flex-direction column
  font-size 12px

  .search-container {
    flex 0 0 30px
    display flex

    .input-container {
      flex 1 1 auto
      font-size 12px

      .h-icon {
        width 24px
        height 24px
        line-height 30px
        color $menu-input
      }

      .h-input {
        height 28px
        border-radius 0
        border none
        border-bottom 1px solid $menu-input
        color $menu-input
        background $menu-bg

        &:hover {
          border-color none
          box-shadow none
        }

        &:focus {
          border-color none
          box-shadow none
          color $menu-input-hover
          border-bottom 1px solid $menu-input-hover
        }

        &::-webkit-input-placeholder {
          color $menu-input
        }

        &::-moz-placeholder {
          color $menu-input
        }
      }
    }

    .shrink-container {
      flex 0 0 30px
      margin 0 auto
      line-height 30px
      font-size 20px
      color $menu-input
      cursor pointer

      &:hover {
        color $menu-input-hover
      }
    }
  }

  .menu-container {
    overflow auto
    height 0px
    flex 1 1 auto

    &>.h-menu {
      margin-bottom 54px

      &>.h-menu-item {
        padding 14px 18px
      }

      .h-menu-item {
        padding-right 18px
      }

      &>.h-menu-opened .h-menu-submenu .h-menu-submenu-title {
        background $menu-bg
      }
    }
    &>.h-menu-collapse {
      &>.h-menu-item {
        padding 14px 12px
      }
    }
  }

  .menu-login-record {
    position absolute
    bottom 0
    z-index 1
    width 160px
    padding-top 6px
    padding-bottom 12px
    padding-left 20px
    text-align left
    background $menu-bg
    color $menu-font

    .login-time {
      padding-top 8px
      cursor pointer

      &:hover {
        color $nav-pick-bg
      }
    }
  }
}
</style>
