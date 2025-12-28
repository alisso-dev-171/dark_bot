import chalk from 'chalk';
import { BOT_NAME } from '../config';

export const logger = {
    info: (msg: string) => console.log(chalk.blue(`[INFO] ${msg}`)),
    success: (msg: string) => console.log(chalk.green(`[SUCCESS] ${msg}`)),
    error: (msg: string) => console.log(chalk.red(`[ERROR] ${msg}`)),
    warn: (msg: string) => console.log(chalk.yellow(`[WARN] ${msg}`)),
    bot: (msg: string) => console.log(chalk.magenta(`[${BOT_NAME}] ${msg}`))
};
