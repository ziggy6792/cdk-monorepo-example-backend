/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { Field, ID, ObjectType, Root } from 'type-graphql';

@ObjectType()
@table('User')
class User {
  @Field(() => ID, { nullable: true })
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

  // @Field()
  // fullName: string;

  @Field()
  fullName(@Root() parent: User): string {
    return parent.getFullName();
  }

  generateId(): string {
    this.id = this.getFullName().toLowerCase().replace(/\s/g, '-');
    if (!this.id) {
      this.id = uuidv4();
    }
    return this.id;
  }

  private getFullName(): string {
    const { firstName, lastName } = this;
    return `${firstName}${lastName ? ` ${lastName}` : ''}`;
  }
}

export default User;
