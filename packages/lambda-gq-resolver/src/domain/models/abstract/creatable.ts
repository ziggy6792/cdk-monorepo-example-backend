/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType } from 'type-graphql';
import getUniqueTimestamp from 'src/utils/get-unique-timestamp';
import DynamoStore from 'src/utils/dynamo-easy/dynamo-store';
import { metadataForModel } from '@shiftcoders/dynamo-easy';

// const target = { name: 'Me', age: 25 };

const merge = (...args) => {
    // Variables
    const target = {};

    // Merge the object into the target object
    const merger = (obj) => {
        for (const prop in obj) {
            // eslint-disable-next-line no-prototype-builtins
            if (obj.hasOwnProperty(prop)) {
                if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                    // If we're doing a deep merge and the property is an object
                    target[prop] = merge(target[prop], obj[prop]);
                } else {
                    // Otherwise, do a regular merge
                    target[prop] = obj[prop];
                }
            }
        }
    };

    // Loop through each object and conduct a merge
    for (let i = 0; i < args.length; i++) {
        merger(args[i]);
    }

    return target;
};

@ObjectType({ isAbstract: true })
abstract class Creatable {
    @Field()
    readonly createdAt: string;

    readonly __typeName: string;

    modifiedAt: string;

    constructor() {
        this.__typeName = this.constructor.name;
        this.createdAt = Creatable.getTimestamp();
    }

    mapIn(loadedValues: any): void {
        // Object.assign(this, { ...merge(this, loadedValues) });
        _.merge(this, loadedValues);
    }

    static getTimestamp(): string {
        return getUniqueTimestamp().toString();
    }

    static store: DynamoStore<any>;

    setModifiedAt(): void {
        this.modifiedAt = this.modifiedAt ? Creatable.getTimestamp() : this.createdAt;
    }

    getKeys(): any {
        // const classType = this.constructor as typeof Creatable;
        const metadata = metadataForModel(this.constructor as any);
        const keys = [metadata.getPartitionKey(), metadata.getSortKey()].filter((v) => !!v);
        return _.pick(this, keys);
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
