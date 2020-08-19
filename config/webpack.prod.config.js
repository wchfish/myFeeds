const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: path.join(__dirname, '../src/index.js'),
    output: {
        path: path.join(__dirname, "../lib/"),
        filename: "index.js",
        library: 'MyFeed',
        libraryTarget: 'umd', // 采用通用模块定义
        libraryExport: 'default', // 兼容 ES6 的模块系统、CommonJS 和 AMD 模块规范
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/                
            },
            {
                test: /\.(c|sc|sa)ss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {    
                            plugins: (loader) => [
                                require('postcss-import')({root: loader.resourcePath}),
                                require('autoprefixer')(), //CSS浏览器兼容
                                require('postcss-pxtorem')({ rootValue: 16, propList: ['*'], selectorBlackList: [] }),
                            ]
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpg|bmp|png|jpeg|gif|webp)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "main.min.css" // 提取后的css的文件名
        })
    ],
    optimization: {
        minimize:false
    },
    externals: { // 定义外部依赖，避免把react和react-dom打包进去
        react: {
            root: "React",
            commonjs2: "react",
            commonjs: "react",
            amd: "react"
        },
        "react-dom": {
            root: "ReactDOM",
            commonjs2: "react-dom",
            commonjs: "react-dom",
            amd: "react-dom"
        },
        "rmc-notification": {
            root: "Notification",
            commonjs2: "rmc-notification",
            commonjs: "rmc-notification",
            amd: "rmc-notification"
        }
    }
}



