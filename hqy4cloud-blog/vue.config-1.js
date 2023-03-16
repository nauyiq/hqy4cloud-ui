const path = require('path');

module.exports = {
    publicPath:'./',    // 公共路径
    outputDir: 'dist', // 不同的环境打不同包名
    css: {  // 一次配置，全局使用，这个scss 因为每个文件都要引入
        loaderOptions: {
            sass: {
                data: `@import "./src/assets/hotcss/px2rem.scss";`
            }
        }
    },
    lintOnSave:false,  // 关闭eslint
    productionSourceMap:true,  // 生产环境下css 分离文件
}
