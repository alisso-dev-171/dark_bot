import { IgApiClient } from 'instagram-private-api';
import { handleDynamicCommand } from '@utils/dynamicCommands';
import { commandStore } from '@utils/commandLoader';
import { PREFIX } from '@src/config';
import { logger } from '@utils/logger';

const processedMessages = new Set<string>();

export const onMessagesUpsert = async (ig: IgApiClient) => {
    logger.warn("🔄 Modo Polling (Intervalo) Reativado.");

    setInterval(async () => {
        try {
            const inbox = ig.feed.directInbox();
            const threads = await inbox.items();

            for (const thread of threads) {
                const message = thread.items[0];

                if (!message || String(message.user_id) === String(ig.state.cookieUserId)) continue;
                if (processedMessages.has(message.item_id)) continue;

                const text = (message.text || "").trim();

                if (text.startsWith(PREFIX)) {
                    logger.info(`[INBOX] Mensagem de @${message.user_id}: ${text}`);
                    processedMessages.add(message.item_id);
                    await handleDynamicCommand(ig, thread, message, commandStore.commands);
                }

                // Limpa memória
                if (processedMessages.size > 150) {
                    const iterator = processedMessages.values();
                    processedMessages.delete(iterator.next().value);
                }
            }
        } catch (e: any) {
            if (!e.message.includes("403")) {
                logger.error("Erro no Polling: " + e.message);
            }
        }
    }, 3500); // 3.5 segundos é o equilíbrio entre velocidade e segurança

    logger.success("🚀 Bot pronto e ouvindo via Inbox!");
};

export const stopMessagesUpsert = () => {
    logger.warn("🛑 Listener parado.");
};
