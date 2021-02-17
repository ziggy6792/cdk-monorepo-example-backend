import Competition from 'src/domain/models/competition';
import isAuthRole from 'src/middleware/is-auth-role';
import createCrudResolvers from 'src/higher-order-resolvers/create-crud-resolvers';
import { CreateCompetitionInput, UpdateCompetitionInput } from 'src/modules/competition/inputs';

const CrudResolvers = createCrudResolvers('Competition', Competition, {
    create: { inputType: CreateCompetitionInput, resolvers: { one: { middleware: [] } } },
    update: { inputType: UpdateCompetitionInput, resolvers: { one: true } },
    get: { resolvers: { one: true, many: true } },
    delete: { resolvers: { one: true } },
});

export default [...CrudResolvers];
