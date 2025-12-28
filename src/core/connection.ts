import { writeFileSync, readFileSync, existsSync } from 'fs';
import { IgApiClient } from 'instagram-private-api';
import { USERNAME, PASSWORD, SESSION_PATH } from '@src/config';
import { handleLoginErrors } from '@errors/checkpoints';
import { logger } from '@utils/logger';
import { question } from '@utils/index';

const ig = new IgApiClient();

export const connectInstagram = async (): Promise<IgApiClient> => {
    if (existsSync(SESSION_PATH)) {
        try {
            const sessionData = readFileSync(SESSION_PATH, 'utf-8');
            await ig.state.deserialize(sessionData);
            logger.success("✅ Sessão carregada do cache!");
            return ig;
        } catch (e) {
            logger.error("❌ Sessão corrompida. Fazendo login manual...");
        }
    }

    const user = USERNAME || await question("Seu Usuário");
    const pass = PASSWORD || await question("Sua Senha");

    ig.state.generateDevice(user);

    try {
        logger.info("🔐 Iniciando novo login...");
        await ig.simulate.preLoginFlow();
        const loggedInUser = await ig.account.login(user, pass);
        
        process.nextTick(async () => {
            try { await ig.simulate.postLoginFlow(); } catch (e) {}
        });

        logger.success(`✨ Logado como: @${loggedInUser.username}`);

        const serialized = await ig.state.serialize();
        delete serialized.constants;
        writeFileSync(SESSION_PATH, JSON.stringify(serialized));

        return ig;
    } catch (err: any) {
        try {
            await handleLoginErrors(ig, err);
            const serialized = await ig.state.serialize();
            delete serialized.constants;
            writeFileSync(SESSION_PATH, JSON.stringify(serialized));
            return ig;
        } catch (checkpointErr: any) {
            logger.error("❌ Falha no login: " + checkpointErr.message);
            process.exit(1);
        }
    }
};
