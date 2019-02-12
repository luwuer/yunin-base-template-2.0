<template>
  <div id="login">
    <p>Login Page !</p>
    <h-button @click="clickHandle">{{buttonText}}</h-button>
  </div>
</template>

<script>
import Button from 'h_ui/src/components/Button'
import 'h_ui/dist/h_ui.min.css'

export default {
  name: 'login',
  components: {
    'h-button': Button
  },
  data() {
    return {
      buttonText: 'To Index'
    }
  },
  methods: {
    clickHandle() {
      location.href = location.origin + '/main.html'
    }
  }
}
</script>

<style lang="stylus">
#login {
  width 100%
  height 100%
  padding-top 300px
}
</style>
