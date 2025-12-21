import { connectInstagram } from './core/connection';
import { startPolling } from './core/monitor'; // Alterado para polling
import { readAndImportCommands } from './utils/index';
import { logger } from './utils/logger';
import path from 'path';

export const initBot = async () => {
    try {
        const ig = await connectInstagram();
        
        logger.info("Carregando comandos...");
        const commandsPath = path.resolve(__dirname, './commands');
        const loadedCommands = await readAndImportCommands(commandsPath);

        // Inicia o Polling
        await startPolling(ig, loadedCommands);

    } catch (err) {
        logger.error("Erro no Loader: " + err);
    }
};
