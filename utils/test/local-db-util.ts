/* eslint-disable import/no-extraneous-dependencies */
import * as child from 'child_process';
import kill from 'tree-kill';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

let localDb: child.ChildProcessWithoutNullStreams;

export const start = async (): Promise<void> => {
  console.log('start');

  localDb = child.spawn('yarn', ['start:local:db']);

  localDb.stdout.on('data', function (data) {
    console.log(`stdout: ${data.toString()}`);
  });

  localDb.stderr.on('data', function (data) {
    console.log(`stderr: ${data.toString()}`);
  });

  localDb.on('exit', function (code) {
    console.log(`child process exited with code ${code.toString()}`);
  });

  await delay(3000);
};

export const stop = (): void => {
  console.log('stop');
  kill(localDb.pid);
};
