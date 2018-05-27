var path = require('path')

module.exports = [
  {
    target: 'web',
    entry: {
      flexfs: './flexfs.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      library: 'flexfs'
    },
    mode: 'development',
    devtool: 'source-map',
    watch: false,
    watchOptions: {
      aggregateTimeout: 1000,
      poll: 1000
    }
  }
]
