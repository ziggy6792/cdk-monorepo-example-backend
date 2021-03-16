/* eslint-disable new-cap */
/* eslint-disable class-methods-use-this */

import { Resolver, Query, Arg, ID } from 'type-graphql';
import Student from 'src/domain/models/student';
import Employee from 'src/domain/models/employee';
import IIdentifiable from 'src/domain/models/abstract/identifiable.interface';

@Resolver()
class GetPersonResolver {
    @Query(() => IIdentifiable, { nullable: true })
    async getPerson(@Arg('id', () => ID) id: string): Promise<IIdentifiable> {
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
