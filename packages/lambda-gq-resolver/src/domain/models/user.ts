/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType, Root } from 'type-graphql';
import Identifiable from 'src/domain/models/abstract/identifiable';
import * as utils from 'src/utils/utility';
import { commonConfig } from '@alpaca-backend/common';
import { Model } from '@shiftcoders/dynamo-easy';
import DynamoStore from 'src/utils/dynamo-easy/dynamo-store';

const tableSchema = commonConfig.DB_SCHEMA.User;

@ObjectType()
@Model({ tableName: utils.getTableName(tableSchema.tableName) })
class User extends Identifiable {
    static store: DynamoStore<User>;

    @Field()
    email: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    fullName(@Root() parent: User): string {
        return parent.getFullName();
    }

    public getFullName(): string {
        const { firstName, lastName } = this;
        return `${firstName}${lastName ? ` ${lastName}` : ''}`;
    }
}

User.store = new DynamoStore(User);

export default User;
