import { DynamoStore as EasyDynamoStore, GetRequest, ModelConstructor, PutRequest, UpdateRequest } from '@shiftcoders/dynamo-easy';
import { DynamoDB } from 'aws-sdk';
import getEnvConfig from 'src/config/get-env-config';
import Creatable from 'src/domain/models/abstract/creatable';
import _ from 'lodash';

const { awsConfig } = getEnvConfig();

class DynamoStore<T extends Creatable> extends EasyDynamoStore<T> {
    private myModelClazz: ModelConstructor<T>;

    constructor(modelClazz: ModelConstructor<T>) {
        super(modelClazz, new DynamoDB(awsConfig));
        this.myModelClazz = modelClazz;
    }

    put(item: T): PutRequest<T> {
        console.log('RUNNING PUT');
        item.setModifiedAt();
        return super.put(item);
    }

    update(partitionKey: any, sortKey?: any): UpdateRequest<T> {
        return super.update(partitionKey, sortKey).updateAttribute('modifiedAt').set(Creatable.getTimestamp());
    }

    loadOne(partitionKey: any, sortKey?: any): GetRequest<T> {
        const getRequest = this.get(partitionKey, sortKey);

        getRequest.exec = async (): Promise<T> => {
            const loadedValues = await this.get(partitionKey, sortKey).exec();
            if (!loadedValues) {
                return null;
            }
            // console.log('myModelClazz', new (this.myModelClazz as any)());
            return _.merge(new (this.myModelClazz as any)(), loadedValues);
        };

        // const loadedValues = await getRequest.exec();
        // if (!loadedValues) throw new Error(`Item not found ${JSON.stringify(getRequest.params)}`);
        // // console.log('myModelClazz', new (this.myModelClazz as any)());
        return getRequest;
    }
}

export default DynamoStore;
