/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from "fs"
import * as path from "path"

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../config.json')) as string)

export function SimpleData (this: any, chat: any) {
    const data = {} as any
    data.data = data
    data.chat = chat

    data.type = chat.message.type 
    data.from = chat.key.remoteJid
    
    data.on = {
        group: data.from.endsWith('@g.us'),
        private: data.from.endsWith('@s.whatsapp.net')
    }
    data.sender = data.on.group ? chat.key.participant : chat.key.remoteJid
    
    const db = globalThis.db
    
    data.group = data.on.group ? (db.groups[data.from] || {} ) : {}

    data.user = db.users[data.sender] || {}
    data.user.is = {} as any
    data.user.is.owner = data.sender.startsWith(config.owner.noPhone)
    data.user.is.coowner = data.sender.startsWith(config.coowner.noPhone)
    data.user.is.admin = {
        super: false,
        normal: false
    }
    data.name = {
        user: "",
        group: ""
    } as any
    
    data.name.user = data.user.profile?.name.notify || ""
    
    const text = data.chat.message['conversation'] ||
                 data.chat.message[data.chat.message.type]?.caption || 
                 data.chat.message['extendedTextMessage']?.text || ''
    data.text = {
        full: text,
        args: [],
        body: "",
        command: undefined 
    } as any
    data.text.args = data.text.full.trim().split(/ +/).slice(1)
    data.text.body = data.text.args.join(' ')
    data.text.command = (data.text.full.startsWith(config.prefix) ? data.text.full.slice(1).trim().split(/ +/).shift().toLowerCase() : undefined)
    return data
}