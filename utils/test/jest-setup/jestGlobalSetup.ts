// import { spawn } from 'child_process';
// import cwd from 'cwd';

import AWS from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

// function lsWithGrep() {
//   exec('yarn start:local:db  &> startLocalDb.log &', (err, stdout, stderr) => {
//     if (err) {
//       // some err occurred
//       console.error(err);
//     } else {
//       // the *entire* stdout and stderr (buffered)
//       console.log(`stdout: ${stdout}`);
//       console.log(`stderr: ${stderr}`);
//     }
//   });
// }

import * as child from 'child_process';
import incCounter from './util';

// const { exec } = require('child_process');
// const util = require('util');
// const exec = util.promisify(require('child_process').exec);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// process.stdout.write('Starting Server');

// module.exports = {};

const serviceConfigOptions: ServiceConfigurationOptions = {
  region: 'local',
  endpoint: 'http://localhost:8000',
};

AWS.config.update(serviceConfigOptions);

const setup = async function () {
  await delay(1);
  // await setup();
  // process.stdout.write('Starting Server');
  console.log('bla bla bla');

  const ls = child.spawn('yarn', ['start:local:db']);

  ls.stdout.on('data', function (data) {
    console.log(`stdout: ${data.toString()}`);
  });

  ls.stderr.on('data', function (data) {
    console.log(`stderr: ${data.toString()}`);
  });

  ls.on('exit', function (code) {
    console.log(`child process exited with code ${code.toString()}`);
  });

  (global as any).testVariable = 'hello';

  await delay(3000);

  incCounter();

  // throw new Error('End Setup');
  // Listen for local db to be available
  // Delete all the tables
};
// setup();

export default setup;

// export default async function setup() {
//   process.stdout.write('Starting Server');

//   global.externalLibrary = 'hello';

//   // // Run this command in shell.
//   // // Every argument needs to be a separate string in an an array.
//   // const command = 'foreman';
//   // const arguments = ['start', '-p', '3000', '-f', 'Procfile.test'];
//   // const options = {
//   //   shell: true,
//   //   cwd: cwd(),
//   // };

//   // const server = spawn(command, arguments, options);

//   // Then I run a custom script that pings the server until it returns a 200.
// }
