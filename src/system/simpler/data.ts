import * as fs from 'fs'
import * as path from 'path'
import { config } from '../config'
import { DataType, Text } from "../../types"


export function SimpleData (this: any, chat: any)  {
    const data: DataType = {} as DataType
    //data['data'] = data
    data['chat'] = chat

    data['type'] = chat.message.type 
    data['from'] = chat.key.remoteJid
    
    data['on'] = {
        group: data.from.endsWith('@g.us'),
        private: data.from.endsWith('@s.whatsapp.net')
    }
    data['sender'] = data.on.group ? chat.key.participant : chat.key.remoteJid
    
    const db = globalThis.db
    
    data['group'] = data.on.group ? (db.groups[data.from] || {}) : {}

    data['user'] = db.users[data.sender] || {}
    
    data['user']['is']['owner'] = data.sender.startsWith(config.owner.noPhone)
    data['user']['is']['coowner'] = data.sender.startsWith(config.coowner.noPhone)
    data['user']['is']['admin'] = {
        super: false,
        normal: false
    }
    data['name'] = {
        user: "",
        group: ""
    }
    
    data['name']['user'] = data.user.profile?.name.contact || data.user.profile?.name.notify || data.chat.pushName || ""
    
    const text = data.chat.message['conversation'] ||
                 data.chat.message[data.chat.message.type]?.caption || 
                 data.chat.message['extendedTextMessage']?.text || ''
                 
    data['text']['args'] = text.trim().split(/ +/).slice(1)
    data['text']['body'] = text.trim().split(/ +/).slice(1).join(' ')
    data['text']['command'] = (text.startsWith(config.prefix) ? text.slice(1).trim().split(/ +/).shift().toLowerCase() : undefined)
    return data
}