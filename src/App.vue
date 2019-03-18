<template>
  <div id="app">
    <file-upload-demo></file-upload-demo>
  </div>
</template>

<script>
import fileUploadDemo from './components/file-upload-demo.vue'

export default {
  name: 'app',
  components: {
    fileUploadDemo
  }
}
</script>
<style lang="stylus">
#app {
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
}
</style>
