/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType } from 'type-graphql';
import ICreatable from './abstract/creatable.interface';
import IDataEntity from './abstract/data-entity.interface';
import IIdentifiable from './abstract/identifiable.interface';

@ObjectType({ implements: [IDataEntity, IIdentifiable, ICreatable] })
class Employee extends IDataEntity {
    @Field()
    work: string;
}

export default Employee;
