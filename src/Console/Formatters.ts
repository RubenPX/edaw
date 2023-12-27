export const consoleDecorations = {
	RoundedBorder: (color: string) => `border-left: 2px solid ${color}; border-right: 2px solid ${color}; padding: 0 4px; border-radius: 5px; `
};

export const ConsoleColors = {
	green  : 'color: #0d0; ',
	blue   : 'color: #0af; ',
	red    : 'color: #f20; ',
	orange : 'color: #F80; ',
	purple : 'color: #d602ee; '
};

// eslint-disable-next-line no-undef
export const isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
export const workerLetter = isWorker ? 'W' : 'C';

export const ConsolePrefix = {
	sendMsg            : [`%c${workerLetter}⮞`, ConsoleColors.orange + consoleDecorations.RoundedBorder('#F80')],
	reciveMsg          : [`%c${workerLetter}⮜`, ConsoleColors.green + consoleDecorations.RoundedBorder('#0d0')],
	Error              : [`%c${workerLetter}⭙`, ConsoleColors.red + consoleDecorations.RoundedBorder('#f20')],
	ObserverRegister   : [`%c${workerLetter}⭘`, ConsoleColors.purple + consoleDecorations.RoundedBorder('#d602ee')],
	ObserverUnRegister : [`%c${workerLetter}⮾`, ConsoleColors.purple + consoleDecorations.RoundedBorder('#d602ee')]
};

const padding = 'padding-left: 5px; padding-right: 5px; padding-top: 2px;';

const badgeInfo = 'background-color: #38f; border-radius: 100px; color: #000;';
const badgeSucc = 'background-color: #492; border-radius: 100px; color: #000;';
const badgeYellow = 'background-color: #fa0; border-radius: 100px; color: #000;';
const badgeWarn = 'background-color: #f53; border-radius: 100px; color: #000;';

export class ConsoleFormatter {
	public static info(badgeTitles: string | string[], data: any = '') {
		if (badgeTitles instanceof Array) {
			return ['%c' + badgeTitles.join(' | '), `${padding} ${badgeInfo}`, data];
		}
		return ['%c' + badgeTitles, `${padding} ${badgeInfo}`, data];
	}

	public static warn(badgeTitles: string | string[], data: any = '') {
		if (badgeTitles instanceof Array) return ['%c' + badgeTitles.join(' | '), `${padding} ${badgeWarn}`, data];
		return ['%c' + badgeTitles, `${padding} ${badgeWarn}`, data];
	}

	public static yellow(badgeTitles: string | string[], data: any = '') {
		if (badgeTitles instanceof Array) return ['%c' + badgeTitles.join(' | '), `${padding} ${badgeYellow}`, data];
		return ['%c' + badgeTitles, `${padding} ${badgeYellow}`, data];
	}

	public static succes(badgeTitles: string | string[], data: any = '') {
		if (badgeTitles instanceof Array) return ['%c' + badgeTitles.join(' | '), `${padding} ${badgeSucc}`, data];
		return ['%c' + badgeTitles, `${padding} ${badgeSucc}`, data];
	}
}
