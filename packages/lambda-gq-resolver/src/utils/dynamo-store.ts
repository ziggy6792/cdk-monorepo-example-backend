import { DynamoStore as EasyDynamoStore, ModelConstructor, PutRequest } from '@shiftcoders/dynamo-easy';
import { DynamoDB } from 'aws-sdk';
import getEnvConfig from 'src/config/get-env-config';
import Creatable from 'src/domain/models/abstract/creatable';

const { awsConfig } = getEnvConfig();

class DynamoStore<T extends Creatable> extends EasyDynamoStore<T> {
    constructor(modelClazz: ModelConstructor<T>) {
        super(modelClazz, new DynamoDB(awsConfig));
    }

    put(item: T): PutRequest<T> {
        console.log('RUNNING PUT');
        item.setModifiedAt();
        return super.put(item);
    }
}

export default DynamoStore;
