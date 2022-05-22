import { commands } from "../command"
import { logger } from "../../lib/logger"

export async function CommandHandler (this: any, client: any, data: any) {
    let command
    Object.keys(commands).forEach(type => {
        Object.keys(commands[type]).forEach(cmd => {
            console.log(type, cmd)
            console.log(commands[type][cmd])
            console.log(commands[type][cmd].use.test(data.text.command))
            if (commands[type][cmd].use.test(data.text.command)) {
                command = commands[type][cmd]
            }
        })
    })
    
    if (!command) {
        let text = `Command *${data.text.command}* not found.`
        client.sendMessage(data.from, { text: text }, { quoted: data.chat })
        return
    }
    
    if (command.permission.owner && !data.user.is.owner) {
        let text = "You are not the owner!"
        client.sendMessage(data.from, { text: text }, { quoted: data.chat })
    }
    
    try {
        command.default.call(this, client, data, logger)
    } catch (error) {
        logger.error(error)
    }
}