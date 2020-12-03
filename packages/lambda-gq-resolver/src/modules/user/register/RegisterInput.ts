/* eslint-disable import/prefer-default-export */
import { MaxLength, Length, IsEmail, IsOptional } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class RegisterInput {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  email: string;
}
