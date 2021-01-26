/* eslint-disable camelcase */
import SSM from 'aws-sdk/clients/ssm';

export interface IConfig {
    aws_graphqlEndpoint_authRole: string;
}

const default_config: IConfig = {
    aws_graphqlEndpoint_authRole: '',
};

// eslint-disable-next-line import/no-mutable-exports
export let config: IConfig = default_config;

let isFetched = false;

const fetchConfig = async (configPath: string): Promise<IConfig> => {
    const ssm = new SSM();
    // return {};
    const param = await ssm.getParameter({ Name: configPath }).promise();

    return JSON.parse(param.Parameter.Value) as IConfig;
};

export const loadConfig = async (configPath: string): Promise<void> => {
    if (!configPath) {
        return;
    }
    if (!isFetched) {
        config = await fetchConfig(configPath);
        isFetched = true;
    }
};
