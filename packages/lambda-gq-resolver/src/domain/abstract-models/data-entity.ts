/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import Identifiable from './identifiable';

@ObjectType({ isAbstract: true })
abstract class DataEntity extends Identifiable {
    @Field()
    @attribute()
    name: string;
}

export default DataEntity;
