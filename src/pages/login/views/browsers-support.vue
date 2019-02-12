<template>
  <div id="browsersSupport">
    <div class="content">
      <img class="support-icon" src='@login/assets/images/support.png'/>
      <p class="prompt">{{msg}}</p>
      <p class="instruction">温馨提示：为了您能够正常使用网站功能， 请使用Chrome浏览器51+以上版本访问。</p>
      <h-button type="primary" @click="downLoadChrome">下载Chrome</h-button>
    </div>
  </div>
</template>
<script>
import { getBrowserInfo } from '@/assets/js/common.js'
export default {
  name: 'browsersSupport',
  data() {
    return {
      msg: '不支持当前浏览器，请您更换成Chrome浏览器。'
    }
  },
  methods: {
    downLoadChrome() {
      window.open('https://www.google.cn/chrome/')
    }
  },
  mounted() {
    let browserInfo = getBrowserInfo()
    if (browserInfo.browser === 'chrome') {
      this.msg = 'Chrome浏览器版本过低，请您升级浏览器。'
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@css/mixin.styl'
#browsersSupport
  width 100%
  height 100%
  position relative
  text-align center
  .content
    position absolute
    top 45%
    left 50%
    width 100%
    transform translate(-50%,-50%)
    .support-icon
      width 460px
      height 300px
    .prompt
      width 100%
      height 28px
      line-height 28px
      font-size 20px
      color $font-title
    .instruction
      margin-top 6px
      font-size 14px
      color $instruction
    button
      width 160px
      font-size 14px
      height 42px
      margin-top 20px
      a
        color $font-color-white
      a:hover
        color $font-color-white
</style>
