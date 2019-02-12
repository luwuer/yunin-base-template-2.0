<template>
  <transition name="msgbox-fade">
    <div class="self-msgbox-wrapper"
         v-show="visible">
      <div class="self-msgbox">
        <i class="close-icon-c"
           @click="close">
          <svg class="icon"
               aria-hidden="true">
            <use xlink:href="#icon-guanbi-"></use>
          </svg>
        </i>
        <div class="msg-icon-c clearfix">
          <svg class="icon"
               aria-hidden="true">
            <use :xlink:href="iconName"></use>
          </svg>
        </div>
        <div class="content-c clearfix">
          <div class="msg">
            {{message}}
          </div>
          <div class="extra-msg">
            <template v-if="messageExtra !== null">{{ messageExtra }}</template>
            <slot v-else>
            </slot>
          </div>
        </div>
        <div class="self-msgbox-footer"
             v-if="btns.length">
          <h-button type="primary"
                    v-if="btns[0]"
                    @click="confirm">{{btns[0]}}</h-button>
          <h-button type="ghost"
                    v-if="btns[1]"
                    @click="close">{{btns[1]}}</h-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Button from 'h_ui/src/components/Button'

const ICONMAP = {
  success: '#icon-chenggong',
  warning: '#icon-tishi',
  error: '#icon-shibai'
}

export default {
  components: {
    'h-button': Button
  },
  data() {
    return {
      type: 'warning',
      message: '',
      messageExtra: '',
      duration: 0,
      btns: [],
      onClose: null,
      onConfirm: null,
      visible: false,
      closed: false,
      timer: -1
    }
  },
  computed: {
    iconName() {
      return this.type ? ICONMAP[this.type] : ICONMAP['warning']
    }
  },
  methods: {
    destroyElement() {
      this.$el.removeEventListener('animationend', this.destroyElement)
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },
    close() {
      this.closed = true
      this.onClose(this)
    },
    confirm() {
      this.onConfirm(this)
      this.closed = true
    },
    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close()
          }
        }, this.duration)
      }
    },
    keydown(e) {
      // esc关闭
      if (e.keyCode === 27) {
        if (!this.closed) {
          this.close()
        }
      }
    }
  },
  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false
        this.$el.addEventListener('animationend', this.destroyElement)
      }
    }
  },
  mounted() {
    this.startTimer()
    document.addEventListener('keydown', this.keydown)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydown)
  }
}
</script>

<style lang="stylus" scoped>
@import '~@css/variable.styl'

.msgbox-fade-enter-active {
  animation msgbox-fade-in 0.3s
}

.msgbox-fade-leave-active {
  animation msgbox-fade-out 0.3s
}

@keyframes msgbox-fade-in {
  0% {
    transform translate3d(0, -20px, 0)
    opacity 0
  }

  100% {
    transform translate3d(0, 0, 0)
    opacity 1
  }
}

@keyframes msgbox-fade-out {
  0% {
    transform translate3d(0, 0, 0)
    opacity 1
  }

  100% {
    transform translate3d(0, -20px, 0)
    opacity 0
  }
}

.self-msgbox-wrapper {
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  height 120% // 设置120%是为了动画时半透明背景仍然全覆盖页面
  text-align center
  z-index 2018
  background rgba(0, 0, 0, 0.5)

  &:after {
    content ''
    display inline-block
    height 83.3% // 与屏幕等高，self-msgbox的vertical-align middle就能使其居中: 120% * 83.3% = 100%
    width 0px
    vertical-align middle
  }

  .self-msgbox {
    position relative
    display inline-block
    width 420px
    padding 30px 60px 20px
    vertical-align middle
    background-color #fff
    border-radius 3px
    border 1px solid #ebeef5
    font-size 18px
    box-shadow 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    text-align left
    overflow hidden
    backface-visibility hidden

    .close-icon-c {
      position absolute
      top 4px
      right 6px
      font-size 16px
      cursor pointer

      &:hover {
        color $cm-icon-hover
      }
    }

    .msg-icon-c {
      float left
      width 72px
      line-height 1
      font-size 72px
    }

    .content-c {
      padding-left 14px
      margin-left 72px

      .msg {
        min-height 36px
        padding-top 12px
        padding-bottom 6px
        font-size 14px
        font-weight 700
        color $cm-font-color
      }

      .extra-msg {
        font-size 12px
        color $cm-font-color-tint
        line-height 16px
        word-break break-all
      }
    }

    .self-msgbox-footer {
      position relative
      top 7px
      text-align center

      .h-btn {
        margin 0 5px
      }
    }
  }
}
</style>
