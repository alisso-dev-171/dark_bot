import { Command, CommandParams } from "../../models/commands";
import { CONFIG } from "../../config";

export default {
    name: "reels",
    description: "Baixa vídeos do Instagram Reels ou Posts",
    commands: ["reels", "ig", "baixar"],
    usage: `${CONFIG.PREFIX}reels https://www.instagram.com/reels/xyz/`,
    handle: async ({ args, sendText, sendVideo, getMediaInfo, sendWaitReact, sendSuccessReact, sendErrorReact }: CommandParams) => {
        const url = args[0];
        
        if (!url) {
            return await sendText("❌ Por favor, forneça um link.\nUso: !reels [link]");
        }

        try {
            await sendWaitReact(); 

            const mediaData = await getMediaInfo(url);
            const videoUrl = mediaData.items[0].video_versions?.[0]?.url;

            if (!videoUrl) throw new Error("Vídeo não encontrado.");

            await sendVideo(videoUrl);
            await sendSuccessReact();

        } catch (e: any) {
            await sendErrorReact();
            await sendText(`⚠️ Erro: ${e.message}`);
        }
    }
};
