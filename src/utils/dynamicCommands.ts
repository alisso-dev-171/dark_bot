import { IgApiClient } from 'instagram-private-api';
import { CONFIG } from '../config';
import { CommonFunctions } from './CommonFunctions';
import { Command } from '../models/commands';

export const handleDynamicCommand = async (bot: IgApiClient, thread: any, message: any, commands: Command[]) => {
    // Pegamos o texto puro
    const fullArgs = message.text || message.caption || "";
    if (!fullArgs.startsWith(CONFIG.PREFIX)) return;

    const args = fullArgs.slice(CONFIG.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    const cmd = commands.find(c => c.name === commandName || (c.commands && c.commands.includes(commandName)));
    if (!cmd) return;

    const utils = new CommonFunctions(bot);
    const threadId = thread.thread_id;
    const messageId = message.item_id;

    try {
        const injectedFunctions: any = {};
        const methods = Object.getOwnPropertyNames(CommonFunctions.prototype);

        methods.forEach(method => {
            if (method !== 'constructor') {
                // ADICIONEI 'sendWarningReact' aqui na lista!
                const needsMessageId = [
                    'sendReact',
                    'sendWaitReact',
                    'sendSuccessReact',
                    'sendErrorReact',
                    'sendWarningReact'
                ];

                injectedFunctions[method] = (...actualArgs: any[]) => {
                    if (needsMessageId.includes(method)) {
                        return (utils as any)[method](threadId, messageId, ...actualArgs);
                    }
                    return (utils as any)[method](threadId, ...actualArgs);
                };
            }
        });

        await cmd.handle({
            bot,
            args,
            fullArgs, // Link e @ chegam puros aqui agora
            remoteJid: threadId,
            messageId,
            webMessage: message,
            ...injectedFunctions
        });

    } catch (error: any) {
        console.error(`[ERRO NO COMANDO ${commandName}]:`, error.message);
    }
};
