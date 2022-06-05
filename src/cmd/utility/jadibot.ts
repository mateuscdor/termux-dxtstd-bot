import * as bot from "../../system"
import { MakeDatabase } from "../../system/database"
import { CommandType, DatabaseType } from "../../types"

import { generateWAMessage } from "@adiwajshing/baileys"
import { Boom } from '@hapi/boom'

import * as util from "util"
import * as qrcode from "qrcode"

const command: CommandType = {} as CommandType

command['default'] = async (client, data, logger) => {
    try {
        const result = await new Promise (async (resolve, reject) => {
            const opts = {
                db: data.sender,
                printQR: false,
                autorestart: true
            }
            let client_0 = bot.StartBot(data.sender, opts)
            const database = new MakeDatabase(data.sender)
            const config = {}
            
            let message;
            let logout

            const CONUP =  async (update) => {
                let CountQR = 0
                if (CountQR > 4) return client_0.logout()
                if (update.qr) {
                    CountQR ++
                    if (message) {
                        await client.sendMessage(data.from, { delete: message.key })
                    }
                    const QR = await qrcode.toBuffer(update.qr, { scale: 8 })
                    message = await client.sendMessage(data.from, { image: QR, caption: "Scan This QR!" }, { quoted: data.chat })
                }
                if (update.connection == 'close') {
                    const status = (update.lastDisconnect?.error as Boom)?.output
                    const statusCode = status?.statusCode
                    if (statusCode == 401) {
                        logout = true 
                        client.sendMessage(data.from, { text: "Timeout" }, { quoted: data.chat })
                        reject(update)
                    } else if (statusCode == 408) {
                        if ((status?.payload?.message).startsWith('QR')) {
                            logout = true 
                            client.sendMessage(data.from, { text: "Timeout" }, { quoted: data.chat })
                        }
                        reject(update)
                    } else if (statusCode != 401) {
                        client_0 = bot.StartBot(data.sender, opts)
                        bind(client_0)
                        client.sendMessage(data.from, { text: "Restarting client..." }, { quoted: data.chat })
                    }
                }
            }
            
            let trigger = false
            const CONCREDS = () => {
                database.auth = client_0.authState
                database.save()
                client.sendMessage(data.from, { text: "Save Auth..." })
                if (!trigger) {
                    trigger = true
                    setTimeout(() => {
                        client_0.sendMessage(data.from, { text: "Deploy on TsNode in 10 second..." }, { quoted: data.chat })
                    }, 10*1000)
                    setTimeout(() => {
                        client_0.end()
                        bot.SpawnBot(opts)
                        resolve('success')
                    }, 20*1000)
                }
            }
            
            function bind(client_0) {
                if (logout) return client_0.logout(), reject('logout')
                client_0.ev.on('connection.update', CONUP)
                client_0.ev.on('creds.update', CONCREDS)
            }
            bind(client_0)
        })
    } catch (error) {
        logger.error(error)
        client.sendMessage(data.from, {
            text: util.format(error)
        }, {
            quoted: data.chat
        })
    }
}
//PERMISSION
command['permission'] = {
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
command['need'] = {
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
command['name'] = ""
command['help'] = ['jadibot'].map(v => v + " ");
command['use'] = /^jadibot$/i;

//OPTION
command['disable'] = false;
command['beta'] = false;
command['support'] = {
    android: true,
    linux: true,
    windows: true
};

module.exports = command;
