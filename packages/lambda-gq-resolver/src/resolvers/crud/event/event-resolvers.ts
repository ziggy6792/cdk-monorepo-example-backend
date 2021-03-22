import Event from 'src/domain/models/event';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import { CreateEventInput, UpdateEventInput } from 'src/resolvers/crud/event/inputs';

import errorMessage from 'src/config/error-message';
import { MiddlewareFn } from 'type-graphql';
import { IContext, IdentityType } from 'src/types';
import { AuthCheck } from 'src/middleware/auth-check/types';
import createAuthMiddleware from 'src/middleware/create-auth-middleware';
import isAuthUser from 'src/middleware/auth-check/is-auth-user';

const addDefaultUserId: MiddlewareFn<IContext> = async ({ args, context: { identity } }, next) => {
    const input = args.input as CreateEventInput;
    input.adminUserId = input.adminUserId || identity.user?.username;
    if (!input.adminUserId) {
        throw new Error(errorMessage.auth.noUserId);
    }
    return next();
};

const isAllowedToEditEvent: AuthCheck = async ({ args, context: { identity } }) => {
    if (identity.type !== IdentityType.USER) {
        throw new Error(errorMessage.auth.authTypeNotUser);
    }
    const input = args.input as UpdateEventInput;

    const event = await Event.store.get(input.id).exec();

    if (event.adminUserId === identity.user?.username) {
        return true;
    }

    throw new Error(errorMessage.auth.notEventAdmin);
};

const CrudResolvers = buildCrudResolvers('Event', Event, {
    crudProps: {
        create: { inputType: CreateEventInput, resolverProps: { one: { middleware: [addDefaultUserId, createAuthMiddleware([isAuthUser])] } } },
        update: { inputType: UpdateEventInput, resolverProps: { one: { middleware: [createAuthMiddleware([isAllowedToEditEvent])] } } },
        get: { resolverProps: { one: true, many: true } },
        delete: { resolverProps: { one: { middleware: [createAuthMiddleware([isAllowedToEditEvent])] } } },
    },
});

export default [...CrudResolvers];
