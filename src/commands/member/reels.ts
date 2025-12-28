import { Command } from "../../models/commands";
import { logger } from "../../utils/logger";
import { PREFIX } from "../../config";

export default {
    name: "reels",
    commands: ["ig", "baixar", "video", "reel"],
    description: "Baixa vídeos e fotos do Instagram/Reels",
    usage: `${PREFIX}ig [link]`,
    handle: async ({ 
        args, 
        sendText, 
        sendVideo, 
        sendImage, 
        getMediaInfo, 
        sendWaitReact, 
        sendSuccessReact, 
        sendErrorReact 
    }) => {
        const rawUrl = args[0];

        if (!rawUrl) {
            await sendText("⚠️ Envie o link do Reels ou Post. Ex: !ig https://instagram.com/p/...");
            return;
        }

        if (!rawUrl.includes("instagram.com")) {
            await sendText("❌ Isso não parece um link do Instagram.");
            return;
        }

        try {
            await sendWaitReact();
            logger.info(`📥 Iniciando download: ${rawUrl}`);

            // 2. Limpeza básica da URL (mantém o https)
            const url = rawUrl.trim();

            // 3. Obtendo Mídia
            const media: any = await getMediaInfo(url);

            if (!media || !media.url) {
                throw new Error("API retornou dados vazios.");
            }

            logger.info(`✅ Mídia encontrada! Tipo: ${media.isVideo ? 'Vídeo' : 'Imagem'}`);

            // 4. Envio
            if (media.isVideo) {
                await sendVideo(media.url);
            } else {
                await sendImage(media.url);
            }

            await sendSuccessReact();

        } catch (e: any) {
            logger.error(`[IG ERROR]: ${e.message}`);
            await sendErrorReact();

            if (e.message.includes("privada") || e.message.includes("Login required")) {
                await sendText("🔒 Esta conta é privada ou o link expirou.");
            } else if (e.message.includes("Timeout")) {
                await sendText("⏱️ O Instagram demorou para responder. Tente novamente.");
            } else {
                await sendText(`❌ Erro ao baixar: ${e.message}`);
            }
        }
    }
} as Command;
