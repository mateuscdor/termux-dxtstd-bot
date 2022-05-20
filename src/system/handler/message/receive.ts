import { SimpleChat } from "../../simpler/message"
import { logger } from '../../../../lib/logger'
import * as util from "util"
import { SimpleData } from "../../simpler/data";

export async function ReceiverMessageHandler(chat: any) {
    try {
        if (!chat) return;
        if (chat.type === 'append') return

        const client = globalThis.client

        chat = (new (SimpleChat as any)(chat, globalThis.client)).messages[0]
        if (!chat.message) return;
        if (chat.key && chat.key.remoteJid == 'status@broadcast') return;
        if (chat.key.fromMe) return
        
        const data = SimpleData(chat)
        
        if (data.text.full.startsWith('/>')) {
            if (data.sender != "6288804280094@s.whatsapp.net") return;
            let evalu
            try {
                evalu = await eval(data.text.body)
            } catch (error) {
                logger.error(error)
                evalu = error
            } finally {
                client.sendMessage(chat.key.remoteJid, { text: util.format(evalu) })
            }
        }

        console.log(data)
    } catch (error) {
        logger.error(error)
    }
}