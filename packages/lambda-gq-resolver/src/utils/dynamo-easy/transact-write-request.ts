/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
/* eslint-disable new-cap */
/* eslint-disable max-classes-per-file */
import { DynamoDbWrapper, TransactWriteRequest as EasyTransactWriteRequest } from '@shiftcoders/dynamo-easy';
import dynamoDB from 'src/utils/dynamo-db';

class TransactWriteRequest extends EasyTransactWriteRequest {
    private readonly myDynamoDBWrapper: DynamoDbWrapper;

    constructor() {
        super(dynamoDB);
        this.myDynamoDBWrapper = new DynamoDbWrapper(dynamoDB);
    }
}

export default TransactWriteRequest;
