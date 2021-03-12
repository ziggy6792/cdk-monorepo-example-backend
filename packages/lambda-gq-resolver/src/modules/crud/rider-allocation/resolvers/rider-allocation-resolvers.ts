import deafultAuthMiddleware from 'src/middleware/default-auth-middleware';
import RiderAllocation from 'src/domain/models/rider-allocation';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import { CreateRiderAllocationInput, UpdateRiderAllocationInput } from 'src/modules/crud/rider-allocation/inputs';
import { MiddlewareFn } from 'type-graphql';
import { IContext, IdentityType } from 'src/types';
import errorMessage from 'src/config/error-message';
import Competition from 'src/domain/models/competition';
import Event from 'src/domain/models/event';
import _ from 'lodash';
import createAuthMiddleware from 'src/middleware/create-auth-middleware';
import { AuthCheck } from 'src/middleware/auth-check/types';
import { BATCH_WRITE_MAX_REQUEST_ITEM_COUNT } from '@shiftcoders/dynamo-easy';

const isUserAllowedToCreateOne: AuthCheck = async ({ args, context: { identity } }) => {
    if (identity.type !== IdentityType.USER) {
        throw new Error(errorMessage.auth.authTypeNotUser);
    }
    const input = args.input as CreateRiderAllocationInput;

    if (identity.user?.username === input.userId) {
        return true;
    }

    throw new Error(errorMessage.auth.notAuthenticated);
};

const isUserAllowedToUpdateMany: AuthCheck = async ({ args, context: { identity } }) => {
    console.log('running isUserAllowedToUpdateMany');
    if (identity.type !== IdentityType.USER) {
        throw new Error(errorMessage.auth.authTypeNotUser);
    }

    const riderAllocations = args.input as UpdateRiderAllocationInput[];

    const competitionIds = _.uniqWith(
        riderAllocations.map((input) => ({ id: input.allocatableId })),
        _.isEqual
    );

    // Get rider allocation competitions

    const competitions = _.flatten(
        await Promise.all(Competition.store.batchGetChunks(_.chunk(competitionIds, BATCH_WRITE_MAX_REQUEST_ITEM_COUNT)).map((req) => req.exec()))
    );

    const eventIds = _.uniqWith(
        competitions.map((competition) => ({ id: competition.eventId })),
        _.isEqual
    );

    // Get competition events
    const events = _.flatten(await Promise.all(Event.store.batchGetChunks(_.chunk(eventIds, BATCH_WRITE_MAX_REQUEST_ITEM_COUNT)).map((req) => req.exec())));

    // Check that user is admin of those events
    events.forEach((event) => {
        if (event.adminUserId !== identity.user?.username) {
            throw new Error(errorMessage.auth.notCompetitionAdmin);
        }
    });

    return true;
};

const addDefaultUserId: MiddlewareFn<IContext> = async ({ args, context: { identity } }, next) => {
    const input = args.input as CreateRiderAllocationInput;
    input.userId = input.userId || identity.user?.username;
    if (!input.userId) {
        throw new Error(errorMessage.auth.noUserId);
    }
    return next();
};

const crudResolvers = buildCrudResolvers('RiderAllocation', RiderAllocation, {
    idFields: ['allocatableId', 'userId'],
    crudProps: {
        create: {
            inputType: CreateRiderAllocationInput,
            resolverProps: {
                one: { middleware: [addDefaultUserId, createAuthMiddleware([isUserAllowedToCreateOne])] },
                many: { middleware: [deafultAuthMiddleware] },
            },
        },
        update: {
            inputType: UpdateRiderAllocationInput,
            resolverProps: { many: { middleware: [createAuthMiddleware([isUserAllowedToUpdateMany])] } },
        },
    },
});

export default [...crudResolvers];
