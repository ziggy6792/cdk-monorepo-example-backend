/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import User from 'src/domain/models/user';

@ValidatorConstraint({ async: true })
export class IsIdAlreadyExistConstraint implements ValidatorConstraintInterface {
    async validate(id: string) {
        try {
            await User.store.get(id).exec();

            return false;
        } catch (err) {
            return true;
        }
    }
}

export function IsIdAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsIdAlreadyExistConstraint,
        });
    };
}
