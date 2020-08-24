const webpack = require('webpack')
const path = require('path')

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, '../example/app.js'),
    output: {
        path: path.join(__dirname, '../example/'),
        filename: 'bundle.js'
    },
    devtool: 'cheap-module-eval-source-map',
    performance: {
        hints: "warning",
        maxEntrypointSize: 100000000, 
        maxAssetSize: 300000000
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
    devServer: {
        contentBase: path.join(__dirname, '../example/'),
        compress: true,
        host: 'v.jd.com',
        port: '8811',
        open: true,
        hot: true
    }
}



