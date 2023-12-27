import type { ConterRepository } from '../domain/ConterRepository';
import { EventRunner } from '../../shared/Routes/EventRunner';

export const SetCount = EventRunner.prepareEvent<number, number, ConterRepository>(async({ repo, params }) => {
	if (typeof params !== 'number') throw new Error('Required param number');
	const newNumber = await repo.set(params);
	return newNumber;
});
