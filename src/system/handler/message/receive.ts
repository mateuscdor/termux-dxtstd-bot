import { SimpleChat } from "../../simpler/message"
import { logger } from '../../../../lib/logger'

export async function ReceiverMessage(chat: any) {
    if (!chat) return;
    if (chat.type === 'append') return

    chat = (new (SimpleChat as any)(chat, {})).messages[0]
    if (!chat.message) return;
    if (chat.key && chat.key.remoteJid == 'status@broadcast') return;
    if (chat.key.fromMe) return;

    console.log(chat)
}