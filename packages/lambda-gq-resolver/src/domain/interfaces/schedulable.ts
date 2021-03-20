/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { Property } from '@shiftcoders/dynamo-easy';
import _ from 'lodash';
import dateMapper from 'src/utils/dynamo-easy/mappers/date-mapper';
import { Field, InterfaceType } from 'type-graphql';

@InterfaceType()
abstract class Schedulable {
    @Field()
    @Property({ mapper: dateMapper })
    startTime: Date;
}

export default Schedulable;
