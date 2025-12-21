import { Command, CommandParams } from "../../models/commands";

export default {
    name: "ping",
    description: "Verifica a latência e o tempo online do bot",
    commands: ["ping", "pong"],
    usage: "!ping ou !pong",
    handle: async ({ sendText, sendReact, getUptime, fullArgs }: CommandParams) => {
        const start = Date.now();
        
        const isPing = fullArgs.toLowerCase().includes("ping");
        const emoji = isPing ? "🏓" : "🎾";
        const title = isPing ? "Pong!" : "Ping!";

        await sendReact(emoji);

        const uptime = await getUptime();
        const latency = Date.now() - start;

        const message = `${emoji} ${title}\n\n` +
                        `🕒 Online há: ${uptime}\n` +
                        `⚡ Velocidade de resposta: ${latency} ms\n\n`
        await sendText(message);
    }
};
