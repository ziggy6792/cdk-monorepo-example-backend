/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType } from 'type-graphql';
import IPerson from './abstract/person.interface';

@ObjectType({ implements: IPerson })
class Employee extends IPerson {
    @Field()
    work: string;
}

export default Employee;
