/* 配置跨域 */
module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target:'http://evasystem.natapp1.cc',
                changeOrigin: true,
                pathRewrite:{
                    '^/api': ''
                }
            }
        }
    }
}
