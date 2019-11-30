/** * @file webpack的工具文件 */

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const compilerEnv = require('../config/compile').client;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  // 处理样式加载器
  handleStyleLoader: function() {
    let styleLoader = {
      test: /\.css$/,
      use: [
        compilerEnv.env === 'production'
          ? MiniCssExtractPlugin.loader
          : 'style-loader',
        'css-loader',
      ],
    };
    if (compilerEnv.sass) {
      styleLoader.test = /\.(sa|sc|c)ss$/;
      styleLoader.use.push('sass-loader');
    } else if (compilerEnv.less) {
      styleLoader.test = /\.(le|c)ss$/;
      styleLoader.use.push('less-loader');
    }

    return styleLoader;
  },

  // 注册加载器
  registerLoader: function() {
    const StyleLoader = this.handleStyleLoader();
    return [StyleLoader];
  },

  registerPlugins: function() {
    return [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new MiniCssExtractPlugin({
        filename: 'style/[name].[hash].css',
        chunkFilename: 'style/[id].[hash].css',
      }),
    ];
  },

  // 生产模式
  getProdWebpackConfig: function(tpl) {
    tpl.mode = 'production';

    tpl.output = Object.assign({}, tpl.output, {
      filename: 'main.min.js',
      chunkFilename: 'chunk/[name].chunk.min.js?_t=[chunkhash]',
    });

    tpl.resolve.alias.vue = 'vue/dist/vue.runtime.min.js';

    // loader
    const ProdLoaders = this.registerLoader();
    ProdLoaders.forEach(loaders => {
      tpl.module.rules.push(loaders);
    });

    // plugins
    const ProdPlugins = this.registerPlugins();
    ProdPlugins.forEach(plugins => {
      tpl.plugins.push(plugins);
    });

    // optimization
    tpl.optimization.minimizer = [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ];

    return tpl;
  },

  // 开发模式
  getDevWebpackConfig: function(tpl) {
    tpl.mode = 'development';

    tpl.output = Object.assign({}, tpl.output, {
      filename: 'main.js',
      chunkFilename: 'chunk/[name].chunk.js?_t=[chunkhash]',
    });

    tpl.devtool = 'inline-source-map';

    // loader
    // loader
    const DevLoaders = this.registerLoader();
    DevLoaders.forEach(loaders => {
      tpl.module.rules.push(loaders);
    });

    return tpl;
  },
};
