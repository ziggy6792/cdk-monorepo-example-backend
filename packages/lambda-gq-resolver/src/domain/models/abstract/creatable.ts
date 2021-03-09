/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { ClassType, ObjectType } from 'type-graphql';
import getUniqueTimestamp from 'src/utils/get-unique-timestamp';
import DynamoStore from 'src/utils/dynamo-easy/dynamo-store';
import { GetRequest, GSISortKey } from '@shiftcoders/dynamo-easy';
import DynamoService from 'src/utils/dynamo-easy/dynamo-service';

@ObjectType({ isAbstract: true })
abstract class Creatable {
    createdAt: string;

    modifiedAt: string;

    readonly __typeName: string;

    constructor() {
        this.setDefaults();
        this.__typeName = this.constructor.name;
    }

    mapIn(loadedValues: any): void {
        _.merge(this, loadedValues);
    }

    static getTimestamp(): string {
        return getUniqueTimestamp().toString();
    }

    static store: DynamoStore<any>;

    setDefaults(): void {
        this.createdAt = Creatable.getTimestamp();
    }

    setModifiedAt(): void {
        this.modifiedAt = this.modifiedAt ? Creatable.getTimestamp() : this.createdAt;
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
