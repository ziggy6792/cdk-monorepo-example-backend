export enum IAttributeType {
    BINARY = 'B',
    NUMBER = 'N',
    STRING = 'S',
}

export interface IAttribute {
    tpye: IAttributeType;
    name: string;
}

export interface IGlobalSecondaryIndex {
    indexName: string;
    partitionKey: IAttribute;
    sortKey: IAttribute;
}

export interface TableSchema {
    tableName?: string;
    partitionKey?: IAttribute;
    sortKey?: IAttribute;
    globalSecondaryIndexes?: IGlobalSecondaryIndex[];
}

export interface IDbSchema {
    [key: string]: TableSchema;
}
