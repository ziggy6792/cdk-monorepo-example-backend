/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType } from 'type-graphql';
import ICreatable from './abstract/creatable.interface';

@ObjectType({ implements: ICreatable })
class Employee extends ICreatable {
    @Field()
    work: string;
}

export default Employee;
