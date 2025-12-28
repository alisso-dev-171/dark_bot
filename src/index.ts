import { onMessagesUpsert } from '@middlewares/onMessagesUpsert';
import { startCommandWatcher } from "@utils/commandLoader";
import { connectInstagram } from '@core/connection';
import { startHotReload } from '@utils/hotReload';
import { logger } from '@utils/logger';

export const BOOT_TIME = Date.now();
let isStarted = false;

const startBot = async () => {
    if (isStarted) return;
    isStarted = true;

    try {
        logger.info("🚀 Iniciando o bot...");
        const bot = await connectInstagram();        
        await bot.account.currentUser(); 

        startCommandWatcher();

        onMessagesUpsert(bot);
       	startHotReload(bot);

    } catch (err: any) {
        logger.error("🛑 Erro Fatal: " + err.message);
        if (err.message.includes("sessionid")) {
             logger.warn("Sessão inválida. Delete o arquivo session.json e reinicie.");
        }
        isStarted = false;
    }
};

startBot();
