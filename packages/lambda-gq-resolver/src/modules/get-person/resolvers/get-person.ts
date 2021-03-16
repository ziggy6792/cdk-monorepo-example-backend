/* eslint-disable new-cap */
/* eslint-disable class-methods-use-this */

import { Resolver, Query, Arg, ID } from 'type-graphql';
import Student from 'src/domain/models/student';
import Employee from 'src/domain/models/employee';
import IDataEntity from 'src/domain/models/abstract/data-entity.interface';

@Resolver()
class GetPersonResolver {
    @Query(() => IDataEntity, { nullable: true })
    async getPerson(@Arg('id', () => ID) id: string): Promise<IDataEntity> {
        if (id.includes('s')) {
            const student = new Student();

            student.school = 'school';

            student.name = 'Student name';

            return student;
        }

        const employee = new Employee();

        employee.work = 'work';

        employee.name = 'Employee name';

        return employee;
    }
}

export default GetPersonResolver;
