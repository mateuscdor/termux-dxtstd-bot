import * as fs from "fs"
import * as path from "path"

const commands = []
const file = fs.readdirSync('../cmd/').filter(filename => filename.endsWith('.ts'))
for (let i in file) {
    try { 
        let command = require(path.join(__dirname, 'src', 'cmd', file[i]))
    } catch (error) {
        
    }
}

export {}