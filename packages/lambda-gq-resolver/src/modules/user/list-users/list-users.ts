import User from 'src/domain-models/user';
import createListResolver from 'src/modules/higher-order-resolvers/create-list-resolver';
import isAuthRole from 'src/modules/middleware/is-auth-role';

const ListUsersResolver = createListResolver('User', User, [isAuthRole]);

export default ListUsersResolver;
