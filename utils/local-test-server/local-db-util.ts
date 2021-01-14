/* eslint-disable import/no-extraneous-dependencies */
import * as child from 'child_process';
import kill from 'tree-kill';
import poll from 'promise-poller';
import util from 'util';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { table } from 'console';
import AWS = require('aws-sdk');

const exec = util.promisify(child.exec);

let localDb: child.ChildProcessWithoutNullStreams;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// export const checkConnection = async (): Promise<boolean> => {
//   // Removed because aws does not have nc instaled
//   try {
//     const { stderr } = await exec('nc -z localhost 8000 ');
//     console.log(stderr);
//     const isReady = stderr.includes('Connection to localhost port 8000 [tcp/irdmi] succeeded!');
//     return isReady;
//   } catch (err) {
//     // console.log('LOCAL DB: connection error');
//     throw new Error(err);
//   }
// };

// export const checkConnection = async (): Promise<boolean> => {
//   let isReady = false;
//   try {
//     const { stderr } = await exec('bash -c "</dev/tcp/localhost/8000"; echo $?');
//     console.log('LOCAL DB: ', stderr);
//     isReady = !stderr.includes('Connection refused');
//   } catch (err) {
//     console.log('LOCAL DB: connection error');
//     console.log(err);
//     throw new Error(err);
//   }
//   if (!isReady) {
//     throw new Error('Not ready');
//   }
//   console.log('LOCAL DB: Connection Ready');
//   return true;
// };

const promiseWithTimeout = function (promise: Promise<any>, ms: number) {
  // Create a promise that rejects in <ms> milliseconds
  const timeout = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(`Timed out in ${ms}ms.`));
    }, ms);
  });

  // Returns a race between our timeout and the passed in promise
  return Promise.race([promise, timeout]);
};

export const checkConnection = async (): Promise<boolean> => {
  const serviceConfigOptions: ServiceConfigurationOptions = {
    region: 'local',
    endpoint: 'http://localhost:8000',
  };

  const dynamodb = new AWS.DynamoDB(serviceConfigOptions);
  const tables = await promiseWithTimeout(dynamodb.listTables().promise(), 1000);
  console.log('LOCAL DB: READY');

  return true;
};

export const start = async (): Promise<void> => {
  console.log('\n\nLOCAL DB: INIT');
  try {
    const isAlredyRunning = await checkConnection();
    if (isAlredyRunning) {
      // Just incase the server is somehow stil running from the last run
      console.log('LOCAL DB: FORCE STOP');
      const { stderr } = await exec('yarn local:db:force:stop');
    }
  } catch (err) {
    // Do nothing - must be is it not running
  }

  console.log('LOCAL DB: START');

  localDb = child.spawn('yarn', ['local:db:start']);

  localDb.stdout.on('data', function (data) {
    console.log(`stdout: ${data.toString()}`);
  });

  localDb.stderr.on('data', function (data) {
    console.log(`stderr: ${data.toString()}`);
  });

  localDb.on('exit', function (code) {
    console.log(`child process exited with code ${code.toString()}`);
  });

  try {
    await poll({
      taskFn: checkConnection,
      interval: 100,
      retries: 200,
    });
  } catch (err) {
    console.log('LOCAL DB: Could not connect');
  }
};

export const stop = (): void => {
  console.log('\n\nLOCAL DB: STOP');

  kill(localDb.pid);
};
