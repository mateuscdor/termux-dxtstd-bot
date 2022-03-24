const fs = require("fs");
const util = require('util');
const moment = require("moment-timezone");
const path = require("path");
const simple = require('../lib/simple.js');


const markTime = function () {
    return moment.tz(config.timezone);
};


module.exports = async (chat) => {
    try {
        if (!chat) return;
        if (chat.type === 'append') return
        chat = (new simple.schat(client, chat)).messages[0];
        
        //console.log(chat)
        if (!chat.message) return;
        if (chat.key && chat.key.remoteJid == 'status@broadcast') return;
        if (chat.key.fromMe) return;

        chat.message = (Object.keys(chat.message)[0] === 'ephemeralMessage') ? chat.message.ephemeralMessage.message: chat.message;
        chat.message = (Object.keys(chat.message)[0] === 'viewOnceMessage') ? chat.message.viewOnceMessage.message: chat.message;

        const type = Object.keys(chat.message)[0] === 'senderKeyDistributionMessage' ? Object.keys(chat.message)[1]: Object.keys(chat.message)[0];

        const from = chat.key.remoteJid;

        //EXCEPTION
        const isGroup = from.endsWith('@g.us');
        const isPrivate = from.endsWith('@s.whatsapp.net');

        const sender = isGroup ? chat.key.participant: chat.key.remoteJid;
        const groupMetadata = isGroup ? await client.groupMetadata(from): '';

        const isOwner = (sender.split("@")[0] === config.owner.noPhone);
        const isAdmin = '';
        const isSAdmin = '';
        const isBAdmin = '';

        const isRegister = '';
        const isPremium = '';
        const isBanned = '';

        //METADATA
        const groupname = isGroup ? groupMetadata.subject: '';
        const username = global.db.users[sender] ? global.db.users[sender].profile.name.saved || global.db.users[sender].profile.name.notify : `+${sender.split('@')[0]}`;

        //TEXT
        const text = (type === 'conversation' && chat.message.conversation) ? chat.message.conversation: (type == 'imageMessage') && chat.message.imageMessage.caption ? (chat.message.imageMessage.caption || ''): (type == 'videoMessage') && chat.message.videoMessage.caption ? chat.message.videoMessage.caption: (type == 'extendedTextMessage') && chat.message.extendedTextMessage.text ? chat.message.extendedTextMessage.text: '';

        const command = text.slice(1).trim().split(/ +/).shift().toLowerCase();
        const args = text.trim().split(/ +/).slice(1);
        const isCmd = text.startsWith(config.prefix);
        const isCmdButt = /templateButtonReply/.test(type);
        
        
        //READ MSG
        client.sendReadReceipt(from, (isGroup ? chat.participant: undefined), [chat.key.id]);

        //LOGGING MSG
        if (!isCmd && !isGroup) logger.pc(text, username, type);
        if (isCmd && !isGroup) logger.cmdpc(text, username, type);
        if (!isCmd && isGroup) logger.gc(text, username, groupname, type);
        if (isCmd && isGroup) logger.cmdgc(text, username, groupname, type);

        //RUN CMD
        if (isCmd) {
            let plugin;
            const data = {
                chat, command, from, args, type, sender
            };
            
            try {
                for (let name in global.plugins) {
                    let plug = global.plugins[name];
                    if (typeof plug !== "function") continue;
                    if (plug.use.test(command)) {
                        plugin = plug;
                    }
                }
            } catch (e) {
                logger.error(e);
            } finally {
                if (!plugin) {
                    client.sendMessage(data.from, {
                        text: "This command is not available"
                    }, {
                        quoted: data.chat
                    });
                    return;
                }

                global.db.users[sender].history.command.last = command;
                global.db.users[sender].history.command[markTime()] = command;

                if (plugin.permission.owner && !isOwner) {
                    client.sendMessage(data.from, {
                        text: "You aren't my owner!"
                    }, {
                        quoted: data.chat
                    });
                    return;
                }

                try {
                    await plugin.call(this, data);
                    delete plugin;
                } catch (e) {
                    logger.error(e);
                    client.sendMessage(data.from, {
                        text: util.format(e)
                    }, {
                        quoted: data.chat
                    });
                }
                fs.writeFileSync(path.join(dir.database, 'users.json'), JSON.stringify(global.db.users, null, '\t'));
            }
        }
        //GAME SESSION
        if (global.db.session.game[from] && !isCmd && !isCmdButt) {
            
        }
        
        //Waiting Response

        //RESPONSE BUTTON
        if (isCmdButt) {
            
        }
    } catch (e) {
        logger.error(e);
    }
};
