/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { hashKey } from '@aws/dynamodb-data-mapper-annotations';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import Creatable from './creatable';

@ObjectType({ isAbstract: true })
abstract class BaseModelWithId extends Creatable {
    @Field(() => ID, { nullable: true })
    @hashKey({ defaultProvider: () => uuidv4() })
    id: string;
}

export default BaseModelWithId;
