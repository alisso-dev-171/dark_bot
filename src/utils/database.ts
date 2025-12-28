import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(__dirname, '../database/anti-link.json');

const initDB = () => {
    if (!existsSync(DB_PATH)) {
        writeFileSync(DB_PATH, JSON.stringify({}));
    }
};

export const getAntiLinkData = (): Record<string, { active_anti_link: boolean }> => {
    initDB();
    const data = readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
};

export const setAntiLinkData = (threadId: string, status: boolean) => {
    const data = getAntiLinkData();
    data[threadId] = { active_anti_link: status };
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

export const isAntiLinkActive = (threadId: string): boolean => {
    const data = getAntiLinkData();
    return data[threadId]?.active_anti_link || false;
};
