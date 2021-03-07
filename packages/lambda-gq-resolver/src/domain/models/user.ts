/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType, Root } from 'type-graphql';
import Identifiable from 'src/domain/models/abstract/identifiable';
import * as utils from 'src/utils/utility';
import { commonConfig } from '@alpaca-backend/common';
import { Model } from '@shiftcoders/dynamo-easy';

// interface Deleteable {
//     deleteChildren: () => Promise<void>;
// }

@ObjectType()
@Model({ tableName: utils.getTableName(commonConfig.DB_SCHEMA.User.tableName) })
class User extends Identifiable {
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

export default User;
