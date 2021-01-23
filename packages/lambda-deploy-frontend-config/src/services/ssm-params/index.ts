/* eslint-disable camelcase */
import SSM, { ParameterList } from 'aws-sdk/clients/ssm';

export const getConfig = async (configPath: string): Promise<string> => {
    const ssm = new SSM();
    const param = await ssm.getParameter({ Name: configPath }).promise();

    return param.Parameter.Value;
};

export const getConfigByPath = async (configPath: string): Promise<any> => {
    const ssm = new SSM();
    const param = await ssm.getParametersByPath({ Path: configPath }).promise();

    const ret = {};

    param.Parameters.forEach((param) => {
        ret[param.Name.split('/').pop()] = param.Value;
    });

    return ret;
};
