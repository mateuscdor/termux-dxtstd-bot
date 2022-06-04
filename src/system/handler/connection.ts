import { logger } from "../../lib"
import { Boom } from '@hapi/boom'

export async function ConnectionHandler (start, update) {
    if (update.qr) logger.info('Scan this QR!')
    if (update.connection == 'connecting') logger.info('Connecting to WhatsApp Web...')
    
    if (update.connection == 'close') {
        const statusCode = (update.lastDisconnect?.error as Boom)?.output?.statusCode
        if (statusCode != 401) {
            start()
        }
    }
}