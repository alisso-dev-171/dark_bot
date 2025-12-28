import { PREFIX } from '../../config';

export default {
    name: "test",
    description: "apenas um comando para teste.",
    commands: ["test", "ts", "teste", "testar"],
    usage: `${PREFIX}test`,
    handle: async ({ remoteJid, bot, sendText, sendAudio, sendReact, sendVoice }: any) => {
        await sendReact("🤖"); 
        await sendText("Testando funções simplificadas...");

        // Se quiser enviar áudio:
        await sendAudio("../../assets/audios/audio-test.mp3");
    }
};
