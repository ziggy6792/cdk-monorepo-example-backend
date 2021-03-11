/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
/* eslint-disable new-cap */
/* eslint-disable max-classes-per-file */
import { DynamoDbWrapper, BatchWriteRequest as EasyBatchWriteRequest } from '@shiftcoders/dynamo-easy';
import Creatable from 'src/domain/models/abstract/creatable';
import Competition from 'src/domain/models/competition';
import dynamoDB from 'src/utils/dynamo-db';

class BatchWriteRequest extends EasyBatchWriteRequest {
    private readonly myDynamoDBWrapper: DynamoDbWrapper;

    constructor() {
        super(dynamoDB);
        this.myDynamoDBWrapper = new DynamoDbWrapper(dynamoDB);
    }

    putChunks<T extends Creatable>(batchChunks: T[][]): BatchWriteRequest[] {
        batchChunks.forEach((chunk) => {
            chunk.forEach((item) => {
                item.setModifiedAt();
            });
        });

        const fns = batchChunks.map((batchChunk) => {
            const request = new BatchWriteRequest();
            batchChunk.forEach((item) => {
                request.put(item.constructor as any, [item as any]);
            });
            return request;
        });

        return fns;
    }

    deleteChunks<T extends Creatable>(batchChunks: T[][]): BatchWriteRequest[] {
        const fns = batchChunks.map((batchChunk) => {
            const request = new BatchWriteRequest();
            batchChunk.forEach((item) => {
                request.delete(item.constructor as any, [item as any]);
            });
            return request;
        });

        return fns;
    }
}

export default BatchWriteRequest;
