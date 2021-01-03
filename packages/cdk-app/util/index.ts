/* eslint-disable import/prefer-default-export */
import * as conf from '../conf';

const ssmSep = '/';
const conSep = '-';

export const getConstructId = (constructId: string): string => {
  return `${conf.PROJECT_NAME}${conSep}${constructId}`;
};

export const getSsmParamId = (paramPath: string, stage?: string): string => {
  const param = ['', conf.PROJECT_NAME, stage, paramPath];
  return param.join(ssmSep);
};
