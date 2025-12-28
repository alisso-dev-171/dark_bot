import { CommandParams } from "../../models/commands";
import { PREFIX } from "../../config";

export default {
    name: "raw",
    description: "Exibe os dados brutos da mensagem",
    commands: ["raw", "debug", "get"],
    usage: `${PREFIX}raw`,
    handle: async ({ sendRawMessage, sendWaitReact, sendSuccessReact, webMessage }: CommandParams) => {
    	await sendWaitReact();
    	    	
    	await sendRawMessage(webMessage);

    	await sendSuccessReact();
    }
};
