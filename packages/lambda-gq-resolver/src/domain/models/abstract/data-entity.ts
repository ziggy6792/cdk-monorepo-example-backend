/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ID, InterfaceType, ObjectType } from 'type-graphql';
import Identifiable from './identifiable';

@ObjectType({ isAbstract: true })
abstract class DataEntity extends Identifiable {
    @Field()
    name: string;
}

export default DataEntity;
