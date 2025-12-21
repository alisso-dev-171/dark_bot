import { IgApiClient } from 'instagram-private-api';
import { logger } from '../utils/logger';
import { handleDynamicCommand } from '../utils/dynamicCommands';
import { commandStore } from '../utils/commandLoader';

const processedIds = new Set<string>();

export const startPolling = async (bot: IgApiClient) => {
    logger.info("🛡️ Monitoramento Anti-Ban iniciado...");

    setInterval(async () => {
        try {
            const inbox = await bot.feed.directInbox().items();
            for (const thread of inbox) {
                // Convertemos para 'any' para o TS permitir acessar .text ou .caption
                const lastMsg = thread.items[0] as any;

                if (!lastMsg || processedIds.has(lastMsg.item_id)) continue;

                processedIds.add(lastMsg.item_id);
                if (processedIds.size > 100) {
                    const first = processedIds.values().next().value;
                    processedIds.delete(first);
                }

                // Agora o TS não vai reclamar da propriedade 'caption'
                const text = lastMsg.text || lastMsg.caption || "";

                if (text.startsWith("!")) {
                    logger.bot(`Comando: ${text}`);
                    await handleDynamicCommand(bot, thread, lastMsg, commandStore.commands);
                }
            }
        } catch (e: any) {
            if (!e.message.includes("503") && !e.message.includes("429")) {
                logger.error("Polling: " + e.message);
            }
        }
    }, 5000); 
};
