/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import moment from 'src/utils/moment';

@ObjectType({ isAbstract: true })
abstract class Creatable {
    @Field(() => ID, { nullable: true })
    @attribute({ defaultProvider: () => moment().toISOString() })
    createdAt: string;
}

export default Creatable;
