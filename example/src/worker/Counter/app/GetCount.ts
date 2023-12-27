import type { ConterRepository } from '../domain/ConterRepository';
import { EventRunner } from '../../shared/Routes/EventRunner';

export const GetCount = EventRunner.prepareEvent<number, undefined, ConterRepository>(async({ repo }) => {
	return repo.get();
});
