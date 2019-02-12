<template>
  <h-menu theme="dark"
          @on-select="activeRouteByName"
          mode="vertical"
          :active-name="activeName"
          :open-names="openNames"
          :accordion="accordion"
          :collapse="collapse">
    <menu-node v-for="menu in data"
               :key="menu.code"
               :menu="menu"
               :collapse="collapse"
               :hiddenList="hiddenList"
               :active-name="activeName"></menu-node>
  </h-menu>
</template>

<script>
import menuNode from './node'

export default {
  name: 'mMenu',
  components: {
    menuNode
  },
  props: {
    data: Array,
    activeName: String,
    openNames: Array,
    accordion: Boolean,
    collapse: Boolean,
    hiddenList: Array
  },
  methods: {
    activeRouteByName() {
      console.log(arguments)
      this.$emit('on-select', ...arguments)
    }
  }
}
</script>

<style lang="stylus">
.h-menu {
  width 160px !important

  .h-menu-item, .h-menu-submenu {
    line-height 1
    font-size 12px

    &:hover {
      background #495060 !important
    }
  }

  &>.h-menu-item {
    padding 14px 18px
  }

  &>.h-menu-submenu {
    &>.h-menu-submenu-title {
      padding 14px 18px
    }

    &>.h-menu{
      background #495060 !important

      &>.h-menu-submenu {
        &>.h-menu-submenu-title {
          padding-left 34px
        }

        &>.h-menu>.h-menu-item {
          padding-left 52px

          &:hover {
            background #495060 !important
          }
        }
      }

      &>.h-menu-item {
        padding-left 34px

        &:hover {
          // background #495060 !important
        }
      }
    }

    .h-menu-submenu-title {
      line-height 1
    }

    .h-menu-item {
      padding-top 14px
      padding-bottom 14px
    }
  }

  .m-dot {
    float left
    margin-top 2px
    margin-right 8px
    margin-left 2px
  }
}

.shrink {
  &>.h-menu {
    width 40px !important

    &>.h-menu-item {
      padding-left 12px
      width 40px
      line-height 1

      .menu-item-text {
        display none
      }
    }

    &>.h-menu-submenu {
      width 40px

      .h-menu-item {
        padding-left 30px
      }
    }

    .h-menu-submenu-title {
      line-height 1
      padding-left 12px
    }
  }
}
</style>
