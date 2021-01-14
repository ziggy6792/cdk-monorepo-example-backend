/* eslint-disable @typescript-eslint/no-var-requires */

const base = require('./jest.config.base.js');

module.exports = {
  ...base,
  roots: [],
  projects: ['<rootDir>/packages/*/jest.config.js'],
};
