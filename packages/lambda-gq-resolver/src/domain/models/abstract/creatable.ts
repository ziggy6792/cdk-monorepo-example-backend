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

@ObjectType({ isAbstract: true })
abstract class Creatable {
    readonly __typename: string;

    @Field()
    readonly createdAt: string;

    @Field()
    private modifiedAt: string;

    constructor() {
        this.__typename = this.constructor.name;
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
        // ToDo: Clean this up
        // Object.assign(this, { modifiedAt: this.modifiedAt ? Creatable.getTimestamp() : this.createdAt });
        this.modifiedAt = this.modifiedAt ? Creatable.getTimestamp() : this.createdAt;
    }

    getModifiedAt(): string {
        return this.modifiedAt;
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
