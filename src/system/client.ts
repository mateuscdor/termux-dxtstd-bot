import makeWASocket, { useSingleFileAuthState, BufferJSON, DEFAULT_CONNECTION_CONFIG } from "@adiwajshing/baileys";
import * as fs from "fs";
import * as path from "path";
import { logger } from "../lib/logger";

const path_database = path.join(__dirname, '..', '..', 'database/');
const path_main_auth = path_database + 'auth.json';
((!fs.existsSync(path_database)) && fs.mkdirSync(path_database))

const loadAuth = function (file: string) {
    const { state } = useSingleFileAuthState(file)
    return state
};

const saveAuth =  function (auth: object, file: string) {
    try {
        file = file || "./auth.json"
        fs.writeFileSync(file, JSON.stringify(auth, BufferJSON.replacer))
    } catch (error) {
        logger.error(error)
    }
}

const startClient = function () {
    const opts = {
        auth: loadAuth(path_main_auth),
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
    path_main_auth
}
