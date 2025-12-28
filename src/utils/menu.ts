import { PREFIX, BOT_NAME, VERSION, OWNER_AT } from '@src/config';
import { current_time, current_date } from ".";

export const createMenu = () => {
    return `
╭━━⪼ 🤖 ${BOT_NAME.toUpperCase()}
┃
┃ • BEM-VINDO!
┃
┃ • DATA: ${current_date()}
┃ • HORA: ${current_time()}
┃
┃ • prefixo: [ ${PREFIX} ]
┃
┃ 🫅🏻 DOMO
┃ ➥ ${PREFIX}on
┃ ➥ ${PREFIX}off
┃ ➥ ${PREFIX}test
┃
┃ ❇️ COMANDOS
┃ ➥ ${PREFIX}ping
┃ ➥ ${PREFIX}raw
┃ ➥ ${PREFIX}menu
┃ ➥ ${PREFIX}get-id
┃ ➥ ${PREFIX}perfil
┃
┃ 👑 ADMINS
┃ ➥ ${PREFIX}anti-link
┃ 
┃ ℹ️ Info
┃ ➥ Versão: ${VERSION}
┃ ➥ Owner: ${OWNER_AT}
╰━━⪼
`.trim();
};
