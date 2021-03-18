/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
import { EventStatus } from 'src/domain/models/event';
import { Field, InputType, ID } from 'type-graphql';

@InputType()
class EventInput {
    @Field()
    name: string;

    @Field({ nullable: true })
    description: string;

    @Field((type) => EventStatus, { nullable: true })
    status: EventStatus;

    @Field({ nullable: true })
    adminUserId: string;

    @Field({ nullable: true })
    selectedHeatId: string;
}

@InputType()
export class CreateEventInput extends EventInput {
    @Field(() => ID, { nullable: true })
    id: string;

    @Field()
    startTime: string;
}

@InputType()
export class UpdateEventInput extends EventInput {
    @Field(() => ID)
    id: string;

    @Field({ nullable: true })
    startTime: string;
}
