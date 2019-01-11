var readline = require('readline');
var events = require('events');
var e = new events.EventEmitter();
var os = require('os');
const fs = require('fs');
var path = require('path');
const chalk = require('chalk');
var baseDir = path.join(__dirname, 'users')

var possibleInput = [
	'date',
	'exit',
	'help',
	'man', 
	'exit',
	'list users',
	'stats',
	'more user info'
]


var manObj = {
	'date': 'This is date menu',
	'exit': 'This is exit menu',
	'help': 'This is help menu',
	'man': 'This is manual guide',
	'list users': 'This is list of all users',
	'stats': 'This is system stats',
	'more user info': 'For more user information'
}


var cli = {};

cli.init = () => {
	console.log('CLI is running');
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: 'write something here...> '
	});

	rl.prompt();
	rl.on('line', (line) => {
		cli.processInput(line);
		rl.prompt();
	}).on('close', () => {
		process.exit(0);
	})
};

cli.processInput = (str) => {
	let string = typeof str === "string" && str.length > 0 ? str : false;
	var matchFound = false;
	if (string) {
		possibleInput.some((input) => {
			if (str.toLowerCase().indexOf(input) > -1) {
				matchFound = true;
				e.emit(input, str);
				return true;
			}
		})
	} 
	if(!matchFound) {
		console.log(`${str} is not defined!!`)
	}
}

e.on('exit', (str) => {
	process.exit(0);
})

e.on('help', (str) => {
	console.log(`
	${chalk.hex('#CD5156')('1')}. ${chalk.hex('#BB6A48')('if you need to help in node, go through')} ${chalk.hex('#3B70EB')('https://nodejs.org')}
	${chalk.hex('#CD5156')('2')}. ${chalk.hex('#BB6A48')('if you need to help in react, go through')} ${chalk.hex('#3B70EB')('https://reactjs.org')}
	${chalk.hex('#CD5156')('3')}. ${chalk.hex('#BB6A48')('if you need to help in react, go through')} ${chalk.hex('#3B70EB')('https://eloquentjavascript.net')}
	`)
})

function cliHorizontalLine(num) {
	console.log((chalk.hex('#FC7879')('-').repeat(num)));
}

function cliVerticalLine(num) {
	console.log((' ').repeat(num));
}

function cliManualCenter(str) {
	var padding = Math.floor((process.stdout.columns - str.length) / 2);
	var manualLine = '';
	for(let i = 0; i <= padding; i++) {
		manualLine += ' ';
	}
	return manualLine + str;
}


e.on('date', (str) => {
	let date = new Date();
	// let now = `${date.getDay()} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
	console.log(`${chalk.hex('#CD5156')(date)}`)
})

e.on('man', (str) => {
	cliHorizontalLine(process.stdout.columns);
	cliVerticalLine(5);
	let cliManual = 'CLI MANUAL';
	console.log(chalk.hex('#ECAE75')(cliManualCenter(cliManual)));
	cliVerticalLine(5);
	cliHorizontalLine(process.stdout.columns);

	for (let key in manObj) {
		var line = '';
		line = chalk.hex('#CD5156')(key);
		var padding = 62 - key.length;
		for(let i = 0; i <= padding; i++) {
			line += ' ';
		}
		line += chalk.hex('#BB6A48')(manObj[key]);
		console.log(line);
	}
})

// ==== OS Info ====

let cpuModel = os.cpus();
let osFreeMem = os.freemem();
let osTotalMem = os.totalmem();
let osPlatform = os.platform();

let osInfo = {
	'CPU MODEL': cpuModel[0].model,
	'FREE MEMORY': osFreeMem,
	'TOTAL MEMORY': osTotalMem,
	'OS PLATFORM': osPlatform
}

e.on('stats', (str) => {
	cliHorizontalLine(process.stdout.columns);
	cliVerticalLine(5);
	let cliManual = 'CPU INFO';
	console.log(chalk.hex('#ECAE75')(cliManualCenter(cliManual)));
	cliVerticalLine(5);
	cliHorizontalLine(process.stdout.columns);

	for (let key in osInfo) {
		let line = '';
		line = chalk.hex('#CD5156')(key);
		let padding = 62 - key.length;
		for (let i = 0; i <= padding; i++ ) {
			line += ' ';
		}
		line += chalk.hex('#BB6A48')(osInfo[key]);
		console.log(line);
	}
})

e.on('list users', (str) => {

	cliHorizontalLine(process.stdout.columns);
	cliVerticalLine(5);
	let cliManual = 'USER INFO';
	console.log(chalk.hex('#ECAE75')(cliManualCenter(cliManual)));
	cliVerticalLine(5);
	cliHorizontalLine(process.stdout.columns);

	fs.readdir(baseDir, (err, userDatas) => {
		if (!err) {
			userDatas.forEach((userData) => {
				fs.readFile(baseDir + '/' + userData, (err, data) => {
					if (!err) {
						let userFile = '';
						let stringifyData = data.toString();
						let parsedData = JSON.parse(stringifyData)
						userFile = `${chalk.hex('#CD5156')('Name')}: ${chalk.hex('#BB6A48')(parsedData.name)} ${chalk.hex('#CD5156')('username')}: ${chalk.hex('#BB6A48')(parsedData.username)} ${chalk.hex('#CD5156')('age')}: ${chalk.hex('#BB6A48')(parsedData.age)}`;
						console.log(userFile);
					} else {
						console.log('Could not read the file', err);
					}
				})
			})
		} else {
			console.log('Could not read the file', err);
		}
	})
})

e.on('more user info', (str) => {
	let splittedStr = str.split('--');
	let splitUser = splittedStr[1];
	fs.readFile(baseDir + '/' + splitUser + '.json', (err, data) => {
		if (!err) {
			let userFile = '';
			let stringifyData = data.toString();
			let parsedData = JSON.parse(stringifyData)
			userFile = `${chalk.hex('#CD5156')('Name')}: ${chalk.hex('#BB6A48')(parsedData.name)} ${chalk.hex('#CD5156')('username')}: ${chalk.hex('#BB6A48')(parsedData.username)} ${chalk.hex('#CD5156')('age')}: ${chalk.hex('#BB6A48')(parsedData.age)}`;
			console.log(userFile);
		} else {
			console.log('Could not read file', err);
		}
	})
})


module.exports = cli;