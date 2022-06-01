import * as path from "path"
import * as fs from "fs"

const PATH_CONFIG_JSON = path.resolve(__dirname, '../../config.json')

const config = JSON.parse(String(fs.existsSync(PATH_CONFIG_JSON) ? fs.readFileSync(PATH_CONFIG_JSON) : "{}")) as any
const args = [...process.argv.slice(2)]


let i = 0
args.forEach(v => {
    const opts = v.replace(/--/g, '')
    switch (opts) {
        case 'read-only':
            config.ReadOnly = true;
            break
        case 'prefix':
            config.prefix = args[i + 1]
            break;
        case 'timezone':
            config.timezone = args[i + 1]
            break
    } 
    i ++
})

export { config }