import { IgApiClient } from 'instagram-private-api';

export interface CommandParams {
    bot: IgApiClient;
    args: string[];
    fullArgs: string;
    remoteJid: string;
    messageId: string;
    webMessage: any;
    sendText: (text: string) => Promise<any>;
    sendReact: (emoji: string) => Promise<any>;
    sendWaitReact: () => Promise<any>;
    sendSuccessReact: () => Promise<any>;
    sendErrorReact: () => Promise<any>;
    sendVideo: (pathOrBuffer: string | Buffer) => Promise<any>;
    sendImage: (pathOrBuffer: string | Buffer) => Promise<any>;
    getUptime: () => Promise<string>;
    getMediaInfo: (url: string) => Promise<any>;
}

export interface Command {
    name: string;
    description: string;
    commands: string[];
    usage: string;
    handle: (params: CommandParams) => Promise<void>;
}
