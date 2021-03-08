/* eslint-disable new-cap */
/* eslint-disable max-classes-per-file */
import {
    BatchGetSingleTableRequest,
    DynamoDbWrapper,
    DynamoStore as EasyDynamoStore,
    GetRequest,
    ModelConstructor,
    PutRequest,
    QueryRequest,
    UpdateRequest,
    update,
    DeleteRequest,
} from '@shiftcoders/dynamo-easy';
import { DynamoDB } from 'aws-sdk';
import getEnvConfig from 'src/config/get-env-config';
import Creatable from 'src/domain/models/abstract/creatable';
import _ from 'lodash';
// import { BatchWriteSingleTableRequest } from '@shiftcoders/dynamo-easy/dist/_types/dynamo/request/batchwritesingletable/batch-write-single-table.request';

const { awsConfig } = getEnvConfig();

class DynamoStore<T extends Creatable> extends EasyDynamoStore<T> {
    private myModelClazz: ModelConstructor<T>;

    private readonly myDynamoDBWrapper: DynamoDbWrapper;

    constructor(modelClazz: ModelConstructor<T>) {
        super(modelClazz, new DynamoDB(awsConfig));
        this.myDynamoDBWrapper = new DynamoDbWrapper(this.dynamoDB);
        this.myModelClazz = modelClazz;
    }

    put(item: T): PutRequest<T> {
        console.log('RUNNING PUT');
        item.setModifiedAt();
        return super.put(item);
    }

    update(partitionKey: any, sortKey?: any): MyUpdateRequest<T> {
        const updateRequest = new MyUpdateRequest(this.myDynamoDBWrapper, this.myModelClazz, partitionKey, sortKey);
        updateRequest.updateAttribute('modifiedAt').set(Creatable.getTimestamp());

        return updateRequest;

        // return super.update(partitionKey, sortKey).updateAttribute('modifiedAt').set(Creatable.getTimestamp());
    }

    get(partitionKey: any, sortKey?: any): GetRequest<T> {
        const getRequest = new MyGetRequest(this.myDynamoDBWrapper, this.myModelClazz, partitionKey, sortKey);

        return getRequest;
    }

    query(): MyQueryRequest<T> {
        const queryRequest = new MyQueryRequest(this.myDynamoDBWrapper, this.myModelClazz);

        return queryRequest;
    }

    batchGet(keys: Array<Partial<T>>): MyBatchGetSingleTableRequest<T> {
        const request = new MyBatchGetSingleTableRequest(this.myDynamoDBWrapper, this.myModelClazz, keys);
        return request;
    }

    myBatchWrite() {
        return super.batchWrite();
    }

    // batchPut(keys: Array<Partial<T>>): BatchWriteSingleTableRequest {
    //     // const request = new MyBatchWriteSingleTableRequest(this.myDynamoDBWrapper, this.myModelClazz);
    //     super.batchWrite()
    //     // return request;
    // }

    getAndDelete(partitionKey: any, sortKey?: any): MyGetAndDeleteRequest<T> {
        const getRequest = new MyGetAndDeleteRequest(this.myDynamoDBWrapper, this.myModelClazz, partitionKey, sortKey);

        return getRequest;
    }
}
const mapCreatible = <T extends Creatable>(loadedValues: T, clazzType: any): T => {
    const creatable: T = new clazzType();
    creatable.mapIn(loadedValues);
    return creatable;
};

class MyQueryRequest<T extends Creatable> extends QueryRequest<T> {
    private myModelClazz: ModelConstructor<T>;

    constructor(wrapper: DynamoDbWrapper, modelClazz: ModelConstructor<T>) {
        super(wrapper, modelClazz);
        this.myModelClazz = modelClazz;
    }

    async execFetchAll(): Promise<T[]> {
        const response = await super.execFetchAll();
        const mappedResponse = response.map((loadedValues) => mapCreatible(loadedValues, this.myModelClazz));
        return mappedResponse;
    }
}

class MyGetRequest<T extends Creatable> extends GetRequest<T> {
    protected myModelClazz: ModelConstructor<T>;

    protected myPartitionKey: any;

    protected mySortKey: any;

    constructor(wrapper: DynamoDbWrapper, modelClazz: ModelConstructor<T>, partitionKey, sortKey) {
        super(wrapper, modelClazz, partitionKey, sortKey);
        this.myModelClazz = modelClazz;
        this.myPartitionKey = partitionKey;
        this.mySortKey = sortKey;
    }

    async exec(): Promise<T> {
        const loadedValues = await super.exec();

        if (!loadedValues) throw new Error(`Item not found ${JSON.stringify(this.params)}`);
        // console.log('myModelClazz', new (this.myModelClazz as any)());
        return mapCreatible(loadedValues, this.myModelClazz);
    }
}

class MyGetAndDeleteRequest<T extends Creatable> extends MyGetRequest<T> {
    async exec(): Promise<T> {
        const loadedValues = await super.exec();
        const deleteRequerst = new DeleteRequest(this.dynamoDBWrapper, this.modelClazz, this.myPartitionKey, this.mySortKey);
        await deleteRequerst.exec();
        return loadedValues;
    }
}

class MyBatchGetSingleTableRequest<T extends Creatable, T2 = T> extends BatchGetSingleTableRequest<T> {
    private myModelClazz: ModelConstructor<T>;

    constructor(dynamoDBWrapper: DynamoDbWrapper, modelClazz: ModelConstructor<T>, keys: Array<Partial<T>>) {
        super(dynamoDBWrapper, modelClazz, keys);
        this.myModelClazz = modelClazz;
    }

    async exec(): Promise<T[]> {
        const response = await super.exec();
        const mappedResponse = response.map((loadedValues) => mapCreatible(loadedValues, this.myModelClazz));
        return mappedResponse;
    }
}

// class MyBatchWriteSingleTableRequest<T extends Creatable, T2 = T> extends BatchWriteSingleTableRequest<T> {
//     private myModelClazz: ModelConstructor<T>;

//     constructor(dynamoDBWrapper: DynamoDbWrapper, modelClazz: ModelConstructor<T>) {
//         super(dynamoDBWrapper, modelClazz);
//         this.myModelClazz = modelClazz;
//     }

//     async exec(): Promise<void> {
//         const response = await super.exec();
//         // const mappedResponse = response.map((loadedValues) => mapCreatible(loadedValues, this.myModelClazz));
//         // return response;
//     }
// }

class MyUpdateRequest<T extends Creatable, T2 extends Creatable | void = void> extends UpdateRequest<T, T2> {
    private myModelClazz: ModelConstructor<T>;

    constructor(wrapper: DynamoDbWrapper, modelClazz: ModelConstructor<T>, partitionKey, sortKey) {
        super(wrapper, modelClazz, partitionKey, sortKey);
        this.myModelClazz = modelClazz;
    }

    async exec(): Promise<T2> {
        const loadedValues = await super.exec();

        if (typeof loadedValues === 'object' && loadedValues !== null) {
            return (mapCreatible((loadedValues as unknown) as T, this.myModelClazz) as unknown) as T2;
        }
        return null;
    }

    values(values: Partial<T>): this {
        const updateOperations = Object.keys(values).map((key) => update(key).set(values[key]));
        return this.operations(...updateOperations);
    }
}

export default DynamoStore;
