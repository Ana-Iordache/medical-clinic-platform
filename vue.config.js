const { defineConfig } = require('@vue/cli-service')
const config = require('./config.json');
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  },

  devServer: {
    host: config.FRONTEND_HOST,
    port: config.FRONTEND_PORT
  }
})
