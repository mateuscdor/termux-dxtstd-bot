import { logger } from "../../lib/logger"
import { startClient, pathAuth, saveAuth } from "./client"
import { ReceiverMessage } from "./handler/message/receive"
import { database, saveDB } from "./database"

declare var db: any
globalThis.db = database
db = database

db.save = function (this: any, type: string) {
    switch (type) {
        case 'user':
        case 'users': 
            saveDB(this.users, 'user')
            break
        case 'group':
        case 'groups':
            saveDB(this.groups, 'group')
            break
        default: 
            return
    }
} 

const start = async function () {
    const client = startClient()
    client.ev.on('creds.update', () => {
        saveAuth(client.authState, pathAuth)
    })

    client.ev.on('messages.upsert', ReceiverMessage)

    return client
}

start()