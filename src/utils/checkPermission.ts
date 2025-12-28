import { IgApiClient } from 'instagram-private-api';
import { OWNER_ID } from '@src/config';

export enum PermissionLevel {
    MEMBER = 0,
    ADMIN = 1,
    OWNER = 2
}

/**
 * Verifica o nível de permissão de um usuário em uma thread específica.
 */
export const getUserPermission = async (bot: IgApiClient, thread: any, userId: string | number): Promise<PermissionLevel> => {
    // 1. Verificar se é o Owner (definido no config)
    if (userId.toString() === OWNER_ID.toString()) {
        return PermissionLevel.OWNER;
    }

    // 2. Verificar se é Admin do grupo
    const admins = thread.admin_user_ids || [];
    if (admins.includes(Number(userId)) || admins.includes(userId.toString())) {
        return PermissionLevel.ADMIN;
    }

    // 3. Caso contrário, é apenas membro
    return PermissionLevel.MEMBER;
};

/**
 * Valida se o nível do usuário é suficiente para a pasta do comando
 */
export const canExecute = (userLevel: PermissionLevel, commandPath: string): boolean => {
    const path = commandPath.toLowerCase();

    if (path.includes('owner')) {
        return userLevel === PermissionLevel.OWNER;
    }
    if (path.includes('admin')) {
        return userLevel >= PermissionLevel.ADMIN;
    }
    return true;
};
