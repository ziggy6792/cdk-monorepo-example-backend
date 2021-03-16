/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType, ID, Int } from 'type-graphql';
import { IPerson } from './abstract/person.interface';

@ObjectType({ implements: IPerson })
class Student extends IPerson {
    @Field()
    school: string;
}

export default Student;
