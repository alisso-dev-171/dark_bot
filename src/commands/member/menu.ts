import { createMenu } from "../../utils/menu";
import path from "path";
import { CONFIG } from "../../config";

export default {
    name: "menu",
    description: "Exibe o menu de comandos",
    commands: ["menu", "ajuda", "help"],
    handle: async ({ sendImage, sendText, sendWaitReact }: any) => {
        await sendWaitReact();

        // Caminho da logo
        const logoPath = path.resolve(__dirname, "../../assets/images/logo.png");

        try {
            // 1. Envia a Imagem
            await sendImage(logoPath);
            
            // 2. Envia o Texto do Menu
            const menuText = createMenu(CONFIG.PREFIX);
            await sendText(menuText);

        } catch (e: any) {
            await sendText("Erro ao enviar menu (Verifique se a logo.png existe): " + e.message);
        }
    }
};
