/* eslint-disable import/prefer-default-export */
import 'source-map-support/register';
import { commonFunctionExample } from '@simonverhoeven/common-lambda-lib/dist/utils';

export const handler = async (event: any): Promise<any> => {
    console.log('bla');
    return {
        statusCode: 200,
        body: JSON.stringify({
            success: commonFunctionExample(),
        }),
    };
};
