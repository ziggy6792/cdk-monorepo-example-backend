/* eslint-disable @typescript-eslint/no-var-requires */
// Jest configuration for api
const base = require('../../jest.config.base.js');

const package = require('./package.json');

module.exports = {
  ...base,

  name: package.name,
  displayName: package.name,
  roots: ['<rootDir>/src'],
  moduleDirectories: ['node_modules', '<rootDir>'],
};
