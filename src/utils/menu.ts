import { version } from "../../package.json";

export const createMenu = (prefix: string) => {

    return `
╭━━⪼ 🤖 MRX BOT MENU
┃
┃ 🔧 Utilitários
┃ ➥ ${prefix}ping
┃ ➥ ${prefix}raw
┃ ➥ ${prefix}reels
┃
┃ 👥 Grupo
┃ ➥ ${prefix}ban
┃ • Versão ${version}
╰━━⪼ 
`.trim();
};
