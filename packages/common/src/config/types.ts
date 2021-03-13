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
    indexName?: string;
    partitionKey: IAttribute;
    sortKey: IAttribute;
}

export interface ITableSchemaConfig {
    tableName?: string;
    partitionKey?: IAttribute;
    sortKey?: IAttribute;
    indexes?: { [key in string]: IGlobalSecondaryIndex };
}

export interface ITableSchemaBase {
    tableName: string;
    partitionKey: IAttribute;
    sortKey?: IAttribute;
}

export interface ITableSchema extends ITableSchemaBase {
    indexes?: { [key in string]: IGlobalSecondaryIndex };
}

export interface IDbSchemaConfig {
    [key: string]: ITableSchemaConfig;
}
