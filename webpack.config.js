const path = require('path');

module.exports = {
  entry: './src/bcoinaddr.js',
  target: 'web',
  externals: [],
  output: {
    path: path.resolve('dist'),
    filename: 'bcoinaddr.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
