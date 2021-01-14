/* eslint-disable @typescript-eslint/no-var-requires */
// Jest configuration for api
const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  roots: ['<rootDir>/src'],
  moduleDirectories: ['node_modules', '<rootDir>'],
};
