export enum IAttributeType {
    BINARY = 'B',
    NUMBER = 'N',
    STRING = 'S',
}

export interface IAttribute {
    type: IAttributeType;
    name: string;
}

export interface IGlobalSecondaryIndex {
    indexName: string;
    partitionKey: IAttribute;
    sortKey: IAttribute;
}

export interface ITableSchemaConfig {
    tableName?: string;
    partitionKey?: IAttribute;
    sortKey?: IAttribute;
    globalSecondaryIndexes?: IGlobalSecondaryIndex[];
}

export interface ITableSchema {
    tableName: string;
    partitionKey: IAttribute;
    sortKey?: IAttribute;
    globalSecondaryIndexes?: IGlobalSecondaryIndex[];
}

export interface IDbSchemaConfig {
    [key: string]: ITableSchemaConfig;
}
