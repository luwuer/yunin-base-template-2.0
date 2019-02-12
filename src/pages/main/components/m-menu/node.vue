<template>
  <h-menu-item v-if="renderItem"
               v-show="!hiddenList.includes(menu.code)"
               :name="menu.code"
               :munu-name="menu.code"
               :title="menu.title">
    <i class="icon-wrapper"
       v-if="menu.icon && menu.level === 1">
      <svg class="icon">
        <use :xlink:href="`#${menu.icon}`"></use>
      </svg>
    </i>
    <m-dot v-if="showDot"
           width="8"
           color="rgba(255, 255, 255, 0.7)"
           :solid="dotSolid"></m-dot>

    <span class="menu-item-text">{{menu.title}}</span>
  </h-menu-item>
  <h-submenu v-else
             v-show="!hiddenList.includes(menu.code)"
             :name="menu.code"
             :munu-name="menu.code"
             mode="vertical"
             :expand-name="menu.code"
             class="can-expand">
    <template slot="title">
      <i class="icon-wrapper"
         v-if="menu.icon && menu.level === 1">
        <svg class="icon">
          <use :xlink:href="`#${menu.icon}`"></use>
        </svg>
      </i>
      <m-dot v-if="showDot"
             width="8"
             color="rgba(255, 255, 255, 0.7)"
             :solid="dotSolid"></m-dot>
      <span class="menu-item-text">{{menu.title}}</span>
    </template>

    <menu-node v-for="item in menu.children"
               :key="item.code"
               :menu=item
               :collapse="collapse"
               :hiddenList="hiddenList"
               :active-name="activeName"></menu-node>
  </h-submenu>
</template>

<script>
import mDot from '@/components/m-dot'

export default {
  name: 'menuNode',
  components: {
    mDot
  },
  props: {
    menu: Object,
    collapse: Boolean,
    hiddenList: Array,
    activeName: String
  },
  computed: {
    showDot() {
      return this.menu.level === 2
    },
    dotSolid() {
      let flag = this.menu.code === this.activeName
      let childrenSelectFlag = !!this.menu.children.filter(menu => menu.code === this.activeName).length

      return flag || childrenSelectFlag
    },
    renderItem() {
      if (!this.menu.children) {
        return true
      } else {
        return !this.menu.children.filter(menu => menu.type === 1).length
      }
    }
  }
}
</script>
