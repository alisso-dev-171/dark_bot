/**
 * Responsável por detectar e validar links em mensagens.
 */

export const containsForbiddenLink = (text: string): boolean => {
    const linkRegex = /((https?:\/\/)|(www\.))?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/gi;
    if (linkRegex.test(text)) return true;
    const specificHosts = [
        'instagram.com',
        'instagr.am',
        't.me',
        'wa.me',
        'bit.ly',
        'github.com'
    ];

    return specificHosts.some(host => text.toLowerCase().includes(host));
};
