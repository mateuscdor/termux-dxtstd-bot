/* eslint-disable @typescript-eslint/no-explicit-any */
const imgorvid = function (type: string) {
    const MEDIA = {
        'videoMessage': true,
        'imageMessage': true
    } 
    return MEDIA[type] ? true : false
}

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
    data.name = {
        user: "",
        group: ""
    } as any
    
    const db = globalThis.db

    data.user = db.users[data.sender] || {}
    data.user.is = {} as any
    data.user.is.owner = data.sender.startsWith('6288804280094')
    data.user.is.admin = {
        super: false,
        normal: false
    }
    data.user.is.verified
    data.user.is.premium
    data.user.is.banned

    data.group = data.on.group ? (db.groups[data.from] || {} ) : {}

    data.name.user = data.user.profile.name.notify
    
    const text = (chat.message['conversation'] ? chat.message['conversation'] : ( imgorvid(chat.message.type) ? chat.message[chat.message.type].caption : (chat.message['extendedTextMessage']) ? chat.message['extendedTextMessage'].text : "" ))

    data.text = {
        full: text,
        args: [],
        body: "",
        command: undefined 
    } as any
    data.text.args = data.text.full.trim().split(/ +/).slice(1)
    data.text.body = data.text.args.join(' ')
    data.text.command = data.text.full.slice(1).trim().split(/ +/).shift().toLowerCase()
    return data
}