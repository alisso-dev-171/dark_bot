import { Command, CommandParams } from "@models/commands";
import { setAntiLinkData, getAntiLinkData } from "@utils/database";
import { PREFIX } from "@src/config";

export default {
    name: "anti-link",
    description: "Ativa ou desativa o sistema de anti-link no grupo",
    commands: ["antilink", "anti-link", "sem-link"],
    usage: `${PREFIX}antilink [on/off]`,
    handle: async ({ args, remoteJid, sendText, sendSuccessReact, sendWarningReact }: CommandParams) => {
        const status = args[0]?.toLowerCase();

        if (status !== "on" && status !== "off") {
            await sendWarningReact();
            await sendText("⚠️ Use: `!antilink on` para ativar ou `!antilink off` para desativar.");
            return;
        }

        const isActive = status === "on";
        setAntiLinkData(remoteJid, isActive);

        await sendSuccessReact();
        await sendText(`🛡️ Sistema Anti-Link ${isActive ? "ATIVADO ✅" : "DESATIVADO ❌"}`);
    }
};
