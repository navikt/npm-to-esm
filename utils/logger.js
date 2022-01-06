const chalk = require('chalk');

class Logger {
    success(msg, ...args) {
        console.info(chalk.green(msg), ...args);
    }

    info(msg, ...args) {
        console.info(chalk.blue(msg), ...args);
    }

    error(msg, ...args) {
        console.error(chalk.red(msg), ...args);
    }

    warn(msg, ...args) {
        console.error(chalk.yellow(msg), ...args);
    }

    warnBold(msg, ...args) {
        console.error(chalk.yellow.bold(msg), ...args);
    }
}

module.exports = new Logger();
