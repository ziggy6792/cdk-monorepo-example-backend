/* eslint-disable import/prefer-default-export */
import { MaxLength, Length, IsEmail } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class CreateUserInput {
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
