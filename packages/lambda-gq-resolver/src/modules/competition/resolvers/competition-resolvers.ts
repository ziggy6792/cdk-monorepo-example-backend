import Competition from 'src/domain/models/competition';
import isAuthRoleMiddleware from 'src/middleware/is-auth-role';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import { CreateCompetitionInput, UpdateCompetitionInput } from 'src/modules/competition/inputs';

const CrudResolvers = buildCrudResolvers('Competition', Competition, {
    crudProps: {
        create: { inputType: CreateCompetitionInput, resolverProps: { one: true } },
        update: { inputType: UpdateCompetitionInput, resolverProps: { one: true } },
        get: { resolverProps: { one: true, many: true } },
        delete: { resolverProps: { one: true } },
    },
});

export default [...CrudResolvers];
