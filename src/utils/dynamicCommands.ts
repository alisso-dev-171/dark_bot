import { IgApiClient } from 'instagram-private-api';

import { getUserPermission, canExecute } from './checkPermission';
import { CommonFunctions } from './CommonFunctions';
import { PREFIX, COMMANDS_PATH } from '../config';
import { Command } from '../models/commands';

export const handleDynamicCommand = async (bot: IgApiClient, thread: any, message: any, commands: Command[]) => {
    const fullArgs = (message.text || message.caption || "").trim();
    if (!fullArgs.startsWith(PREFIX)) return;

    const args = fullArgs.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    const cmd = commands.find(c => c.name === commandName || (c.commands?.includes(commandName!)));
    if (!cmd) return;

    const utils = new CommonFunctions(bot);
    const userId = message.user_id;

    try {
        const userLevel = await getUserPermission(bot, thread, userId);

        if (!canExecute(userLevel, (cmd as any).filePath)) {
            await utils.sendReact(thread.thread_id, message.item_id, "🚫");
            await utils.sendText(thread.thread_id, `Você não tem permissão para executar este comando.`);
            return;
        }

        const injectedFunctions: any = {};
        const methods = Object.getOwnPropertyNames(CommonFunctions.prototype);
        methods.forEach(method => {
            if (method === 'constructor') return;
            injectedFunctions[method] = (...actualArgs: any[]) => {
                const methodLower = method.toLowerCase();
                if (methodLower.includes('react')) return (utils as any)[method](thread.thread_id, message.item_id, ...actualArgs);
                if (['getUptime', 'getMediaInfo'].includes(method)) return (utils as any)[method](...actualArgs);
                return (utils as any)[method](thread.thread_id, ...actualArgs);
            };
        });

        await cmd.handle({
            bot,
            args, 
            fullArgs, 
            remoteJid: thread.thread_id,
            messageId: message.item_id, 
            webMessage: message,
            ...injectedFunctions
        });

    } catch (error: any) {
        console.error(`[ERRO ${commandName}]:`, error.message);
    }
};
