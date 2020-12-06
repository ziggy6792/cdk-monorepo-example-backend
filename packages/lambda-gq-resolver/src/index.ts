/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable max-len */
/* eslint-disable no-var */
/* eslint-disable class-methods-use-this */
// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */

import 'reflect-metadata';
import AWS from 'aws-sdk';
import { ApolloServer } from 'apollo-server-lambda';
import { APIGatewayProxyCallback, APIGatewayProxyEvent, Context as LambdaContext } from 'aws-lambda';
import {} from 'type-graphql';
import { commonFunctionExample } from '@danielblignaut/common-lambda-lib/dist/utils';
// import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import createSchema from './graph-ql/create-schema';
import { REGION, TABLE_NAME_PREFIX } from './config/index';
import { initMapper, initTables } from './util/mapper';
import { MyContext } from './types/MyContext';

const jwk = {
  keys: [
    {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'eamLd81UUXdoC3snYyqnjvR11JYEq3uBKdtfaGRhmD0=',
      kty: 'RSA',
      n:
        'kQ5jgUIq9Je0nzFDwmEGOIWhLWTMqiU1wbziSxqOURqLrFEoCGPDRSk8t4m7zlAT4zcRN9VubuuNKqVeD0Y2a_DcLCa-xiF2pfyBrsHoZE9cb3hWBn3In9WYU4xrZiBEWuBfEGKUapdeI-vwdnLqLbKra4Ssotp4t450d6tO2w_AzqozzUXRZ96KPcUpMR9iqxb-nGY74jXDA80o-2AzT01AR6eo_IzrXpU_uQbKuNSv4a72iF_5Ck-x5m2Y8TcV-HYwlBUzx3Tl9gT-yKgwl88eEwa3o2u2i4pL2PAibcgiL-m39hkBFp_j7_yNIgnQeyS7oIb2csdXPd8-z4pGlQ',
      use: 'sig',
    },
    {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'JwH8cEb5sV/UHUayUKFMdTRAAlDv2QyeRQb19b/4m1s=',
      kty: 'RSA',
      n:
        's_WtZzCNSo1xsWgWd8fR-sSvqZ5soA3F7_JShJN8qJ0ipBK7mCoApI7LUF6i5p1lMkISjlX6YVCT2vDjqSagyq2tpiDqeaoqpCpW_mqMcZoWyvEWjpXYnX4Huvb10Sz-rV9Xw4eRXTqvGYOAlLafwjNXlX3uHHFFgpHgGuB_WNvqGymvZLjgIM4SfTk_mNTIk5LtVTD-Q90xb_JPUvGLGQFvd_mevYwL-TgXQYKeon4vGLSC9xU4z_iGqE98PSZr-etHeCTHTykDFu7w_ta3EbomNNL53w0wXQs-E9reNMjaElSbKPfr85_Iiu-A7eeohK58LEuQBcY7BDIhB57rsQ',
      use: 'sig',
    },
  ],
};

export const createServerParams = () => ({
  schema: createSchema(),
  introspection: true,
  playground: true,
  context: async (recieved: { event: any }): Promise<MyContext> => {
    // console.log('recieved bla', JSON.stringify(recieved));
    const { event } = recieved;
    const { headers } = event;
    const { authorization: token } = headers;
    console.log('recieved jwt', token);

    let pem: string;
    try {
      pem = jwkToPem((jwk.keys[1] as unknown) as jwkToPem.JWK);

      const result = await jwt.verify(token, pem, { algorithms: ['RS256'] });

      console.log('result', result);
      event.identity = result;
    } catch (err) {
      console.log('ERROR', err);
    }

    return { event };
  },
});

const server = new ApolloServer(createServerParams());

const init = (): void => {
  AWS.config.update({ region: REGION });
  commonFunctionExample();
  initMapper(REGION, TABLE_NAME_PREFIX);
};

init();

export const handler = server.createHandler();

// export const handler = async (event: APIGatewayProxyEvent, context: LambdaContext, callback: APIGatewayProxyCallback) => {
//   // return apolloServerHandler(event, context, callback);
//   console.log('event', JSON.stringify(event));
//   console.log('*******');
//   console.log('context', JSON.stringify(context));

//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       success: commonFunctionExample(),
//     }),
//   };
// };
