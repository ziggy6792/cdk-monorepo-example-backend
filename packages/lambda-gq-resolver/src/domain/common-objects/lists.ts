/* eslint-disable max-classes-per-file */
import createListObject from 'src/domain/common-objects/higher-order-objects/create-list-object';
import { Field, ObjectType } from 'type-graphql';
import SeedSlot from 'src/domain/models/seed-slot';
import RiderAllocation from 'src/domain/models/rider-allocation';
import CompetitionModel from 'src/domain/models/competition';
import Round from 'src/domain/models/round';
import Heat from 'src/domain/models/heat';

@ObjectType()
export class CompetitionList {
    @Field((type) => [CompetitionModel])
    items: CompetitionModel[];
}

@ObjectType()
export class SeedSlotList {
    @Field((type) => [SeedSlot])
    items: SeedSlot[];
}

@ObjectType()
export class RiderAllocationList {
    @Field((type) => [RiderAllocation])
    items: RiderAllocation[];
}

@ObjectType()
export class RoundList {
    @Field((type) => [Round])
    items: Array<Round>;
}

@ObjectType()
export class HeatList {
    @Field((type) => [Heat])
    items: Array<Heat>;
}

// @ObjectType()
// export class CompetitionList extends createListObject(Competition) {}

// @ObjectType()
// export class HeatList extends createListObject(Heat) {}

// @ObjectType()
// export class RiderAllocationList extends createListObject(RiderAllocation) {}

// @ObjectType()
// export class RoundList extends createListObject(Round) {}

// @ObjectType()
// export class SeedSlotList extends createListObject(SeedSlot) {}
