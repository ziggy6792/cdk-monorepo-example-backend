/* eslint-disable import/no-extraneous-dependencies */
import * as child from 'child_process';
import kill from 'tree-kill';
import poll from 'promise-poller';
import util from 'util';
import AWS from 'aws-sdk';
// import TEST_DB_CONFIG from './config';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import axios from 'axios';
import _ from 'lodash';
import LOCAL_STACK_CONFIG from './config';

// AWS.config.update(TEST_DB_CONFIG);

const exec = util.promisify(child.exec);

let localDb: child.ChildProcessWithoutNullStreams;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

interface IArgs {
    _: string[];
    isSkipBootstrap: boolean;
}

export const checkConnection = async (): Promise<boolean> => {
    const response = await axios.get(LOCAL_STACK_CONFIG.checkHealthEndpoint, { timeout: 1000 });
    const ready = _.isEqual(response.data, LOCAL_STACK_CONFIG.readyResponse);
    if (!ready) {
        // console.log('expected', JSON.stringify(LOCAL_STACK_CONFIG.readyResponse));
        // console.log('');
        // console.log('actual', JSON.stringify(response.data));

        throw new Error('Not ready');
    }
    return ready;
};

const spawnAndLog = (command: string, args: string[], logPrefix = ''): Promise<void> => {
    console.log('LOCAL TEST ENV: bootstrapping local test stack');

    return new Promise((resolve, reject) => {
        const spawn = child.spawn(command, args);

        spawn.stdout.on('data', (data) => {
            console.log(`${logPrefix}: ${data.toString()}`);
        });

        spawn.stderr.on('data', (data) => {
            console.log(`${logPrefix}: ${data.toString()}`);
        });

        spawn.on('exit', (code) => {
            console.log(`${logPrefix}: child process exited with code ${code?.toString()}`);
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`${logPrefix}: child process exited with code ${code?.toString()}`));
            }
        });
    });
};

const startLocalServer = async (): Promise<void> => {
    console.log('LOCAL TEST ENV: START');

    spawnAndLog('yarn', ['start:localstack'], 'localstack:');

    try {
        await poll({
            taskFn: checkConnection,
            interval: 1000,
            retries: 60,
        });
    } catch (err) {
        console.log('LOCAL TEST ENV: Could not connect');
        throw new Error('LOCAL TEST ENV: Could not connect');
    }
};

export const start = async (): Promise<void> => {
    console.log('\n\nLOCAL TEST ENV: INIT');

    const args = (yargs(hideBin(process.argv)).argv as unknown) as IArgs;

    console.log('Recieved Args', args);

    // do app specific cleaning before exiting
    process.on('SIGINT', () => {
        console.log('Got SIGINT.  Press Control-C to exit.');
    });

    let isLocalDbRunning = false;

    try {
        isLocalDbRunning = await checkConnection();
    } catch (err) {
        // Do nothing - must be is it not running
    }

    if (!isLocalDbRunning) {
        // Start local TEST ENV
        await startLocalServer();
        console.log('READYY!!!!!');
    }

    if (!args.isSkipBootstrap) {
        await spawnAndLog('yarn', ['cdk:app:local:test:env:bootstrap'], 'local:test:env:bootstrap');
    }

    await spawnAndLog('yarn', ['cdk:app:deploy:local:test:stack'], 'deploy:local:test:stack');
};

export const stop = (): void => {
    console.log('\n\nLOCAL TEST ENV: STOP');

    kill(localDb.pid);
};
