/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import moment from 'src/utils/moment';
import getUniqueTimestamp from 'src/utils/get-unique-timestamp';
import { mapper } from 'src/utils/mapper';
import { toArray } from 'src/utils/async-iterator';
import Heat from 'src/domain/models/heat';
import Round from 'src/domain/models/round';

const getCreatedAt = (): string => getUniqueTimestamp().toString();
@ObjectType({ isAbstract: true })
abstract class Creatable {
    @Field(() => ID, { nullable: true })
    @attribute({ defaultProvider: () => getCreatedAt() })
    createdAt: string;

    @attribute({ defaultProvider: () => 'partition' })
    partition: string;

    setDefaults(): void {
        this.createdAt = getCreatedAt();
    }

    async getChildren(): Promise<Creatable[]> {
        return [];
    }

    async getDescendants(): Promise<Creatable[]> {
        const traverse = async (node: Creatable, childrenList: Creatable[] = []): Promise<Creatable[]> => {
            const children = await node.getChildren();
            for (const child of children) {
                childrenList.push(child);
                await traverse(child, childrenList);
            }
            return childrenList;
        };

        return traverse(this);
    }

    // async deleteAllChildren(): Promise<Creatable[]> {
    //     // const allChildren = await this.getAllChildren();

    //     // // await toArray(mapper.batchDelete([allChildren[0]]));

    //     // const exampleRound = allChildren[0];

    //     // // console.log(exampleRound.constructor);
    //     // console.log(exampleRound);

    //     const allChildren = await this.getAllChildren();

    //     return allChildren;

    //     // return toArray(mapper.batchDelete(allChildren));

    //     // const heats = allChildren.filter((child) => child.constructor === Heat);

    //     // console.log('heats', heats);
    // }

    static createIndexes(): Promise<void> {
        // do nothing
        return null;
    }
}

export default Creatable;
