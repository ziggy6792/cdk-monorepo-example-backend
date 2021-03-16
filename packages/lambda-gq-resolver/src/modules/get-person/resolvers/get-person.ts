/* eslint-disable new-cap */
/* eslint-disable class-methods-use-this */

import { Resolver, Query, Arg, ID } from 'type-graphql';
import Student from 'src/domain/models/student';
import ICreatable from 'src/domain/models/abstract/creatable.interface';
import Employee from 'src/domain/models/employee';

@Resolver()
class GetPersonResolver {
    @Query(() => ICreatable, { nullable: true })
    async getPerson(@Arg('id', () => ID) id: string): Promise<ICreatable> {
        if (id.includes('s')) {
            const student = new Student();

            student.school = 'school';

            return student;
        }

        const employee = new Employee();

        employee.work = 'work';

        return employee;
    }
}

export default GetPersonResolver;
