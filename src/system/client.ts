import makeWASocket, { useSingleFileAuthState, BufferJSON, DEFAULT_CONNECTION_CONFIG } from "@adiwajshing/baileys"
import * as fs from "fs"
import { logger } from "../../lib/logger"

const pathAuth = '/sdcard/bot/dxtstd-bot/auth.json'

const loadAuth = function (file: string) {
    const { state } = useSingleFileAuthState(file)
    return state
}

const saveAuth =  function (auth: object, file: string) {
    file = file || "./auth.json"
    fs.writeFileSync(file, JSON.stringify(auth, BufferJSON.replacer))
}

const startClient = function () {
    const opts = {
        auth: loadAuth(pathAuth),
        printQRInTerminal: true,
        version: DEFAULT_CONNECTION_CONFIG.version,
        logger: logger
    } 
    return makeWASocket(opts)
}

export { 
    startClient,
    saveAuth,
    loadAuth,
    pathAuth
}