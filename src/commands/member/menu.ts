import { createMenu } from "../../utils/menu";
import { PREFIX } from "../../config";
import path from "path";

export default {
    name: "menu",
    description: "Exibe o menu de comandos",
    commands: ["menu", "ajuda", "help"],
    usage: `${PREFIX}menu`,
    handle: async ({ sendImage, sendText, sendWaitReact }: any) => {
        await sendWaitReact();
        const logoPath = path.resolve(__dirname, "../../assets/images/logo.png");
        try {
            await sendImage(logoPath);            
            const menuText = createMenu();
            await sendText(menuText);
        } catch (e: any) {
            await sendText("Erro ao enviar menu (Verifique se a logo.png existe): " + e.message);
        }
    }
};
