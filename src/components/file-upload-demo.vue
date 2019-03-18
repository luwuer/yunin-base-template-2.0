<template>
  <div class="file-upload-demo">
    <div class="header-box"
         ref="header">
      <div class="search-box">
        <h-form ref="formItems"
                :model="query"
                :label-width="140"
                inline>
          <h-row>
            <h-col :span="12">
              <h-form-item label="示例文件">
                <h-upload multiple
                          action="//jsonplaceholder.typicode.com/posts/"
                          :on-success="uploadSuccess">
                  <h-button type="ghost"
                            icon="ios-cloud-upload-outline">上传文件</h-button>
                </h-upload>
              </h-form-item>
            </h-col>
          </h-row>
        </h-form>
      </div>
      <div class="btn-box">
      </div>
    </div>
    <div class="content-box">
      <div class="table-box">
        <h-table showTitle
                 stripe
                 border
                 :columns="columns"
                 :data="tableData"
                 ref="tb">
        </h-table>
      </div>
      <div class="table-footer"
           ref="footer">
        <h-page :total="page.total"
                :current="page.pageNo"
                :page-size="page.pageSize"
                :page-size-opts="page.pageSizeOpts"
                show-elevator
                show-total
                show-sizer
                @on-change="pageNoChange"
                @on-page-size-change="pageSizeChange"
                placement="top">
        </h-page>
      </div>
    </div>
  </div>
</template>

<script>
import { getFileList } from '@/assets/js/api'

export default {
  name: 'file-upload-demo',
  data() {
    return {
      query: {},
      columns: [
        {
          title: '序号',
          type: 'text',
          key: 'p0',
          align: 'left',
          ellipsis: true
        },
        {
          title: '文件名',
          type: 'text',
          key: 'p1',
          align: 'left',
          ellipsis: true
        },
        {
          title: '上传路径',
          type: 'text',
          key: 'p2',
          align: 'left',
          ellipsis: true
        },
        {
          title: 'md5',
          type: 'text',
          key: 'p3',
          align: 'left',
          ellipsis: true
        },
        {
          title: '大小',
          type: 'text',
          key: 'p4',
          align: 'left',
          ellipsis: true
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 120,
          render: (h, params) => {
            return h(
              'div',
              {
                attrs: {
                  class: 'operate-wrapper'
                }
              },
              [
                h('h-icon', {
                  attrs: {
                    title: '查看文件详情'
                  },
                  props: {
                    name: 'search'
                  }
                }),
                h('h-icon', {
                  attrs: {
                    title: '删除文件'
                  },
                  props: {
                    name: 't-b-delete'
                  }
                })
              ]
            )
          }
        }
      ],
      tableData: [],
      page: {
        total: 0,
        pageNo: 1,
        pageSize: config.pageSizeOpts[0],
        pageSizeOpts: config.pageSizeOpts
      }
    }
  },
  methods: {
    fetchData() {
      console.log('fetch data...')
      getFileList().then(data => {
        this.tableData = data
      })
    },
    uploadSuccess() {
      this.$hMessage.success('文件上传成功！')
      this.fetchData()
    },
    pageNoChange(no) {
      this.page.pageNo = no
      this.fetchData()
    },
    pageSizeChange(size) {
      this.page.pageSize = size
      this.fetchData()
    }
  },
  created() {
    this.fetchData()
  }
}
</script>

<style lang="stylus">
@import '~@css/mixin.styl'

.file-upload-demo {
  common-table-container()
}
</style>
