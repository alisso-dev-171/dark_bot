import chalk from 'chalk';
import { CONFIG } from '../config';

export const logger = {
    info: (msg: string) => console.log(chalk.blue(`[INFO] ${msg}`)),
    success: (msg: string) => console.log(chalk.green(`[SUCCESS] ${msg}`)),
    error: (msg: string) => console.log(chalk.red(`[ERROR] ${msg}`)),
    bot: (msg: string) => console.log(chalk.magenta(`[${CONFIG.BOT_NAME}] ${msg}`))
};
