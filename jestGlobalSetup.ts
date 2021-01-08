// import { spawn } from 'child_process';
// import cwd from 'cwd';

// import setup from 'packages/lambda-gq-resolver/src/test-utils/setup';
import AWS from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// process.stdout.write('Starting Server');

// module.exports = {};

const serviceConfigOptions: ServiceConfigurationOptions = {
  region: 'local',
  endpoint: 'http://localhost:8000',
};

AWS.config.update(serviceConfigOptions);

export default async function () {
  await delay(1);
  // await setup();
  process.stdout.write('Starting Server');
  // Delete all the tables
}

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
