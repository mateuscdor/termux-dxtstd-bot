import * as util from "util"
import * as sticker from "../../lib/sticker"
import * as crypto from "crypto"

const command = {} as any;
command.default = async (client, data, logger) => {
    try {
        let msg 
        data.chat.is.quoted ? (msg = data.chat.message.quoted()) : (msg = data.chat)
        
        let isMedia: boolean = false
        if (/image/.test(msg.message.type)) isMedia = true ;
        else if (/video/.test(msg.message.type)) isMedia = true;
        
        if (!isMedia) return
        const media = await msg.download({ stream: true })
        
        const webp = await sticker.toWEBP(media)
        
        const json = {} as any
        json['sticker-pack-id'] = crypto.randomBytes(32).toString('hex')
        json['sticker-pack-name'] = (data.text.body ? data.text.body : data.name.user )
        json['sticker-pack-publisher'] = (data.text.body ? (data.name.user + " | " + "dxtstd-bot") : ("dxtstd-bot"))
        
        const result = await sticker.addExif(webp, json)
        client.sendMessage(data.from, { sticker: result }, { quoted: data.chat })
    } catch (e) {
        logger.error(e)
        client.sendMessage(data.from, {
            text: util.format(e)
        }, {
            quoted: data.chat
        })
    }
}
//PERMISSION
command.permission = {
    owner: false,
    admin: {
        bot: false,
        normal: false,
        super: false
    },
    premium: false,
    group: false,
    private: false
};
//NEED
command.need = {
    register: false,
    limit: {
        amount: 0
    },
    cash: {
        amount: 0
    },
    level: 0
};
//INFO
command.name = "sticker"
command.help = ['sticker'].map(v => v + " ");
command.use = /^sticker$/i;

//OPTION
command.disable = false;
command.beta = false;
command.support = {
    android: true,
    linux: true,
    windows: true
};

module.exports = command;
