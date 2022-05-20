/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from "../../lib/logger"
import { startClient, pathAuth, saveAuth } from "./client"
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
        saveAuth(client.authState, pathAuth)
    })

    client.ev.on('messages.upsert', (chat) => { ReceiverMessageHandler(chat); db.store.save() })
    client.ev.on('contacts.update', ContactsHandler)

    client.ev.on('connection.update', (update) => { 
        console.log(update)
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
