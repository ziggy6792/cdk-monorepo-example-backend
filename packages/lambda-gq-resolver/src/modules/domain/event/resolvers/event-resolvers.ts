import Event from 'src/domain/models/event';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import { CreateEventInput, UpdateEventInput } from 'src/modules/domain/event/inputs';

import errorMessage from 'src/config/error-message';
import { MiddlewareFn } from 'type-graphql';
import { IContext, IdentityType } from 'src/types';
import { mapper } from 'src/utils/mapper';
import { AuthCheck } from 'src/middleware/auth-check/types';
import createAuthMiddleware from 'src/middleware/create-auth-middleware';
import isAuthRole from 'src/middleware/auth-check/is-auth-role';

const addDefaultUserId: MiddlewareFn<IContext> = async ({ args, context: { identity } }, next) => {
    const input = args.input as CreateEventInput;
    input.adminUserId = input.adminUserId || identity.user?.username;
    if (!input.adminUserId) {
        throw new Error(errorMessage.noUserId);
    }
    return next();
};

const isAllowedToEditEvent: AuthCheck = async ({ args, context: { identity } }) => {
    if (identity.type !== IdentityType.USER) {
        throw new Error(errorMessage.authTypeNotUser);
    }
    const input = args.input as UpdateEventInput;

    const event = await mapper.get(Object.assign(new Event(), { id: input.id }));

    if (event.adminUserId === identity.user?.username) {
        return true;
    }

    throw new Error(errorMessage.notEventAdmin);
};

const CrudResolvers = buildCrudResolvers('Event', Event, {
    crudProps: {
        create: { inputType: CreateEventInput, resolverProps: { one: { middleware: [addDefaultUserId] } } },
        update: { inputType: UpdateEventInput, resolverProps: { one: { middleware: [createAuthMiddleware([isAllowedToEditEvent])] } } },
        get: { resolverProps: { one: true, many: true } },
        delete: { resolverProps: { one: { middleware: [createAuthMiddleware([isAllowedToEditEvent])] } } },
    },
});

export default [...CrudResolvers];
