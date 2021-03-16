/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType, ID, Int } from 'type-graphql';
import ICreatable from './abstract/creatable.interface';
import IIdentifiable from './abstract/identifiable.interface';

@ObjectType({ implements: [IIdentifiable, ICreatable] })
class Student extends IIdentifiable {
    @Field()
    school: string;
}

export default Student;
