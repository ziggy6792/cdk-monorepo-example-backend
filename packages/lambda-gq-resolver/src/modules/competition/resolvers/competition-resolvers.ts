import Competition from 'src/domain/models/competition';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import { CreateCompetitionInput, UpdateCompetitionInput } from 'src/modules/competition/inputs';
import createAuthMiddleware from 'src/middleware/create-auth-middleware';
import isAuthRole from 'src/middleware/auth-check/is-auth-role';
import { AuthCheck } from 'src/middleware/auth-check/types';
import { IdentityType } from 'src/types';
import errorMessage from 'src/config/error-message';
import { mapper } from 'src/utils/mapper';
import Event from 'src/domain/models/event';

const isAllowedToCreateEvent: AuthCheck = async ({ args, context: { identity } }) => {
    if (identity.type !== IdentityType.USER) {
        throw new Error(errorMessage.authTypeNotUser);
    }
    const input = args.input as CreateCompetitionInput;

    const event = await mapper.get(Object.assign(new Event(), { id: input.eventId }));

    if (event.adminUserId === identity.user?.username) {
        return true;
    }

    throw new Error(errorMessage.notCompetitionAdmin);
};

const isAllowedToEditComp: AuthCheck = async ({ args, context: { identity } }) => {
    if (identity.type !== IdentityType.USER) {
        throw new Error(errorMessage.authTypeNotUser);
    }
    const input = args.input as UpdateCompetitionInput;

    const competition = await mapper.get(Object.assign(new Competition(), { id: input.id }));
    console.log('competition', competition);
    const event = await competition.getEvent();
    console.log('event', event);

    if (event.adminUserId === identity.user?.username) {
        return true;
    }

    throw new Error(errorMessage.notCompetitionAdmin);
};

const createCompMiddleware = [createAuthMiddleware([isAuthRole, isAllowedToCreateEvent])];
const editCompMiddleware = [createAuthMiddleware([isAuthRole, isAllowedToEditComp])];

const CrudResolvers = buildCrudResolvers('Competition', Competition, {
    crudProps: {
        create: { inputType: CreateCompetitionInput, resolverProps: { one: { middleware: createCompMiddleware } } },
        update: { inputType: UpdateCompetitionInput, resolverProps: { one: { middleware: editCompMiddleware } } },
        get: { resolverProps: { one: true, many: true } },
        delete: { resolverProps: { one: { middleware: editCompMiddleware } } },
    },
});

export default [...CrudResolvers];
