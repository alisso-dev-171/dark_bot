import { watch } from 'fs';
import { resolve, sep } from 'path';
import { IgApiClient } from 'instagram-private-api';
import { logger } from '@utils/logger';

const SRC_DIR = resolve(__dirname, '..');

export const startHotReload = (bot: IgApiClient) => {
    logger.info("🌐 Hot Reload Global Ativado! Monitorando alterações...");

    let isReloading = false;

    const reloadAll = async (filename: string) => {
        if (isReloading) return;
        isReloading = true;

        console.log('\n');
        logger.warn(`📝 Alteração detectada: ${filename}`);

        try {
            Object.keys(require.cache).forEach((id) => {
                if (id.includes(`${sep}src${sep}`) && 
                    !id.includes('node_modules') && 
                    !id.includes('connection') && 
                    !id.includes('index')) {
                    delete require.cache[id];
                }
            });

            const { loadCommands, commandStore } = require('./commandLoader');
            const newCommands = loadCommands();
            commandStore.commands = newCommands;

            const middlewarePath = require.resolve('../middlewares/onMessagesUpsert');
            const { stopMessagesUpsert, onMessagesUpsert } = require(middlewarePath);
            
            stopMessagesUpsert();
            onMessagesUpsert(bot);

            logger.success("✅ Sistema atualizado com sucesso!");

        } catch (err: any) {
            logger.error("❌ Erro ao recarregar: " + err.message);
        } finally {
            setTimeout(() => { isReloading = false; }, 500);
        }
    };

    watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
        if (!filename) return;
        
        if (filename.endsWith('.ts') || filename.endsWith('.js')) {
            reloadAll(filename);
        }
    });
};
