import { readdirSync, statSync } from 'fs';
import axios from "axios";
import path from 'path';

export const readAndImportCommands = async (dir: string): Promise<any[]> => {
    let results: any[] = [];
    const list = readdirSync(dir);

    for (const file of list) {
        const filePath = path.resolve(dir, file);
        const stat = statSync(filePath);

        if (stat && stat.isDirectory()) {
            results = results.concat(await readAndImportCommands(filePath));
        } else if (file.match(/\.(ts|js|mjs)$/)) {
            const command = await import(filePath);
            results.push(command.default || command);
        }
    }
    return results;
};

/**
 * Baixa um recurso de uma URL e retorna um Buffer
 */
export const getBuffer = async (url: string): Promise<Buffer> => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
};

/**
 * Formata a mensagem para evitar marcações indesejadas
 */
export const getRawMessage = (webMessage: any): string => {
    return JSON.stringify(webMessage, null, 2)
        .replace(/http/g, "ht_tp")
        .replace(/@/g, "(at)");
};

/**
 * Extrai o ID da mídia através da URL
 */
export const extractShortcode = (url: string): string => {
    const match = url.match(/\/(?:p|reels|reel)\/([A-Za-z0-9_-]+)/);
    if (!match) throw new Error("URL Inválida! Certifique-se que é um link de Post ou Reels.");
    return match[1];
};

/**
 * Formata milissegundos em H:M:S
 */
export const formatUptime = (ms: number): string => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
