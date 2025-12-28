import { readdirSync, watch } from 'fs';
import { join, resolve } from 'path';
import { logger } from '@utils/logger';

export const commandStore: { commands: any[] } = {
    commands: []
};

const commandsPath = resolve(__dirname, '../commands');

export const loadCommands = () => {
    const loaded: any[] = [];
    const categories = readdirSync(commandsPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const category of categories) {
        const categoryPath = join(commandsPath, category);
        const files = readdirSync(categoryPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of files) {
            const filePath = join(categoryPath, file);

            try {
                delete require.cache[require.resolve(filePath)];

                const commandModule = require(filePath);
                const command = commandModule.default || commandModule;

                if (command.name && command.handle) {
                    command.filePath = filePath;                     
                    loaded.push(command);
                }
            } catch (error: any) {
                logger.error(`Erro ao carregar ${file}: ${error.message}`);
            }
        }
    }

    commandStore.commands = loaded;
    return loaded;
};

export const startCommandWatcher = () => {
    loadCommands();
    logger.success(`🔥 ${commandStore.commands.length} comandos carregados.`);
};
