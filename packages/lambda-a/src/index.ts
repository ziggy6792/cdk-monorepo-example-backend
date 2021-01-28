/* eslint-disable import/prefer-default-export */
import 'source-map-support/register';
import { commonFunctionExample } from '@simonverhoeven/common-lambda-lib/dist/utils';
// import example from './example';
import absoluteImport from '@example/example';
import aliasImport from 'src/example/example';
import relativeImport from './example/example';

export const handler = async (event: any): Promise<any> => {
    absoluteImport();
    aliasImport();
    relativeImport();
    console.log('foo bar');
    return {
        statusCode: 200,
        body: JSON.stringify({
            success: commonFunctionExample(),
        }),
    };
};
