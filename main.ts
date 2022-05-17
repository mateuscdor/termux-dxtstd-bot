import makeWASocket, { useSingleFileAuthState, BufferJSON, DEFAULT_CONNECTION_CONFIG } from "@adiwajshing/baileys"
import * as fs from "fs"
global = {} as any

let pathAuth = '../dxtstd-bot/auth.json'

const loadAuth = function (file: string) {
    const { state } = useSingleFileAuthState(file)
    return state
}

const saveAuth =  function (auth: Object, file: string) {
    file = file || "./auth.json"
    fs.writeFileSync(file, JSON.stringify(auth, BufferJSON.replacer))
}

const startClient = function () {
    const opts = {
        auth: loadAuth(pathAuth),
        printQRInTerminal: true,
        version: DEFAULT_CONNECTION_CONFIG.version
    } as any
    return makeWASocket(opts)
}

const start = async function () {
    const client = global.client = startClient()
    client.ev.on('creds.update', () => {
        saveAuth(client.authState, pathAuth)
    })
}

start()