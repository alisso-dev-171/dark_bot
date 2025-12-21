import { IgApiClient } from 'instagram-private-api';
import { CONFIG } from '../config';
import { logger } from '../utils/logger';

export const listenMessages = async (ig: IgApiClient) => {
    logger.info("Escuta de mensagens iniciada (Modo Estável) - " + CONFIG.EVENT_IN_MILLISECONDS + "ms");
    
    const processedIds = new Set<string>();

    setInterval(async () => {
        try {
            // Usando directInbox().items() de forma filtrada ou directThread
            // Para evitar o erro 404 de suggested_searches, acessamos os itens diretamente
            const inboxFeed = ig.feed.directInbox();
            const threads = await inboxFeed.items();

            for (const thread of threads) {
                // Pegamos a última mensagem da conversa
                const lastMessage = thread.items[0];

                if (!lastMessage || lastMessage.item_type !== 'text') continue;
                if (processedIds.has(lastMessage.item_id)) continue;

                const text = lastMessage.text;

                if (text.startsWith(CONFIG.PREFIX)) {
                    const args = text.slice(CONFIG.PREFIX.length).trim().split(/ +/);
                    const commandName = args.shift()?.toLowerCase();
                    
                    logger.bot(`Comando [${commandName}] de: ${thread.users[0].username}`);

                    if (commandName === 'ping') {
                        // Resposta direta na thread
                        await ig.entity.directThread(thread.thread_id).broadcastText('🏓 Pong! O bot do Mrx está voando! 🚀');
                        logger.success(`Resposta enviada para ${thread.users[0].username}`);
                    }
                    
                    // Salva como processada
                    processedIds.add(lastMessage.item_id);
                }
            }

            // Limpeza de cache para não estourar a memória do Termux
            if (processedIds.size > 100) processedIds.clear();

        } catch (e: any) {
            // Ignora erros de 404 de busca sugerida, foca no que importa
            if (!e.message.includes('404')) {
                logger.error("Erro no pooling: " + e.message);
            }
        }
    }, CONFIG.EVENT_IN_MILLISECONDS);
};
