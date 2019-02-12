<template>
  <div class="m-dot" :style="wrapperStyle">
    <span v-if="serial > 0" class="serial">{{serial}}</span>
  </div>
</template>

<script>
export default {
  name: 'mDot',
  props: {
    width: {
      type: [Number, String],
      default: 8
    },
    color: {
      type: String,
      default: 'red'
    },
    solid: {
      type: Boolean,
      default: true // true: 实心点 false: 空心点
    },
    type: {
      type: String,
      default: 'circle' // circle: 圆点
    },
    serial: {
      type: Number,
      default: 0 // serial > 0 时显示序号
    }
  },
  computed: {
    typeStyle() {
      let style = `line-height: ${this.width}px;`

      if (this.type === 'circle') {
        style += `border-radius: ${this.width}px;`
      }

      return style
    },
    solidStyle() {
      let style = `
        width: ${this.width}px;
        height: ${this.width}px;
        background-color: ${this.color};
      `
      style += this.typeStyle
      return style
    },
    hollowStyle() {
      let style = `
        width: ${this.width}px;
        height: ${this.width}px;
        border: 1px solid ${this.color};
        background-color: transparent;
      `
      style += this.typeStyle
      return style
    },
    wrapperStyle() {
      if (this.solid) return this.solidStyle
      else return this.hollowStyle
    }
  }
}
</script>

<style lang="stylus" scoped>
.m-dot {
  display inline-block
  text-align center
  font-size 12px
  color #fff
}
</style>
