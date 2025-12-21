import { readdirSync, watch } from 'fs';
import { join, resolve } from 'path';
import { logger } from './logger';

// Container mutável que guarda os comandos
export const commandStore: { commands: any[] } = {
    commands: []
};

const commandsPath = resolve(__dirname, '../commands');

// Função para importar comandos (limpando o cache)
const loadCommands = () => {
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
                // 1. Limpa o cache do Node.js para este arquivo
                delete require.cache[require.resolve(filePath)];
                
                // 2. Importa novamente
                const commandModule = require(filePath);
                const command = commandModule.default || commandModule;

                if (command.name && command.handle) {
                    loaded.push(command);
                }
            } catch (error: any) {
                logger.error(`Erro ao carregar ${file}: ${error.message}`);
            }
        }
    }
    
    // Atualiza a lista global
    commandStore.commands = loaded;
    return loaded;
};

// Inicia o monitoramento de arquivos
export const startCommandWatcher = () => {
    // 1. Carga inicial
    loadCommands();
    logger.success(`🔥 ${commandStore.commands.length} comandos carregados.`);

    // 2. Observar mudanças na pasta
    logger.info("📡 Observando alterações nos comandos (Hot Reload)...");
    
    watch(commandsPath, { recursive: true }, (eventType, filename) => {
        if (filename && (filename.endsWith('.ts') || filename.endsWith('.js'))) {
            logger.info(`📝 Alteração detectada em: ${filename}. Recarregando...`);
            
            // Pequeno delay para evitar erro de leitura enquanto salva
            setTimeout(() => {
                loadCommands();
                logger.success(`🔄 Comandos atualizados! Total: ${commandStore.commands.length}`);
            }, 1000);
        }
    });
};
