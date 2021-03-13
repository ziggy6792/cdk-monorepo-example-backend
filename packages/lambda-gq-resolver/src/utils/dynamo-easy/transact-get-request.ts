/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
/* eslint-disable new-cap */
/* eslint-disable max-classes-per-file */
import { DynamoDbWrapper, TransactGetRequest as EasyTransactGetRequest } from '@shiftcoders/dynamo-easy';
import dynamoDB from 'src/utils/dynamo-db';

class TransactGetRequest extends EasyTransactGetRequest {
    private readonly myDynamoDBWrapper: DynamoDbWrapper;

    constructor() {
        super(dynamoDB);
        this.myDynamoDBWrapper = new DynamoDbWrapper(dynamoDB);
    }
}

export default TransactGetRequest;
