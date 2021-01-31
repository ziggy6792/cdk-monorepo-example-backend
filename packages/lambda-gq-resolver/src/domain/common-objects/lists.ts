/* eslint-disable max-classes-per-file */
import { ObjectType } from 'type-graphql';
import createListObject from 'src/domain/common-objects/higher-order-objects/create-list-object';
import SeedSlot from 'src/domain/models/seed-slot';
import RiderAllocation from 'src/domain/models/rider-allocation';
import Competition from 'src/domain/models/competition';

@ObjectType()
export class CompetitionList extends createListObject(Competition) {}

@ObjectType()
export class SeedSlotList extends createListObject(SeedSlot) {}

@ObjectType()
export class RiderAllocationList extends createListObject(RiderAllocation) {}
