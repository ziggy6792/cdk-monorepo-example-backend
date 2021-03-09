/* eslint-disable new-cap */
/* eslint-disable max-classes-per-file */
import { DynamoDbWrapper, DynamoStore, GetRequest, ModelConstructor, PutRequest, QueryRequest, UpdateRequest } from '@shiftcoders/dynamo-easy';
import { DynamoDB } from 'aws-sdk';
import getEnvConfig from 'src/config/get-env-config';
import Creatable from 'src/domain/models/abstract/creatable';
import _ from 'lodash';
import dynamoDB from 'src/utils/dynamo-db';

class DynamoService<T extends Creatable> {
    private myModelClazz: ModelConstructor<T>;

    private readonly myDynamoDBWrapper: DynamoDbWrapper;

    readonly store: DynamoStore<T>;

    constructor(modelClazz: ModelConstructor<T>) {
        this.store = new DynamoStore<T>(modelClazz, dynamoDB);

        this.myDynamoDBWrapper = new DynamoDbWrapper(dynamoDB);
        this.myModelClazz = modelClazz;
    }

    put(item: T): PutRequest<T> {
        console.log('RUNNING PUT');
        item.setModifiedAt();
        return this.store.put(item);
    }

    update(partitionKey: any, sortKey?: any): UpdateRequest<T> {
        return this.store.update(partitionKey, sortKey).updateAttribute('modifiedAt').set(Creatable.getTimestamp());
    }

    get(partitionKey: any, sortKey?: any): GetRequest<T> {
        const getRequest = new MyGetRequest(this.myDynamoDBWrapper, this.myModelClazz, partitionKey, sortKey);

        return getRequest;
    }

    query(): MyQueryRequest<T> {
        const queryRequest = new MyQueryRequest(this.myDynamoDBWrapper, this.myModelClazz);

        return queryRequest;
    }
}

const mapCreatible = <T extends Creatable>(loadedValues: T, clazzType: any): T => _.merge(new clazzType(), loadedValues);

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
    private myModelClazz: ModelConstructor<T>;

    constructor(wrapper: DynamoDbWrapper, modelClazz: ModelConstructor<T>, partitionKey, sortKey) {
        super(wrapper, modelClazz, partitionKey, sortKey);
        this.myModelClazz = modelClazz;
    }

    async exec(): Promise<T> {
        const loadedValues = await super.exec();

        if (!loadedValues) throw new Error(`Item not found ${JSON.stringify(this.params)}`);
        // console.log('myModelClazz', new (this.myModelClazz as any)());
        return mapCreatible(loadedValues, this.myModelClazz);
    }
}

export default DynamoService;
