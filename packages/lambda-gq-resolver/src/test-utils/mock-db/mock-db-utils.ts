import Competition from 'src/domain/models/competition';
import Event from 'src/domain/models/event';
import Heat from 'src/domain/models/heat';
import RiderAllocation from 'src/domain/models/rider-allocation';
import Round from 'src/domain/models/round';
import SeedSlot from 'src/domain/models/seed-slot';
import { toArray } from 'src/utils/async-iterator';
import { mapper } from 'src/utils/mapper';
import { IMockDb } from './types';

const mockDbTables = {
    events: Event,
    competitions: Competition,
    rounds: Round,
    heats: Heat,
    seedSlots: SeedSlot,
    riderAllocatios: RiderAllocation,
};

const populateDb = async (mockDb: IMockDb): Promise<void> => {
    const putFns = Object.keys(mockDb).map((key: keyof IMockDb) => {
        const inputItems = mockDb[key];
        const dbItems = inputItems.map((inputItem) => Object.assign(new mockDbTables[key](), inputItem));
        return async () => toArray(mapper.batchPut(dbItems));
    });
    const updatedEntities = await Promise.all(putFns.map((fn) => fn()));
};

const dbToJson = async () => {
    const retJson: IMockDb = {};
    const scanFns = Object.keys(mockDbTables).map((key: keyof typeof mockDbTables) => async () => {
        retJson[key] = await toArray(mapper.scan(mockDbTables[key] as any));
    });
    await Promise.all(scanFns.map((fn) => fn()));
    return retJson;

    // const events = await toArray(mapper.scan(Event));

    // const competitions = await toArray(mapper.scan(Competition));

    // const rounds = await toArray(mapper.scan(Round));

    // const heats = await toArray(mapper.scan(Heat));

    // const seedSlots = await toArray(mapper.scan(SeedSlot));

    // const mockDb = {
    //     events,
    //     competitions,
    //     rounds,
    //     heats,
    //     seedSlots,
    // };

    // console.log(JSON.stringify(mockDb));
};

const mockDbUtils = {
    populateDb,
    dbToJson,
};

export default mockDbUtils;