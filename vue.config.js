module.exports = {
  runtimeCompiler:true,
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= 'Derify Protocol'
        return args
      })
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          hack: 'true; @import "~@/styles/var.less";'
        }
      }
    }
  }
}
