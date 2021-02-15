/* eslint-disable import/no-extraneous-dependencies */
import * as child from 'child_process';
import kill from 'tree-kill';
import util from 'util';
// import TEST_DB_CONFIG from './config';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import axios from 'axios';
import _ from 'lodash';
import LOCAL_STACK_CONFIG from './config';

// AWS.config.update(TEST_DB_CONFIG);

// const startLocalServer = async (): Promise<void> => {
//     console.log('LOCAL TEST ENV: START');

//     spawnAndLog('yarn', ['start:localstack'], 'localstack');

//     try {
//         await poll({
//             taskFn: checkConnection,
//             interval: 1000,
//             retries: 60,
//         });
//     } catch (err) {
//         console.log('LOCAL TEST ENV: Could not connect');
//         throw new Error('LOCAL TEST ENV: Could not connect');
//     }
// };

// const exec = util.promisify(child.exec);
// const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// let localDb: child.ChildProcessWithoutNullStreams;

interface IArgs {
    _: string[];
    isSkipBootstrap: boolean;
    isStartDynamodbAdmin: boolean;
    watch: boolean;
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

// const spawnAndLog = (command: string, args: string[], logPrefix = '', waitUntilOutput: string = null): Promise<void> => {

interface ISpawnAndWaitProps {
    logPrefix?: string;
    waitUntilOutputIncludes?: string;
}

const spawnAndWait = (
    command: string,
    args: string[],
    { logPrefix, waitUntilOutputIncludes }: ISpawnAndWaitProps = { logPrefix: null, waitUntilOutputIncludes: null }
): Promise<void> => {
    const outputFound = (data: any) => waitUntilOutputIncludes && data.toString().includes(waitUntilOutputIncludes);

    return new Promise((resolve, reject) => {
        const spawn = child.spawn(command, args);

        spawn.stdout.on('data', (data) => {
            console.log(`${logPrefix}: ${data.toString()}`);
            if (outputFound(data)) {
                resolve();
            }
        });

        spawn.stderr.on('data', (data) => {
            console.log(`${logPrefix}: ${data.toString()}`);
            if (outputFound(data)) {
                resolve();
            }
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
        // await startLocalServer();

        await spawnAndWait('yarn', ['start:localstack'], { logPrefix: 'localstack', waitUntilOutputIncludes: 'Ready.' });
        console.log('READYY!!!!!');
    }

    if (args.isStartDynamodbAdmin) {
        await spawnAndWait('yarn', ['start:dynamodb:admin'], {
            logPrefix: 'start:dynamodb:admin',
            waitUntilOutputIncludes: 'listening on http://localhost:8001',
        });
    }

    if (!args.isSkipBootstrap) {
        await spawnAndWait('yarn', ['cdk:app:local:test:env:bootstrap'], { logPrefix: 'local:test:env:bootstrap' });
    }

    if (args.watch) {
        await spawnAndWait('nodemon', [], { logPrefix: 'deploy:local:test:stack' });
    } else {
        await spawnAndWait('yarn', ['cdk:app:deploy:local:test:stack'], { logPrefix: 'deploy:local:test:stack' });
    }
};
