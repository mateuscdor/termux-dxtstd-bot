import { logger } from "../../lib/logger"
import { startClient, pathAuth, saveAuth } from "./client"



const start = async function () {
    const client = startClient()
    client.ev.on('creds.update', () => {
        saveAuth(client.authState, pathAuth)
    })

    client.ev.on('messages.upsert', (chat) => {
        logger.info(chat)
    })
    return client
}

start()