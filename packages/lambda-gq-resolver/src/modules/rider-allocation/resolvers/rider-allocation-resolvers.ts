import isAuthRoleMiddleware from 'src/middleware/is-auth-role-middleware';
import { mapper } from 'src/utils/mapper';
import RiderAllocation from 'src/domain/models/rider-allocation';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import { CreateRiderAllocationInput, UpdateRiderAllocationInput } from 'src/modules/rider-allocation/inputs';
import { MiddlewareFn } from 'type-graphql';
import { IContext, IdentityType } from 'src/types';
import errorMessage from 'src/config/error-message';
import Competition from 'src/domain/models/competition';
import Event from 'src/domain/models/event';
import { toArray } from 'src/utils/async-iterator';
import _ from 'lodash';
import createAuthMiddleware from 'src/middleware/create-auth-middleware';
import { AuthCheck } from 'src/middleware/auth-check/types';
import isAuthRole from 'src/middleware/auth-check/is-auth-role';

const isUserAllowedToCreateOne: AuthCheck = async ({ args, context: { identity } }) => {
    if (identity.type !== IdentityType.USER) {
        throw new Error(errorMessage.authTypeNotUser);
    }
    const input = args.input as CreateRiderAllocationInput;

    if (identity.user?.username === input.userId) {
        return true;
    }

    throw new Error(errorMessage.notAuthenticated);
};

const isUserAllowedToUpdateMany: AuthCheck = async ({ args, context: { identity } }) => {
    if (identity.type !== IdentityType.USER) {
        throw new Error(errorMessage.authTypeNotUser);
    }

    const riderAllocations = args.input as UpdateRiderAllocationInput[];

    const competitionIds = _.uniqWith(
        riderAllocations.map((input) => Object.assign(new Competition(), { id: input.allocatableId })),
        _.isEqual
    );

    // Get rider allocation competitions
    const competitions = await toArray(mapper.batchGet(competitionIds));

    const eventIds = _.uniqWith(
        competitions.map((competition) => Object.assign(new Event(), { id: competition.eventId })),
        _.isEqual
    );

    // Get competition events
    const events = await toArray(mapper.batchGet(eventIds));

    // Check that user is admin of those events
    events.forEach((event) => {
        if (event.adminUserId !== identity.user?.username) {
            throw new Error(errorMessage.notAuthenticated);
        }
    });

    return true;
};

const addDefaultUserId: MiddlewareFn<IContext> = async ({ args, context: { identity } }, next) => {
    args.input.userId = args.input.userId || identity.user?.username;
    if (!args.input.userId) {
        throw new Error(errorMessage.noUserId);
    }
    return next();
};

const crudResolvers = buildCrudResolvers('RiderAllocation', RiderAllocation, {
    idFields: ['allocatableId', 'userId'],
    crudProps: {
        create: {
            inputType: CreateRiderAllocationInput,
            resolverProps: {
                one: { middleware: [addDefaultUserId, createAuthMiddleware([isAuthRole, isUserAllowedToCreateOne])] },
                many: { middleware: [isAuthRoleMiddleware] },
            },
        },
        update: {
            inputType: UpdateRiderAllocationInput,
            resolverProps: { many: { middleware: [createAuthMiddleware([isAuthRole, isUserAllowedToUpdateMany])] } },
        },
    },
});

export default [...crudResolvers];
