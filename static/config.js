/**
* vue 打包后保留配置文件
* 1.配置文件放在static目录下 不会被打包
* 2.在 eslintrc.js文件中添加globals全局变量
* 3.在index.html中引用
* 4.用配置文件中的常量初始化 vuex中的全局变量
* @author cuiayng18756
*/

/* eslint-disable no-unused-vars */
var config = {
  baseUrl: '/api', // proxy table | static
  pageSizeOpts: [10, 20, 50, 100]
}
