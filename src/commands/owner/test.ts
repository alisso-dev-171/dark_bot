import { CONFIG } from '../../config';

export default {
    name: "test",
    description: "apenas um comando para teste.",
    commands: ["test", "ts", "teste", "testar"],
    usage: `${CONFIG.PREFIX}test`,
    handle: async ({ sendText, sendReact, sendVoice }: any) => {
        await sendReact("🤖"); 
        await sendText("Testando funções simplificadas...");
        
        // Se quiser enviar áudio:
        // await sendVoice("./meuaudio.mp3");
    }
};
