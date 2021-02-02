/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType, Root } from 'type-graphql';
import * as models from 'src/domain/models';

// interface Deleteable {
//     deleteChildren: () => Promise<void>;
// }
@ObjectType()
class User extends models.User {
    @Field()
    fullName(@Root() parent: User): string {
        return parent.getFullName();
    }
}

export default User;
