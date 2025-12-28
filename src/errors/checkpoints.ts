import { IgApiClient, IgCheckpointError } from 'instagram-private-api';
import { logger } from '../utils/logger';
import { question } from '../utils';

export const handleCheckpoint = async (ig: IgApiClient, err: IgCheckpointError) => {
    logger.warn("🛡️ Desafio de Segurança detectado!");

    // O Instagram pede para ler o checkpoint
    await ig.challenge.selectVerifyMethod('1'); // '0' para SMS, '1' para Email (geralmente)
    
    const code = await question("Digite o código de verificação enviado pelo Instagram: ");
    
    try {
        await ig.challenge.sendSecurityCode(code);
        logger.success("✅ Desafio resolvido com sucesso!");
    } catch (e: any) {
        logger.error("❌ Código inválido ou erro no desafio: " + e.message);
        throw e;
    }
};

export const handleLoginErrors = async (ig: IgApiClient, err: any) => {
    if (err instanceof IgCheckpointError) {
        return await handleCheckpoint(ig, err);
    }
    
    if (err.message.includes("challenge_required")) {
        logger.info("🔧 Iniciando fluxo de desafio manual...");
        await ig.challenge.auto(true); 
        const code = await question("Código do Desafio: ");
        return await ig.challenge.sendSecurityCode(code);
    }

    throw err;
};
