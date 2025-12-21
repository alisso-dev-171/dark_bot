export default {
    name: "raw",
    description: "Mostra o JSON cru da mensagem.",
    commands: ["raw", "debug", "json"],
    handle: async ({ getRawMessage, webMessage, sendText }: any) => {
        // O getRawMessage já recebe o webMessage injetado? 
        // Não, a função utilitária espera (threadId, webMessage). 
        // O dynamicCommand injeta o threadId automaticamente no primeiro argumento.
        // Então nós passamos o webMessage como segundo argumento real.
        
        const json = getRawMessage(webMessage);
        
        await sendText(`📦 *Raw Message Data:*\n\n${json}`);
    }
};
