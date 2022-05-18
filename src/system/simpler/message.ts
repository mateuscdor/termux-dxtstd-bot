import { downloadMediaMessage } from "@adiwajshing/baileys"
import * as fs from "fs"

const isMedia = function (type: string) {
    const MEDIA = {
        'audioMessage': true,
        'videoMessage': true,
        'imageMessage': true,
        'documentMessage': true,
        'stickerMessage': true
    } as any
    return MEDIA[type] ? true : false
}

const MessageType = {
    
}

const DownloadMessage = async function DownloadMessage(chat: any, opts: any={}) {
    if (!isMedia(chat.message.type)) return new Error()
    const result = await downloadMediaMessage(chat, 'buffer', {})
    return result
}

const is = function IsChat(this: any, chat: any) {
    const messageType = Object.keys(chat.message)[0];
    const chatCtxInfo = chat.message[messageType].contextInfo || {};
              
    this.baileys = (/*IF MD*/(chat.key.id.startsWith('BAE5')) ? true: (/*IF Not MD*/chat.key.id.startsWith('3EB0') ? true: false));
    this.forward = chatCtxInfo.isForwarding || false;
    this.media = isMedia(messageType);
    this.quoted = chatCtxInfo.quotedMessage ? true : false;                            
}

export function SimpleChat (this: any, chat: any, client: any) {
    chat = chat.messages ? chat.messages[0] : {}
    console.log(chat)
    const message = chat.message
    if (!message) return
    message.type = Object.keys(message)[0] != 'messageContextInfo' ? Object.keys(message)[0] : Object.keys(message)[1]
    
    chat.is = new (is as any)(chat)
    chat.download = async function(opts: any={}) {
        return await DownloadMessage(chat, opts)
    }
    chat.quoted = function () {
        if (!chat.is.quoted) return {}
    }

    this.messages = [chat]
} 