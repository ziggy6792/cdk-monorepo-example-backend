/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
import { EventStatus } from 'src/domain-models/event';
import { Field, InputType, ID } from 'type-graphql';

@InputType()
class EventInput {
    @Field()
    name: string;

    @Field()
    description: string;

    @Field()
    when: string;

    @Field((type) => EventStatus)
    status: EventStatus;

    @Field()
    adminUserId: string;

    @Field()
    selectedHeatId: string;
}

@InputType()
export class CreateEventInput extends EventInput {
    @Field(() => ID, { nullable: true })
    id: string;
}

@InputType()
export class UpdateEventInput extends EventInput {
    @Field(() => ID)
    id: string;
}
