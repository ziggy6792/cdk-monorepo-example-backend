import Competition from 'src/domain/models/competition';
import isAuthRole from 'src/middleware/is-auth-role';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import { CreateCompetitionInput, UpdateCompetitionInput } from 'src/modules/competition/inputs';

const CrudResolvers = buildCrudResolvers('Competition', Competition, {
    crudProps: {
        create: { inputType: CreateCompetitionInput, resolverProps: { one: { middleware: [] } } },
        update: { inputType: UpdateCompetitionInput, resolverProps: { one: { middleware: [] } } },
        get: { resolverProps: { one: { middleware: [] }, many: { middleware: [] } } },
        delete: { resolverProps: { one: { middleware: [] } } },
    },
});

export default [...CrudResolvers];
