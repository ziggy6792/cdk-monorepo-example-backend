const { merge } = require('webpack-merge');
const path = require('path');

const rootConfig = require(path.join(__dirname, '../../webpack.config.build.js'));

const output = merge(rootConfig(__dirname), {
  resolve: {
    roots: ['/Users/sive/Documents/Training/serverless/cdk-monorepo-example/cdk-monorepo-example-backend/packages/lambda-a'],
    alias: {
      src: '/src',
    },
  },
});

module.exports = output;
