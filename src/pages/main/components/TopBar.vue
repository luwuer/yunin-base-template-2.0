<template>
  <div id="topBar">
    <div class="name"
         @click="toIndex">
      <span class="brand">
        <svg class="icon">
          <use xlink:href="#icon-sixianghuiLogo-"></use>
        </svg>
      </span>
    </div>
    <div class="operate-c">
      <h-dropdown trigger="click">
        <div class="dropdown-title">
          <i class="icon-wrapper">
            <svg class="icon">
              <use xlink:href="#icon-denglu-tubiao-"></use>
            </svg>
          </i>
          <span class="acc-name-wrapper"
                :title="operatorName">
            {{operatorName || ''}}
          </span>
          <h-icon name="unfold"
                  class="dropdown-unfold"></h-icon>
        </div>
        <h-dropdown-menu slot="list">
          <h-dropdown-item @click.native="toUserCenter">个人中心</h-dropdown-item>
          <h-dropdown-item @click.native="logout">登出</h-dropdown-item>
        </h-dropdown-menu>
      </h-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { activeTabByPath, toLogin } from '@/assets/js/common.js'
export default {
  name: 'topbar',
  data() {
    return {
      status: '0', // 默认跳转 消息中心 显示 全部 分类
      msgToolbarShow: false, // 消息弹窗的显示隐藏
      msgBefore5List: []
    }
  },
  computed: {
    ...mapGetters(['operatorName', 'lang']),
    admin() {
      return this.accountType === '0'
    }
  },
  methods: {
    toIndex() {
      activeTabByPath('/')
    },
    toUserCenter() {
      activeTabByPath('/common/user/info')
    },
    logout() {
      let type = ''
      if (
        this.$store.getters.accountType &&
        this.$store.getters.accountType === '0'
      ) {
        type = 'admin'
      }

      this.$store.dispatch('logout').then(() => {
        if (type === 'admin') {
          toLogin('admin')
        } else {
          toLogin()
        }
      })
    },
    /**
     * @description 前往消息中心
     */
    toMsg() {
      activeTabByPath('/common/msg', {
        status: this.status
      })
    },
    /**
     * @description 跳转消息详情
     */
    toDetail(id) {
      activeTabByPath('/common/msg/detail', {id})
    }
  },
  mounted() {
    // 点击别处 下拉框隐藏
    document.addEventListener('click', (e)=> {
      if (e.target.className !== 'msg-info-toolbar-wrap') {
        this.msgToolbarShow = false
      }
    })
  },
  activated() {

  }
}
</script>

<style lang="stylus" scoped>
@import '~@css/variable.styl'

#topBar {
  height 50px
  background-color $top-bg

  .name {
    float left
    width 220px
    height 50px
    margin-left 10px

    .brand {
      float left
      margin-top 12px
      height 25px
      width 202px
      background-repeat no-repeat
      background-size cover
      overflow hidden
      cursor pointer

      &>.icon {
        position relative
        top -46px
        color white
        font-size 120px
      }
    }

    .title {
      float left
      width 200px
      height 50px
      line-height 50px
      text-align left
      font-size 17px
      color #eee
    }
  }

  .operate-c {
    float right
    padding 12px 0
    margin-right 20px
    height 50px
    vertical-align top

    &>.h-dropdown {
      position relative
      top 4px

      .dropdown-title {
        display inline-block
        color $font-color-white
        cursor pointer
        font-size 20px

        .acc-name-wrapper {
          position relative
          top 1px
          display inline-block
          max-width 80px
          line-height 12px
          font-size 12px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
        }

        .dropdown-unfold {
          position relative
          top 1px
          left -4px
        }
      }
    }
  }

  .h-menu-item {
    &>span {
      font-size 12px
    }
  }

  .h-menu-item-selected {
    color $menu-item-selected
  }
}
</style>
