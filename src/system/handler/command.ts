import { commands } from "../command"
import { logger } from "../../lib/logger"

export async function CommandHandler (this: any, client, { data, database }) {
    let command
    Object.keys(commands).forEach(type => {
        if (typeof commands[type]?.default == "function") {
            if (commands[type].use.test(data.text.command)) {
                command = commands[type]
            }
        } else {
            Object.keys(commands[type]).forEach(cmd => {
                if (commands[type][cmd].use.test(data.text.command)) {
                    command = commands[type][cmd]
                }
            })
        }
    })
    
    if (!command) {
        let text = `Command *${data.text.command}* not found.`
        client.sendMessage(data.from, { text: text }, { quoted: data.chat })
        return
    }
    
    if (command.permission.owner && !data.user.is.owner) {
        let text = "You are not the owner!"
        client.sendMessage(data.from, { text: text }, { quoted: data.chat })
        return
    }
    
    try {
        command.default.call(this, client, { data, database }, logger)
    } catch (error) {
        logger.error(error)
    }
}