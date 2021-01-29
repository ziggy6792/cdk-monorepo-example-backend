import User from 'src/domain-models/user';
import createCreateResolver from 'src/modules/higher-order-resolvers/create-create-resolver';
import isAuthRole from 'src/modules/middleware/is-auth-role';
import { CreateUserInput } from './create-user-input';

const CreateUserResolver = createCreateResolver('User', User, CreateUserInput, [isAuthRole]);

export default CreateUserResolver;
