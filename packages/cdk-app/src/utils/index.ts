import { PROJECT_NAME } from '@simonverhoeven/global-config';

const ssmSep = '/';
const conSep = '-';
const tableSep = '-';

export const getConstructId = (constructId: string, stage?: string): string => {
    const contItems = [PROJECT_NAME, constructId, stage].filter((v) => v != null);

    return contItems.join(conSep);
};

export const getConstructName = (constructId: string, stage?: string): string => getConstructId(constructId, stage);

export const getConstructDescription = (constructId: string, stage?: string): string => getConstructId(constructId, stage);

export const getSsmParamId = (paramPath: string, stage?: string): string => {
    const pathItems = ['', PROJECT_NAME, stage, paramPath].filter((v) => v != null);

    return pathItems.join(ssmSep);
};

// export const getTableName = (tableName: string, stage?: string): string => {
//     const contItems = [PROJECT_NAME, stage, tableName].filter((v) => v != null);

//     return contItems.join(tableSep);
// };
