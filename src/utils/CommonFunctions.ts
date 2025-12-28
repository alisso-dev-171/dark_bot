import { IgApiClient } from 'instagram-private-api';
import { readFileSync, existsSync } from 'fs';
import { inspect } from 'util';
import path from "path";

import { getBuffer, formatUptime } from '@utils/index';
import { BOOT_TIME } from "@src/index";

let instagramGetUrl: any;
try {
    instagramGetUrl = require('instagram-url-direct');
} catch (e) {
    instagramGetUrl = null;
    console.error("❌ ERRO: A biblioteca 'instagram-url-direct' não está instalada.");
}

export class CommonFunctions {
    constructor(private bot: IgApiClient) {}

    /**
     * STATUS E INFO
     */
    async getUptime() {
        return formatUptime(Date.now() - BOOT_TIME);
    }

    /**
     * SCRAPER DE MÍDIA (REELS, POSTS, IGTV)
     */
    async getMediaInfo(url: string) {
        try {
            const scraper = instagramGetUrl.default || instagramGetUrl;
            const results = await scraper(url);

            if (!results?.url_list?.[0]) {
                throw new Error("Link não encontrado ou mídia privada.");
            }

            return {
                url: results.url_list[0],
                isVideo: results.url_list[0].includes('.mp4'),
                results: results
            };
        } catch (error) {
            throw new Error("Erro ao obter info da mídia. O link pode estar quebrado ou a conta é privada.");
        }
    }

    /**
     * MENSAGENS E REAÇÕES
     */
    async sendText(threadId: string, text: string) {
        const cleanText = text.replace(/\*|_|~/g, '');
        return await this.bot.entity.directThread(threadId).broadcastText(cleanText);
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

    // Atalhos de reação
    async sendWaitReact(tId: string, mId: string) { return this.sendReact(tId, mId, "⏳").catch(() => {}); }
    async sendWarningReact(tId: string, mId: string) { return this.sendReact(tId, mId, "⚠️").catch(() => {}); }
    async sendSuccessReact(tId: string, mId: string) { return this.sendReact(tId, mId, "✅").catch(() => {}); }
    async sendErrorReact(tId: string, mId: string) { return this.sendReact(tId, mId, "❌").catch(() => {}); }

    // Métodos Combinados: Texto + Reação
    async sendSuccessText(threadId: string, messageId: string, text: string) {
        await this.sendSuccessReact(threadId, messageId);
        return this.sendText(threadId, `✅ ${text}`);
    }

    async sendWarningText(threadId: string, messageId: string, text: string) {
        await this.sendWarningReact(threadId, messageId);
        return this.sendText(threadId, `⚠️ ${text}`);
    }

    async sendErrorText(threadId: string, messageId: string, text: string) {
        await this.sendErrorReact(threadId, messageId);
        return this.sendText(threadId, `❌ ${text}`);
    }

    /**
     * MÚSICA - BUSCA
     */
    async searchMusic(query: string, limit: number = 9) {
        const { body } = await (this.bot as any).request.send({
            url: '/api/v1/music/search/',
            method: 'POST',
            form: {
                _csrftoken: this.bot.state.cookieCsrfToken,
                _uuid: this.bot.state.uuid,
                _uid: this.bot.state.cookieUserId,
                q: query,
                query: query,
                product: 'story_camera_music_overlay_post_capture',
                browse_session_id: this.bot.state.clientSessionId,
                search_session_id: this.bot.state.uuid 
            },
        });

        const items = body.items || body.tracks || [];
        return items.slice(0, limit).map((item: any) => {
            const t = item.track || item;
            const duracaoS = Math.floor((t.duration_in_ms || 0) / 1000);
            return {
                title: t.title,
                artist: t.display_artist || t.artist_name || 'Desconhecido',
                duration: `${Math.floor(duracaoS / 60)}:${(duracaoS % 60).toString().padStart(2, '0')}`,
                audioClusterId: t.audio_cluster_id,
                id: t.id,
                url: t.progressive_download_url
            };
        });
    }

    /**
     * ENVIO DE MÍDIAS
     */
    async sendImage(threadId: string, pathOrBuffer: string | Buffer) {
        const file = typeof pathOrBuffer === 'string' && pathOrBuffer.startsWith('http')
            ? await getBuffer(pathOrBuffer) : (typeof pathOrBuffer === 'string' ? readFileSync(pathOrBuffer) : pathOrBuffer);
        return await this.bot.entity.directThread(threadId).broadcastPhoto({ file: file as Buffer });
    }

    async sendVideo(threadId: string, pathOrBuffer: string | Buffer) {
        const video = typeof pathOrBuffer === 'string' && pathOrBuffer.startsWith('http')
            ? await getBuffer(pathOrBuffer) : (typeof pathOrBuffer === 'string' ? readFileSync(pathOrBuffer) : pathOrBuffer);
        return await this.bot.entity.directThread(threadId).broadcastVideo({ video: video as Buffer });
    }

    async sendAudio(threadId: string, pathOrBuffer: string | Buffer) {
        let file: Buffer;
        if (typeof pathOrBuffer === 'string') {
            file = pathOrBuffer.startsWith('http') ? await getBuffer(pathOrBuffer) : readFileSync(pathOrBuffer);
        } else {
            file = pathOrBuffer;
        }
        return await this.bot.entity.directThread(threadId).broadcastVoice({
            file: file,
            waveform: Array.from({ length: 20 }, () => Math.random())
        });
    }

    /**
     * UTILITÁRIOS E DEBUG
     */
    async sendRawMessage(threadId: string, webMessage: any) {
        try {
            const rawString = inspect(webMessage, { depth: 2, compact: false });
            const truncated = rawString.length > 3500 ? rawString.substring(0, 3500) + "..." : rawString;
            return await this.sendText(threadId, `🔍 RAW DATA:\n${truncated}`);
        } catch (e) {
            return await this.sendText(threadId, "❌ Erro ao processar dados.");
        }
    }
}
