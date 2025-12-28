import { CommandParams } from "../../models/commands";
import { logger } from "../../utils/logger";
import Chance = require('chance');

export default {
    name: "testmusic",
    description: "Envio de card de música assinado",
    commands: ["testmusic", "9cards"],
    handle: async ({ sendText, sendReact, remoteJid, args, bot }: CommandParams) => {
        const query = args.join(" ") || "Phonk";
        const chance = new Chance();
        let trackToUse: any = null; // Definido fora para ser usado no catch

        try {
            await sendReact("🔍");

            const searchResponse = await (bot as any).request.send({
                url: '/api/v1/music/search/',
                method: 'POST',
                form: {
                    _csrftoken: (bot as any).state.cookieCsrfToken,
                    _uuid: (bot as any).state.uuid,
                    q: query,
                    product: 'story_camera_music_overlay_post_capture',
                    browse_session_id: (bot as any).state.clientSessionId,
                },
            });

            trackToUse = searchResponse.body.items?.[0]?.track;
            if (!trackToUse) return await sendText("Música não encontrada 😕");

            await sendText(`Tentando enviar card de: ${trackToUse.title}`);

            // Montando o formulário para music_share
            const mutationToken = chance.guid();
            const form = {
                action: 'send_item',
                thread_ids: `[${remoteJid}]`,
                client_context: mutationToken,
                _csrftoken: (bot as any).state.cookieCsrfToken,
                device_id: (bot as any).state.deviceId,
                mutation_token: mutationToken,
                _uuid: (bot as any).state.uuid,
                _uid: (bot as any).state.cookieUserId,
                audio_cluster_id: trackToUse.audio_cluster_id.toString(),
                audio_asset_id: trackToUse.id.toString(),
                music_browse_session_id: (bot as any).state.clientSessionId,
                playback_duration_ns: (trackToUse.duration_in_ms * 1000000).toString(),
                allow_full_aspect_ratio: 'true',
                unified_broadcast_format: '1'
            };

            // Envio Assinado
            await (bot as any).request.send({
                url: '/api/v1/direct_v2/threads/broadcast/music_share/',
                method: 'POST',
                form: (bot as any).request.sign(form),
            });

            await sendReact("✅");

        } catch (error: any) {
            logger.error("Erro no envio principal: " + error.message);
            
            // Fallback usando a variável trackToUse que agora está visível aqui
            if (error.message.includes("404") && trackToUse) {
                try {
                    logger.info("Tentando Fallback de Texto Assinado...");
                    const fallbackForm = (bot as any).request.sign({
                        thread_ids: `[${remoteJid}]`,
                        text: '',
                        intent: 'share_music',
                        audio_cluster_id: trackToUse.audio_cluster_id.toString(),
                        client_context: chance.guid(),
                        _uuid: (bot as any).state.uuid,
                        _csrftoken: (bot as any).state.cookieCsrfToken,
                    });
                    
                    await (bot as any).request.send({
                        url: '/api/v1/direct_v2/threads/broadcast/text/',
                        method: 'POST',
                        form: fallbackForm,
                    });
                    await sendText("O card foi enviado via fallback! 🎵");
                } catch (e: any) {
                    logger.error("Falha total no envio: " + e.message);
                    await sendText("Não foi possível enviar o card de música nesta conta.");
                }
            }
        }
    }
};
