/* eslint-disable import/prefer-default-export */
import { MaxLength, Length, IsEmail } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import { IsIdAlreadyExist } from './is-id-already-exist';

@InputType()
export class RegisterInput {
    @Field(() => ID, { nullable: true })
    @IsIdAlreadyExist({ message: 'Id already in use' })
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
