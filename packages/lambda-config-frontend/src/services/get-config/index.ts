/* eslint-disable camelcase */
import SSM from 'aws-sdk/clients/ssm';

const getConfig = async (configPath: string): Promise<string> => {
    const ssm = new SSM();
    const param = await ssm.getParameter({ Name: configPath }).promise();

    return param.Parameter.Value;
};

export default getConfig;
