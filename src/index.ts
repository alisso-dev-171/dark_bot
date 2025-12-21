import { connectInstagram } from './core/connection';
import { startPolling } from './core/monitor';
import { startCommandWatcher } from './utils/commandLoader';
import { logger } from './utils/logger';

export const BOOT_TIME = Date.now();

const main = async () => {
    try {
        logger.info("🚀 Iniciando Bot");
        const bot = await connectInstagram();
        startCommandWatcher();
        await startPolling(bot);
    } catch (err) {
        logger.error("Erro Fatal: " + err);
        process.exit(1);
    }
};

main();
