/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { Field, ID, ObjectType, Root } from 'type-graphql';
import BaseModelWithId from './abstract-models/base-model-with-id';

// interface Deleteable {
//     deleteChildren: () => Promise<void>;
// }
@ObjectType()
@table('User')
class User extends BaseModelWithId {
    @Field()
    @attribute()
    email: string;

    @Field()
    @attribute()
    firstName: string;

    @Field()
    @attribute({})
    lastName: string;

    @Field()
    fullName(@Root() parent: User): string {
        return parent.getFullName();
    }

    private getFullName(): string {
        const { firstName, lastName } = this;
        return `${firstName}${lastName ? ` ${lastName}` : ''}`;
    }
}

export default User;
