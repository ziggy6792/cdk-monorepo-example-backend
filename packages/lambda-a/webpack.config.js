/* eslint-disable no-underscore-dangle */
const { merge } = require('webpack-merge');
const path = require('path');

const rootConfig = require(path.join(__dirname, '../../webpack.config.build.js'));

const npmPackage = require('./package.json');

const output = merge(rootConfig(__dirname), {
  resolve: {
    alias: npmPackage._moduleAliases || {},
  },
});

module.exports = output;
