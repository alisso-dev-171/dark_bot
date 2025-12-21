import { IgApiClient } from 'instagram-private-api';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { CONFIG } from '../config';
import { logger } from '../utils/logger';
import * as readline from 'readline';

const ig = new IgApiClient();
const SESSION_PATH = './src/assets/auth/session.json';

const ask = (question: string): Promise<string> => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(question, answer => {
        rl.close();
        resolve(answer);
    }));
};

export const connectInstagram = async (): Promise<IgApiClient> => {
    if (existsSync(SESSION_PATH)) {
        try {
            logger.info("Restaurando sessão...");
            const sessionData = readFileSync(SESSION_PATH, 'utf-8');
            await ig.state.deserialize(sessionData);
            await ig.account.currentUser();
            logger.success("Sessão ativa!");
            return ig;
        } catch (e) {
            logger.error("Sessão inválida. Novo login necessário.");
        }
    }

    const user = CONFIG.USERNAME || await ask("Usuário: ");
    const pass = CONFIG.PASSWORD || await ask("Senha: ");
    ig.state.generateDevice(user);

    try {
        await ig.simulate.preLoginFlow();
        const loggedInUser = await ig.account.login(user, pass);
        logger.success(`Logado como: @${loggedInUser.username}`);

        // Sincronização segura
        await ig.account.currentUser();
        
        const serialized = await ig.state.serialize();
        writeFileSync(SESSION_PATH, JSON.stringify(serialized));
        
        return ig;
    } catch (err: any) {
        logger.error("Erro no login: " + err.message);
        process.exit(1);
    }
};
