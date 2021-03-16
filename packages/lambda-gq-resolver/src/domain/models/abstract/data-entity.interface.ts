/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, InterfaceType } from 'type-graphql';
import IIdentifiable from './identifiable.interface';

@InterfaceType({
    implements: IIdentifiable,
})
abstract class IDataEntity extends IIdentifiable {
    @Field()
    name: string;
}

export default IDataEntity;
