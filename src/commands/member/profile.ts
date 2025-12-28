import { Command } from "../../models/commands";
import { logger } from "../../utils/logger";
import { PREFIX } from "../../config";
import path from "path";
import fs from "fs";

export default {
    name: "perfil",
    description: "Mostra informações de um perfil",
    commands: ["perfil", "profile"],
    usage: `${PREFIX}perfil [username]`,
    handle: async ({
        args,
        bot,
        sendText,
        sendImage,
        sendWaitReact,
        sendErrorReact,
        sendSuccessReact
    }) => {
        try {
            await sendWaitReact();

            const username = args[0]?.replace('@', '') || (await bot.account.currentUser()).username;

            let userId;
            let user: any;
            try {
                userId = await bot.user.getIdByUsername(username);
                user = await bot.user.info(userId);
            } catch (apiErr) {
                logger.error("Erro na API do Instagram: " + apiErr);
                await sendText("⚠️ Não foi possível conectar ao servidor do Instagram agora.");
                return;
            }

            if (!user) {
                await sendText("⚠️ Usuário não encontrado.");
                return;
            }

            const beleza = Math.floor(Math.random() * 101);

            const caption = [
                `${user.full_name || 'Sem nome'}\n`,
                `\n• 👤 Nome: @${user.username}`,
                `\n• 📝 Bio: ${user.biography ? user.biography : "sem bio"}`,
                `\n• 🔐 Privado: ${user.is_private ? 'Sim' : 'Não'}`,
                "\n📊 ESTATISTICAS",
                `\n• 👥 Seguidores: ${user.follower_count?.toLocaleString('pt-BR') || 0}`,
                `\n• 🏃 Seguindo: ${user.following_count?.toLocaleString('pt-BR') || 0}`,
                `\n• 📸 Posts: ${user.media_count?.toLocaleString('pt-BR') || 0}`,
                `\n• ✨ Beleza: ${beleza}%`,
                `\n• 📈 Chance de te dar vácuo: ${Math.floor(Math.random() * 100)}%`
            ].filter(line => line !== null).join('\n');

            const defaultImagePath = path.resolve(__dirname, "../../assets/images/default-user.png");
            const photoUrl = user.is_private ? null : (user.hd_profile_pic_url_info?.url || user.profile_pic_url);

            try {
                if (photoUrl && !user.is_private) {
                    await sendImage(photoUrl);
                } else {
                    if (fs.existsSync(defaultImagePath)) {
                        await sendImage(defaultImagePath);
                    }
                }
                await sendSuccessReact();
            } catch (imgErr) {
                logger.error("Erro ao enviar imagem: " + imgErr);
                if (fs.existsSync(defaultImagePath)) await sendImage(defaultImagePath);
            }

            await sendText(caption);

        } catch (err: any) {
            logger.error("❌ Erro no comando perfil: " + err.message);
            await sendErrorReact();
            await sendText("❌ Houve um erro interno ao processar este perfil.");
        }
    }
} as Command;
