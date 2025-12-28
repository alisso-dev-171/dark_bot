import { Command, CommandParams } from "../../models/commands";
import { PREFIX } from "../../config";

export default {
    name: "get-id",
    description: "Pega o ID de um usuário por resposta ou menção",
    commands: ["id", "uid"],
    usage: `${PREFIX} getid (responda a alguém ou mencione @user)`,
    handle: async ({ args, webMessage, sendText, sendSuccessReact, sendWarningReact }: CommandParams) => {
        try {
            let targetId: string | undefined;
            let targetUsername: string = "Usuário";

            if (webMessage.replied_to_message) {
                targetId = webMessage.replied_to_message.user_id.toString();
                targetUsername = `${targetId}`;
            } 
            
            else if (args.length > 0 && args[0].startsWith('@')) {
                if (webMessage.mentions && webMessage.mentions.length > 0) {
                    targetId = webMessage.mentions[0].user_id.toString();
                    targetUsername = args[0];
                }
            }

            if (!targetId) {
                await sendWarningReact();
                await sendText("⚠️ Você precisa responder a uma mensagem ou mencionar alguém com @ para eu pegar o ID.");
                return;
            }

            await sendSuccessReact();
            await sendText(`🆔 Informações do Usuário:\n\n👤 User: ${targetUsername}\n🔢 ID: \`${targetId}\``);

        } catch (e: any) {
            console.error("[GETID ERROR]:", e.message);
            await sendText(`❌ Erro ao obter ID: ${e.message}`);
        }
    }
};
