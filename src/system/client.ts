import makeWASocket, { DEFAULT_CONNECTION_CONFIG } from "@adiwajshing/baileys";
import * as fs from "fs";
import * as path from "path";
import { logger } from "../lib/logger";
import { MakeDatabase } from "./database"

import { EventsHandler } from "./handler"

const startClient = function (opts: any={}) {
    const database = new MakeDatabase((opts.db || 'other'))
    database.load((opts.db || 'other'))
    
    const client = makeWASocket({
        auth: database.auth,
        printQRInTerminal: (opts.printQR ? true : false),
        version: DEFAULT_CONNECTION_CONFIG.version,
        logger: logger
    })
    
    if (opts.bind) EventsHandler(client, database, opts)
    return client
}

export { 
    startClient
}
