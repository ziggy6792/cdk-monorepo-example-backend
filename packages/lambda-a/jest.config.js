/* eslint-disable @typescript-eslint/no-var-requires */
// Jest configuration for api
const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  globals: {
    'ts-jest': {
      tsConfig: 'some shit',
    },
  },
  name: 'lambda-a-bla',
  displayName: 'lambda-a-bla',
};
