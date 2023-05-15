import chalk from "chalk";

export enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR"
}

export class Logger {
    constructor(
        private readonly name: string
    ) {}

    error(message: string) {
        console.log(`${chalk.red(`[${new Date().toLocaleString()}] [${LogLevel.ERROR}] [${this.name}]`)} ${message}`);
    }

    warn(message: string) {
        console.log(`${chalk.yellow(`[${new Date().toLocaleString()}] [${LogLevel.WARN}] [${this.name}]`)} ${message}`);
    }

    info(message: string) {
        console.log(`${chalk.green(`[${new Date().toLocaleString()}] [${LogLevel.INFO}] [${this.name}]`)} ${message}`);
    }

    debug(message: string) {
        console.log(`${chalk.blue(`[${new Date().toLocaleString()}] [${LogLevel.DEBUG}] [${this.name}]`)} ${message}`);
    }
}