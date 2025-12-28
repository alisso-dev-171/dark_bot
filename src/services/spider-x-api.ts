import axios from 'axios';
import { CONFIG } from 'src/config';
import { logger } from 'src/utils/logger';

export class SpiderService {
    private baseURL: string;
    private token: string;

    constructor() {
        this.baseURL = CONFIG.SPIDER_API_BASE_URL;
        this.token = CONFIG.SPIDER_API_TOKEN;
    }

    /**
     * Baixa conteúdo do Instagram (Reels/Posts)
     * @param url URL do Reels ou Post
     */
    async downloadInstagramContent(url: string) {
        try {
            logger.info(`Solicitando download para Spider API: ${url}`);
            const response = await axios.post(`${this.baseURL}/download`, {
                url: url,
                token: this.token
            });

            if (response.data && response.data.url) {
                return response.data.url;
            }
            throw new Error("URL de download não encontrada na resposta.");
        } catch (e: any) {
            logger.error("Erro na Spider API: " + e.message);
            return null;
        }
    }
}
