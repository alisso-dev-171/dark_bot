import { IgApiClient } from 'instagram-private-api';
import { CommonFunctions } from '@utils/CommonFunctions';

type CommonMethods = Omit<CommonFunctions, 'bot'>;

type NoIdMethods = 'getUptime' | 'getMediaInfo';

type InjectedUtils = {
    [K in keyof CommonMethods]: CommonMethods[K] extends (...args: infer P) => infer R
        ? (
            K extends `${string}React${string}` 
            ? (...args: P extends [any, any, ...infer Rest] ? Rest : P) => R
            
            : K extends NoIdMethods
            ? (...args: P) => R

            : (...args: P extends [any, ...infer Rest] ? Rest : P) => R
          )
        : CommonMethods[K];
};

export interface CommandParams extends InjectedUtils {
    bot: IgApiClient;
    args: string[];
    fullArgs: string;
    remoteJid: string;
    messageId: string;
    webMessage: any;
}

export interface Command {
    name: string;
    description: string;
    commands: string[];
    usage?: string;
    filePath?: string;
    handle: (params: CommandParams) => Promise<void>;
}
