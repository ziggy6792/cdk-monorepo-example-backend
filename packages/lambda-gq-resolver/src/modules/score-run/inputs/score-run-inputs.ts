/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
import { Field, InputType, ID, Int } from 'type-graphql';
import { UpdateRiderAllocationInput } from 'src/modules/crud/rider-allocation/inputs/rider-allocation-inputs';

@InputType()
export class ScorRunInput extends UpdateRiderAllocationInput {}
