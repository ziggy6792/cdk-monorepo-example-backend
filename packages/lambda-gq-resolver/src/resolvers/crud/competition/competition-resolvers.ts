import Competition from 'src/domain/models/competition';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import { CreateCompetitionInput, UpdateCompetitionInput } from 'src/resolvers/crud/competition/inputs';
import createAuthMiddleware from 'src/middleware/create-auth-middleware';
import isAuthRole from 'src/middleware/auth-check/is-auth-role';
import { AuthCheck } from 'src/middleware/auth-check/types';
import { IdentityType } from 'src/types';
import errorMessage from 'src/config/error-message';
import Event from 'src/domain/models/event';

const isAllowedToCreateComp: AuthCheck = async ({ args, context: { identity } }) => {
    if (identity.type !== IdentityType.USER) {
        throw new Error(errorMessage.auth.authTypeNotUser);
    }
    const input = args.input as CreateCompetitionInput;

    const event = await Event.store.get(input.eventId).exec();

    if (event.adminUserId === identity.user?.username) {
        return true;
    }

    throw new Error(errorMessage.auth.notCompetitionAdmin);
};

const isAllowedToEditComp: AuthCheck = async ({ args, context: { identity } }) => {
    if (identity.type !== IdentityType.USER) {
        throw new Error(errorMessage.auth.authTypeNotUser);
    }
    const input = args.input as UpdateCompetitionInput;

    const competition = await Competition.store.get(input.id).exec();

    const event = await competition.getEvent();

    if (event.adminUserId === identity.user?.username) {
        return true;
    }

    throw new Error(errorMessage.auth.notCompetitionAdmin);
};

const createCompMiddleware = [createAuthMiddleware([isAllowedToCreateComp])];
const editCompMiddleware = [createAuthMiddleware([isAllowedToEditComp])];

const CrudResolvers = buildCrudResolvers('Competition', Competition, {
    crudProps: {
        create: { inputType: CreateCompetitionInput, resolverProps: { one: { middleware: createCompMiddleware } } },
        update: { inputType: UpdateCompetitionInput, resolverProps: { one: { middleware: editCompMiddleware } } },
        get: { resolverProps: { one: true, many: true } },
        delete: { resolverProps: { one: { middleware: editCompMiddleware } } },
    },
});

export default [...CrudResolvers];
