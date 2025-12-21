import { IgApiClient } from 'instagram-private-api';
import { readFileSync } from 'fs';
import { BOOT_TIME } from "../index"
import { 
	getBuffer, 
	formatUptime,
	extractShortcode 
} from '.';

export class CommonFunctions {
    constructor(private bot: IgApiClient) {}

    async getUptime() {
        return formatUptime(Date.now() - BOOT_TIME);
    }

    async getMediaInfo(url: string) {
        extractShortcode(url);
        const mediaId = await (this.bot as any).media.urlToId(url);
        return await this.bot.media.info(mediaId);
    }

    // --- MENSAGENS E REAÇÕES ---
    async sendText(threadId: string, text: string) {
        return await this.bot.entity.directThread(threadId).broadcastText(text);
    }

    async sendReact(threadId: string, messageId: string, emoji: string) {
        return await (this.bot as any).request.send({
            url: `/api/v1/direct_v2/threads/broadcast/reaction/`,
            method: 'POST',
            form: {
                thread_ids: `[${threadId}]`,
                item_id: messageId,
                reaction_type: 'emoji',
                reaction_status: 'created',
                emoji: emoji,
                client_context: (Math.random() * 1e16).toString(),
                node_type: 'item'
            }
        });
    }

    async sendWaitReact(threadId: string, messageId: string) {
        return await this.sendReact(threadId, messageId, "⏳");
    }

    async sendWarningReact(threadId: string, messageId: string) {
        return await this.sendReact(threadId, messageId, "⚠️");
    }

    async sendSuccessReact(threadId: string, messageId: string) {
        return await this.sendReact(threadId, messageId, "✅");
    }

    async sendErrorReact(threadId: string, messageId: string) {
        return await this.sendReact(threadId, messageId, "❌");
    }

    // --- ENVIO DE MÍDIA ---
    async sendVideo(threadId: string, pathOrBuffer: string | Buffer) {
        let finalVideo: Buffer;

        if (Buffer.isBuffer(pathOrBuffer)) {
            finalVideo = pathOrBuffer;
        } else if (pathOrBuffer.startsWith('http')) {
            finalVideo = await getBuffer(pathOrBuffer);
        } else {
            finalVideo = readFileSync(pathOrBuffer);
        }

        return await this.bot.entity.directThread(threadId).broadcastVideo({ video: finalVideo });
    }

    async sendImage(threadId: string, pathOrBuffer: string | Buffer) {
        const file = typeof pathOrBuffer === 'string' 
            ? (pathOrBuffer.startsWith('http') ? await getBuffer(pathOrBuffer) : readFileSync(pathOrBuffer))
            : pathOrBuffer;
            
        return await this.bot.entity.directThread(threadId).broadcastPhoto({ file: file as Buffer });
    }
}
