/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType } from 'type-graphql';
import ICreatable from './abstract/creatable.interface';
import IIdentifiable from './abstract/identifiable.interface';

@ObjectType({ implements: [IIdentifiable, ICreatable] })
class Employee extends IIdentifiable {
    @Field()
    work: string;
}

export default Employee;
