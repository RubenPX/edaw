import type { ConterRepository } from '../domain/ConterRepository';
import { EventRunner } from '../../shared/Routes/EventRunner';

export const ErrorCount = EventRunner.prepareEvent<number, undefined, ConterRepository>(async({ repo }) => {
	throw new Error('this is an intetional error');
});
