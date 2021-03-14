/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable max-len */
/* eslint-disable no-var */
/* eslint-disable class-methods-use-this */
// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */
// import { APIGatewayProxyCallback, APIGatewayProxyEvent, Context as LambdaContext } from 'aws-lambda';

import 'reflect-metadata';

import { IContext, ICognitoIdentity, IdentityType, IIamIdentity, IIdentity, RiderAllocationKey, RiderAllocationPosition } from 'src/types';
import DataLoader from 'dataloader';
import _ from 'lodash';
import RiderAllocation from 'src/domain/models/rider-allocation';
import { BATCH_WRITE_MAX_REQUEST_ITEM_COUNT } from '@shiftcoders/dynamo-easy';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getIdentityType = (eventIdentity: any): IdentityType => {
    if (eventIdentity?.username) {
        return IdentityType.USER;
    }
    if (eventIdentity?.userArn) {
        if (eventIdentity.cognitoAuthenticationType === 'unauthenticated') {
            return IdentityType.ROLE_UNAUTH;
        }
        return IdentityType.ROLE;
    }
    return IdentityType.NONE;
};

const cacheKeyFn = ({ allocatableId, userId }) => `${allocatableId}-${userId}`;

const riderAllocationPostitionDataLoader = new DataLoader(
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

export const contextInitialState: IContext = { req: null, identity: null, dataLoaders: { riderAlocationPosition: riderAllocationPostitionDataLoader } };

const context = async (recieved: any): Promise<IContext> => {
    const { req } = recieved;

    const exentHeader = req.headers['x-apigateway-event'];

    const event = exentHeader ? JSON.parse(decodeURIComponent(exentHeader)) : null;

    const identityType = getIdentityType(event?.requestContext?.identity);

    let identity: IIdentity;

    switch (identityType) {
        case IdentityType.USER:
            identity = { type: identityType, user: event.requestContext.identity as ICognitoIdentity };
            break;
        case IdentityType.ROLE:
            identity = { type: identityType, role: event.requestContext.identity as IIamIdentity };
            break;
        case IdentityType.ROLE_UNAUTH:
            identity = { type: identityType, role: event.requestContext.identity as IIamIdentity };
            break;
        default:
            identity = { type: identityType };
            break;
    }

    return { ...contextInitialState, req, identity };
};

export default context;
