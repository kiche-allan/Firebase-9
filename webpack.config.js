const path = require('path')

module.exports = {
  devtool: 'source-map ./src',
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  watch: true
  
}
