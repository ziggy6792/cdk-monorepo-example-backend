/* eslint-disable max-classes-per-file */
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@table('User')
class User {
  @Field(() => ID)
  @hashKey({ defaultProvider: () => uuidv4() })
  id: string;

  @Field()
  @attribute()
  email: string;

  @Field()
  @attribute()
  firstName: string;

  @Field()
  @attribute({})
  lastName: string;

  @Field()
  fullName: string;

  generateId(): string {
    this.id = this.getFullName().toLowerCase().replace(/\s/g, '-');
    if (!this.id) {
      this.id = uuidv4();
    }
    return this.id;
  }

  getFullName(): string {
    const { firstName, lastName } = this;
    return `${firstName}${lastName ? ` ${lastName}` : ''}`;
  }
}

export default User;
