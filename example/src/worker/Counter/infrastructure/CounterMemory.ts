import type { ConterRepository } from '../domain/ConterRepository';

export class CounterMemory implements ConterRepository {
	private num: number = this.getRandomNumber();
	get(): number {
		return this.num;
	}

	set(value: number): number {
		this.num = value;
		return this.num;
	}

	private getRandomNumber(): number {
		return parseInt(Math.random() * 100 + '');
	}
}
