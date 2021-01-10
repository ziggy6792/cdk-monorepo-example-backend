/* eslint-disable import/no-extraneous-dependencies */
import * as child from 'child_process';
import kill from 'tree-kill';
import poll from 'promise-poller';
import util from 'util';

const exec = util.promisify(child.exec);

let localDb: child.ChildProcessWithoutNullStreams;

export const checkConnection = async (): Promise<boolean> => {
  try {
    const { stderr } = await exec('nc -z localhost 8000 ');
    console.log(stderr);
    const isReady = stderr.includes('Connection to localhost port 8000 [tcp/irdmi] succeeded!');
    return isReady;
  } catch (err) {
    console.log('LOCAL DB: connection error');
    console.log(err);
    throw new Error(err);
  }
};

export const start = async (): Promise<void> => {
  console.log('\n\nLOCAL DB: INIT');
  try {
    const isAlredyRunning = await checkConnection();
    if (isAlredyRunning) {
      // Just incase the server is somehow stil running from the last run
      console.log('LOCAL DB: FORCE STOP');
      const { stderr } = await exec('lsof -ti tcp:8000 | xargs kill');
    }
  } catch (err) {
    // Do nothing - must be is it not running
  }

  console.log('LOCAL DB: START');

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
