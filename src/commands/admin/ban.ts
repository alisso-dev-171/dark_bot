import { CONFIG } from "../../config";
import { logger } from "../../utils/logger";

export default {
    name: "ban",
    description: "Remove um membro do grupo.",
    commands: ["ban", "remover", "kick"],
    usage: `${CONFIG.PREFIX}ban @usuario`,
    handle: async ({ bot, remoteJid, args, sendText, sendWaitReact, sendErrorReact, sendSuccessReact }: any) => {
        const targetUser = args[0]?.replace("@", "");

        if (!targetUser) {
            return await sendText("❓ Você precisa mencionar o @ de quem deseja remover.");
        }

        try {
            await sendWaitReact();

            // 1. Pega o ID
            const userId = await bot.user.getIdByUsername(targetUser);

            // 2. Remove usando a Entidade e passando ARRAY de IDs
            // O [userId] é o pulo do gato aqui
            await bot.entity.directThread(remoteJid).removeUser([userId.toString()]);

            await sendSuccessReact();
            await sendText(`🚫 @${targetUser} removido.`);
            logger.success(`Usuário ${targetUser} banido da thread ${remoteJid}`);

        } catch (e: any) {
            logger.error("Erro ao banir: " + e.message);
            await sendErrorReact();
            
            if (e.message.includes("admin")) {
                await sendText("❌ Preciso ser ADM do grupo para fazer isso.");
            } else {
                await sendText("⚠️ Erro: " + e.message);
            }
        }
    }
};
