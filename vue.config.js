const path = require('path')

const _resolve = relativePath => path.resolve(__dirname, relativePath)

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@', _resolve('src'))
      .set('@css', _resolve('src/assets/stylus'))
  }
}
