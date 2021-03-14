/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable max-len */
/* eslint-disable no-var */
/* eslint-disable class-methods-use-this */
// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */
// import { APIGatewayProxyCallback, APIGatewayProxyEvent, Context as LambdaContext } from 'aws-lambda';

import 'reflect-metadata';

import DataLoader from 'dataloader';
import _ from 'lodash';
import RiderAllocation from 'src/domain/models/rider-allocation';
import { BATCH_WRITE_MAX_REQUEST_ITEM_COUNT } from '@shiftcoders/dynamo-easy';

export interface RiderAllocationKey {
    allocatableId: string;
    userId: string;
}

export interface RiderAllocationPosition {
    position: number | null;
    order: number;
}

const cacheKeyFn = ({ allocatableId, userId }) => `${allocatableId}-${userId}`;

const getRiderAlocationPostitionLoader = (): DataLoader<RiderAllocationKey, RiderAllocationPosition> =>
    new DataLoader(
        async (keys: RiderAllocationKey[]) => {
            const allRiderAllocations = _.flatten(
                await Promise.all(RiderAllocation.store.batchGetChunks(_.chunk(keys, BATCH_WRITE_MAX_REQUEST_ITEM_COUNT)).map((req) => req.exec()))
            );

            const groupedRiderAlocations = _.groupBy(allRiderAllocations, (ra) => ra.allocatableId);

            const positionMap: { [key: string]: RiderAllocationPosition } = {};

            Object.keys(groupedRiderAlocations).forEach((headId) => {
                const heatRAs = groupedRiderAlocations[headId] as RiderAllocation[];

                const orderedRAs = _.orderBy(heatRAs, [(ra) => ra.getBestScore(), (ra) => ra.startSeed], ['desc', 'asc']);
                orderedRAs.forEach((ra, i) => {
                    const raPosition = {
                        position: ra.getBestScore() > -1 ? i + 1 : null,
                        order: i,
                    };

                    positionMap[cacheKeyFn(ra.getKeys())] = raPosition;
                });
            });

            return keys.map((key) => positionMap[cacheKeyFn(key)]);
        },
        { cache: false, cacheKeyFn }
    );

export default getRiderAlocationPostitionLoader;
