import { startClient } from "./client"
import { logger } from '../lib'
import { config } from './config'

const StartBot = function (opts: any={}) {
    try {
        const client = startClient(opts)
        return client as any
    } catch (error) {
        return {} as any
    }
}

if (!module.parent) {
    StartBot({
        db: config.db,
        printQR: true,
        bind: true
    })
}

export {
    StartBot
}