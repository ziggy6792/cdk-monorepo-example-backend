/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable max-len */
/* eslint-disable no-var */
/* eslint-disable class-methods-use-this */
// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */
// import { APIGatewayProxyCallback, APIGatewayProxyEvent, Context as LambdaContext } from 'aws-lambda';

import 'reflect-metadata';

import { IContext, ICognitoIdentity, IdentityType, IIamIdentity, IIdentity } from 'src/types';
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

const seedSlotPostitionDataLoader = new DataLoader(
    async (keys: string[]) =>
        // const allSeedSlots = _.flatten(
        //     await Promise.all(
        //         SeedSlot.store
        //             .batchGetChunks(
        //                 _.chunk(
        //                     keys.map((key) => ({ id: key })),
        //                     BATCH_WRITE_MAX_REQUEST_ITEM_COUNT
        //                 )
        //             )
        //             .map((req) => req.exec())
        //     )
        // );

        // // Get rider allocations
        // const riderAllocationsLookup: { [key in string]: RiderAllocation } = {};

        // const getFns = allSeedSlots.map((seedSlot) => async () => {
        //     riderAllocationsLookup[seedSlot.id] = await seedSlot.getRiderAllocation();
        // });
        // // const start = new Date().getTime();
        // await Promise.all(getFns.map((fn) => fn()));
        // // const end = new Date().getTime();
        // // console.log(`getting rider allocations ${allSeedSlots[0].heatId} took `, end - start);

        // const groupedSeedSlots = _.groupBy(allSeedSlots, (seedSlot) => seedSlot.heatId);

        // const positionMap: { [key: string]: number } = {};

        // Object.keys(groupedSeedSlots).forEach((headId) => {
        //     const seedSlots = groupedSeedSlots[headId] as SeedSlot[];
        //     const orderedSeeds = _.sortBy(seedSlots, (seed) => +seed.seed, 'asc');
        //     orderedSeeds.forEach((seedSlot, i) => {
        //         positionMap[seedSlot.id] = riderAllocationsLookup[seedSlot.id] && riderAllocationsLookup[seedSlot.id].getBestScore() > -1 ? i + 1 : null;
        //     });
        // });

        // return keys.map((key: string) => positionMap[key]);
        keys.map((key: string) => 1),
    { cache: false }
    // Cache made the rider allocations not update correctly
);

export const contextInitialState: IContext = { req: null, identity: null, dataLoaders: { seedSlotPosition: seedSlotPostitionDataLoader } };

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
