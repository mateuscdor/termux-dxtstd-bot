import makeWASocket, { DEFAULT_CONNECTION_CONFIG } from "@adiwajshing/baileys";
import * as fs from "fs";
import * as path from "path";
import { logger } from "../lib/logger";
import { MakeDatabase } from "./database"

import { ReceiverMessageHandler, ContactsHandler, ConnectionHandler } from "./handler"


const startClient = function (name, opts: any={}) {
    const database = new MakeDatabase(name)
    database.load(name)
    const client = makeWASocket({
        auth: database.auth,
        printQRInTerminal: (opts.printQR ? true : false),
        version: DEFAULT_CONNECTION_CONFIG.version,
        logger: logger
    })
    
    if (opts.bind) bind(client, database)
    return client
}

const bind = function (client, database) {
    client.ev.on('creds.update', () => {
        database.auth = client.authState
        database.save()
    })
    
    client.ev.on('messages.upsert', (...chat) => ReceiverMessageHandler(chat[0], client, database))
    client.ev.on('contacts.update', (contact) => ContactsHandler(contact, database))
    client.ev.on('connection.update', (update) =>  ConnectionHandler(startClient, update))
}

export { 
    startClient
}
