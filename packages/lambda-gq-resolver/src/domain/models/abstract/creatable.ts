/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import getUniqueTimestamp from 'src/utils/get-unique-timestamp';

const getTimestamp = (): string => getUniqueTimestamp().toString();
@ObjectType({ isAbstract: true })
abstract class Creatable {
    createdAt: string;

    modifiedAt: string;

    constructor() {
        this.createdAt = getTimestamp();
    }

    setDefaults(): void {
        this.createdAt = getTimestamp();
    }

    setModifiedAt(): void {
        this.modifiedAt = getTimestamp();
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
}

export default Creatable;
