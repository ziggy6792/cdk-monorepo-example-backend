/* eslint-disable import/prefer-default-export */
import 'source-map-support/register';
// import example from './example';

export const handler = async (event: any): Promise<any> => {
    console.log('running config lambda');
    console.log(JSON.stringify(event));
    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
        }),
    };
};
