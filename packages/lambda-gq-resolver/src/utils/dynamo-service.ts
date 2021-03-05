import { DynamoDbWrapper, DynamoStore, GetRequest, ModelConstructor, PutRequest, UpdateRequest } from '@shiftcoders/dynamo-easy';
import { DynamoDB } from 'aws-sdk';
import getEnvConfig from 'src/config/get-env-config';
import Creatable from 'src/domain/models/abstract/creatable';
import _ from 'lodash';

const { awsConfig } = getEnvConfig();

class DynamoService<T extends Creatable> {
    private myModelClazz: ModelConstructor<T>;

    private readonly myDynamoDBWrapper: DynamoDbWrapper;

    readonly store: DynamoStore<T>;

    constructor(modelClazz: ModelConstructor<T>) {
        const dynamoDB = new DynamoDB(awsConfig);
        this.store = new DynamoStore<T>(modelClazz);

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

    loadOne(partitionKey: any, sortKey?: any): GetRequest<T> {
        const getRequest = new GetRequest(this.myDynamoDBWrapper, this.myModelClazz, partitionKey, sortKey);

        // Overwite the exec request to add revieced attributes to new instance of class
        getRequest.exec = async (): Promise<T> => {
            const loadedValues = await this.store.get(partitionKey, sortKey).exec();
            // if (!loadedValues) {
            //     return null;
            // }
            if (!loadedValues) throw new Error(`Item not found ${JSON.stringify(getRequest.params)}`);
            // console.log('myModelClazz', new (this.myModelClazz as any)());
            return _.merge(new (this.myModelClazz as any)(), loadedValues);
        };

        return getRequest;
    }
}

export default DynamoService;
