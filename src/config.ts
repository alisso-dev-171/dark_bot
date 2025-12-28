import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';

let pkgVersion = "1.0.0";
try {
    const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
    pkgVersion = pkg.version;
} catch { 
	pkgVersion = "1.0.0";
}

export const BOT_NAME = "DARK_BOT";
export const OWNER_AT = "@dev_mrx_";
export const OWNER_ID = "61304093990";
export const	PREFIX = "!";
export const VERSION = pkgVersion;
export const COMMANDS_PATH = join(__dirname, "commands");
export const EVENT_IN_MILLISECONDS = 5000;
export const USERNAME = process.env.INSTA_USER || "";
export const PASSWORD = process.env.INSTA_PASSWORD || "";
export const SESSION_PATH = join(__dirname, "assets", "auth", "session.json");
export const SPIDER_API_BASE_URL = "https://api.spider.com";
export const SPIDER_API_TOKEN = "seu_token_aqui";
