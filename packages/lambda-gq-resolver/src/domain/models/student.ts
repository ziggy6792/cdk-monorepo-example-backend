/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType, ID, Int } from 'type-graphql';
import ICreatable from './abstract/creatable.interface';
import IDataEntity from './abstract/data-entity.interface';
import IIdentifiable from './abstract/identifiable.interface';

@ObjectType({ implements: [IDataEntity, IIdentifiable, ICreatable] })
class Student extends IDataEntity {
    @Field()
    school: string;
}

export default Student;
