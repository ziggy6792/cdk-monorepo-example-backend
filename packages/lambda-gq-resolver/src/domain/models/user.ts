/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, table } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ObjectType, Root } from 'type-graphql';
import Identifiable from 'src/domain/models/abstract/identifiable';

// interface Deleteable {
//     deleteChildren: () => Promise<void>;
// }
@ObjectType({ isAbstract: true })
@table('User')
class User extends Identifiable {
    @Field()
    @attribute()
    email: string;

    @Field()
    @attribute()
    firstName: string;

    @Field()
    @attribute({})
    lastName: string;

    getFullName(): string {
        const { firstName, lastName } = this;
        return `${firstName}${lastName ? ` ${lastName}` : ''}`;
    }
}

export default User;
