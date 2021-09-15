module.exports = {
  pluginOptions: {
    electronBuilder: {
      // 允许执行Nodejs
      nodeIntegration: true,
    },
  },
  transpileDependencies: [
    'vuetify'
  ]
}
