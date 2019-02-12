import Vue from 'vue'
import Main from './main.vue'
import { selfIsVNode } from '@/assets/js/common.js'
let MessageConstructor = Vue.extend(Main)

let instance
let instances = []
let seed = 1

const Message = function (options) {
  console.log(options)
  if (Vue.prototype.$isServer) return
  options = options || {}
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }
  let userOnClose = options.onClose
  let userOnConfirm = options.onConfirm
  let id = 'message_' + seed++

  options.onClose = function () {
    Message.close(id, userOnClose)
  }

  options.onConfirm = function() {
    if (typeof userOnConfirm === 'function') {
      userOnConfirm()
    }
    Message.close(id, userOnClose)
  }

  instance = new MessageConstructor({
    data: options
  })
  instance.id = id
  if (selfIsVNode(instance.messageExtra)) {
    instance.$slots.default = [instance.messageExtra]
    instance.messageExtra = null
  }
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.vm.visible = true
  instance.dom = instance.vm.$el
  instances.push(instance)
  return instance.vm
}

;['success', 'warning', 'info', 'error'].forEach(type => {
  Message[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return Message(options)
  }
})

Message.close = function (id, userOnClose) {
  for (let i = 0, len = instances.length; i < len; i++) {
    if (id === instances[i].id) {
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i])
      }
      instances.splice(i, 1)
      break
    }
  }
}

Message.closeAll = function () {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close()
  }
}

Message.instances = instances

export default Message
