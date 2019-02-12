import Vue from 'vue'
import Main from './main.vue'
import { selfIsVNode } from '@/assets/js/common.js'
let MenuConstructor = Vue.extend(Main)

let instance = null
let instances = []

const ContextMenu = function (options) {
  if (Vue.prototype.$isServer) return

  options = options || {}

  let userOnClose = options.onClose

  options.onClose = function () {
    ContextMenu.close(userOnClose)
  }

  instance = new MenuConstructor({
    data: options
  })
  if (selfIsVNode(instance.message)) {
    instance.$slots.default = [instance.message]
    instance.message = null
  }
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instances.push(instance)
  instance.vm.visible = true
  instance.dom = instance.vm.$el
  return instance.vm
}

ContextMenu.close = function (userOnClose) {
  userOnClose(instance)
}

ContextMenu.init = options => {
  return ContextMenu(options)
}

export default ContextMenu
