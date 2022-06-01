import * as path from "path"
import * as fs from "fs"

import { logger } from "../lib/logger"

const PATH_CONFIG_JSON = path.resolve(__dirname, '../../config.json')

const config = JSON.parse(String(fs.existsSync(PATH_CONFIG_JSON) ? fs.readFileSync(PATH_CONFIG_JSON) : "{}")) as any
const args = [...process.argv.slice(2)]

const isOpts = function (args) {
    return args.startsWith('--')
}

const MakeError = function (text) {
    return new TypeError(text)
}

let i = 0
args.forEach(v => {
    const opts = v.replace(/--/g, '') 
    switch (opts) {
        case 'read-only':
            logger.info('Enable Read Only (child ts-node)')
            config.ReadOnly = true;
            break;
        case 'qr-image':
            logger.info('Enable Save QR Image (child ts-node)')
            config.QRImage = true
            break
        case 'prefix':
            const errorP = 'missing args for "--prefix". require 1 args'
            if (!args[i + 1]) throw MakeError(errorP)
            else if (isOpts(args[i + 1])) throw MakeError(errorP);
            logger.info('Set Prefix to "%s" (child ts-node)', args[i + 1])
            config.prefix = args[i + 1]
            break;
        case 'timezone':
            const errorTZ = 'missing args for "--timezone". require 1 args'
            if (!args[i + 1]) throw MakeError(errorTZ)
            else if (isOpts(args[i + 1])) throw MakeError(errorTZ);
            logger.info('Set Timezone to "%s" (child ts-node)', args[i + 1])
            config.timezone = args[i + 1]
            break
    } 
    i ++
})

export { config }