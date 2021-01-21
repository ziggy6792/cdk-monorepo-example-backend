/* eslint-disable import/prefer-default-export */
import 'source-map-support/register';
import AWS from 'aws-sdk';
import jsonBeautify from 'json-beautify';
import getConfig from './services/get-config';

const s3 = new AWS.S3();
// import example from './example';

export interface ISsmParamEvent {
    version: string;
    id: string;
    ['detail-type']: string;
    source: string;
    account: string;
    time: string;
    region: string;
    resources?: string[] | null;
    detail: IDetail;
}
export interface IDetail {
    name: string;
    type: string;
    operation: string;
}

const generateResponse = (json: any = { success: true }, statusCode = 200) => ({
    statusCode,
    body: JSON.stringify(json),
});

export const handler = async (event: ISsmParamEvent): Promise<any> => {
    AWS.config.update({ region: process.env.AWS_REGION || 'ap-southeast-1' });

    const { SSM_FRONTEND_CONFIG: ssmFrontendConfigPath, SSM_FRONTEND_S3BUCKET: ssmFrontendS3BucketPath } = process.env;

    console.log('running config lambda');
    console.log(JSON.stringify(event));

    console.log(event.detail);
    console.log({
        name: ssmFrontendConfigPath,
        type: 'String',
        operation: 'Update',
    });

    if (event.detail.name !== ssmFrontendConfigPath) {
        console.log(`I don't care about ${ssmFrontendConfigPath}`);
        return generateResponse({
            success: true,
            message: `I don't care about ${ssmFrontendConfigPath}`,
        });
    }

    const frontendConfig = await getConfig(ssmFrontendConfigPath);
    const s3BucketName = await getConfig(ssmFrontendS3BucketPath);

    console.log('frontendConfig');
    console.log(frontendConfig);

    console.log('s3Bucket');
    console.log(s3BucketName);

    const jsonEnvConfig = jsonBeautify(JSON.parse(frontendConfig), null, 2, 100);

    const params = {
        Bucket: s3BucketName,
        Key: 'config/env.js', // File name you want to save as in S3
        Body: `window.env = ${jsonEnvConfig}`,
    };

    try {
        await s3.upload(params).promise();
    } catch (err) {
        console.log('ERROR', err);
    }

    return generateResponse();
};
