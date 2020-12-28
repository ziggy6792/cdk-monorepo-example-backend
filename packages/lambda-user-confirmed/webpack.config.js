const {merge} = require('webpack-merge')
const path = require('path')
const rootConfig = require(path.join(__dirname, '../../webpack.config.build.js'))

const output = merge(
	rootConfig(__dirname)
)

module.exports = output