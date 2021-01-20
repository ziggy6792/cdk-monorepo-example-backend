/* eslint-disable import/prefer-default-export */
import 'source-map-support/register';
import AWS from 'aws-sdk';
import getConfig from './services/get-config';
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

    const { SSM_FRONTEND_CONFIG: ssmFrontendConfigPath } = process.env;

    console.log('running config lambda');
    console.log(JSON.stringify(event));

    console.log(event.detail);
    console.log({
        name: ssmFrontendConfigPath,
        type: 'String',
        operation: 'Update',
    });

    if (event.detail.name !== ssmFrontendConfigPath) {
        return generateResponse({
            success: true,
            message: `I don't care about ${ssmFrontendConfigPath}`,
        });
    }

    const frontendConfig = await getConfig(ssmFrontendConfigPath);

    console.log('frontendConfig');
    console.log(frontendConfig);

    return generateResponse();
};
