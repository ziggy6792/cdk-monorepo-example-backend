/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
import { Length, IsEmail } from 'class-validator';
import { Field, InputType, ID } from 'type-graphql';

@InputType()
class UserInput {
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

@InputType()
export class CreateUserInput extends UserInput {
    @Field(() => ID, { nullable: true })
    id: string;
}

@InputType()
export class UpdateUserInput extends UserInput {
    @Field(() => ID)
    id: string;
}
