import { SimpleChat } from "../../simpler/message"
import { logger } from '../../../../lib/logger'
import * as util from "util"
import { SimpleData } from "../../simpler/data";
import chalk from "chalk"
import { commands } from "../../command"
declare const cmd: any
globalThis.cmd = commands

const coloringText = function (text: string, color: string) {
    return !color ? chalk.keyword('white')(text) : chalk.keyword(color)(text)
}

const coloringBGText = function (text: string, color: string) {
    return !color ? chalk.bgKeyword('white')(text) : chalk.bgKeyword(color)(text)
}

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
        const fetchLog = function (object: any) {
            let text = coloringText('"' + object.text.full + '"', 'white')
            text += coloringText(' From: ', 'yellow')
            text += object.name.user
            if (object.on.group) {
                text += coloringText(' Group: ', 'yellow')
                text += object.name.group
            }
            text += coloringText(' MessageType: ' + object.type, 'lime')
            return text
        }
        

        if (data.text.command) logger.command(fetchLog(data))
        else logger.message(fetchLog(data))

        
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

        //console.log(data)
    } catch (error) {
        logger.error(error)
    }
}