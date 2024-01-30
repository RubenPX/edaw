export class EventRunner {
    repo;
    run;
    constructor(repo, run) {
        this.repo = repo;
        this.run = run;
    }
    async runMethod(ev, bus) {
        if (typeof this.repo === 'number' && isNaN(this.repo))
            throw new Error('Repository is not initialized');
        return await this.run({ repo: this.repo, params: ev.params, bus, evMsg: ev });
    }
    static prepareEvent(executor) {
        return (repoData) => new EventRunner(repoData ?? NaN, executor);
    }
}
