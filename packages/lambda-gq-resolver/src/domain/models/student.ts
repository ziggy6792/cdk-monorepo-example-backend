/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType, ID, Int } from 'type-graphql';
import ICreatable from './abstract/creatable.interface';

@ObjectType({ implements: ICreatable })
class Student extends ICreatable {
    @Field()
    school: string;
}

export default Student;
