import isCompetitionAdmin from 'src/middleware/auth-check/is-comp-admin';
import Competition from 'src/domain/models/competition';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import { CreateCompetitionInput, UpdateCompetitionInput } from 'src/modules/competition/inputs';
import createAuthMiddleware from 'src/middleware/create-auth-middleware';
import isAuthRole from 'src/middleware/auth-check/is-auth-role';

const editCompMiddleware = [createAuthMiddleware([isAuthRole, isCompetitionAdmin])];

const CrudResolvers = buildCrudResolvers('Competition', Competition, {
    crudProps: {
        create: { inputType: CreateCompetitionInput, resolverProps: { one: { middleware: editCompMiddleware } } },
        update: { inputType: UpdateCompetitionInput, resolverProps: { one: { middleware: editCompMiddleware } } },
        get: { resolverProps: { one: true, many: true } },
        delete: { resolverProps: { one: { middleware: editCompMiddleware } } },
    },
});

export default [...CrudResolvers];
