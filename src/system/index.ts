import { logger } from "../lib/logger"
import { startClient, path_main_auth, saveAuth } from "./client"
import { ReceiverMessageHandler } from "./handler/message/receive"
import { ContactsHandler } from "./handler/contact"
import { database } from "./database"

import { Boom } from '@hapi/boom'

declare const db: any
//declare const client: any
globalThis.db = database

const start = async function () {
    try {
        const client = startClient()
        globalThis.client = client

        db.store.bind(client.ev)

        client.ev.on('creds.update', () => {
            saveAuth(client.authState, path_main_auth)
        })
        
        client.ev.on('messages.upsert', ReceiverMessageHandler)
        client.ev.on('contacts.update', ContactsHandler)

        client.ev.on('connection.update', (update) => {
            if (update.qr) logger.info('Scan this QR!')
            if (update.connection == 'connecting') logger.info('Connecting to WhatsApp Web...')
            
            if (update.connection == 'close') {
                const statusCode = (update.lastDisconnect?.error as Boom)?.output?.statusCode
                if (statusCode != 401) {
                    start()
                }
            }
        })
        return client
    } catch (error) { logger.error(error) }
}

start()
