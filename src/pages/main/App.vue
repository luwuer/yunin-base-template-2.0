<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  computed: {
  },
  created() {
    this.$store.dispatch('fetchLang', 'zh-CN')
  }
}
</script>

<style lang="stylus">
@import '~@css/index.styl'

#app {
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
}
</style>
