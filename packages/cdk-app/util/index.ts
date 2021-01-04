/* eslint-disable import/prefer-default-export */
import * as conf from '../conf';

const ssmSep = '/';
const conSep = '-';

export const getConstructId = (constructId: string, stage?: string): string => {
  const contItems = [conf.PROJECT_NAME, constructId, stage].filter((v) => v != null);

  return contItems.join(conSep);
};

export const getSsmParamId = (paramPath: string, stage?: string): string => {
  const pathItems = ['', conf.PROJECT_NAME, stage, paramPath].filter((v) => v != null);

  return pathItems.join(ssmSep);
};
