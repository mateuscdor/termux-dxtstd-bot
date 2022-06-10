import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os'
import { logger } from '../lib/logger';
import { CommandType } from '../types' 

interface CategoryCommand {
    downloader: any;
    games: any;
    owner: any;
    utility: any;
}

interface ClassCommands {
    category: CategoryCommand;
    uncategory: any;
    load: () => void
}

const COMMANDS_PATH = path.resolve(__dirname, '..', 'cmd/')
const DEVICE_OS = os.platform()
const loader = function loader(this: ClassCommands) {
    const dir = fs.readdirSync(COMMANDS_PATH)
    for (let FileCommand of dir) {
        try {
            let TMPLoadCMD = {} as CommandType
            const CommandOnDir = (!(FileCommand.endsWith('.ts')) && (fs.existsSync(path.join(COMMANDS_PATH, FileCommand, 'index.ts'))))
            const CommandOnFile = (FileCommand.endsWith('.ts'))
            if (CommandOnDir) {
                TMPLoadCMD = require(path.join(COMMANDS_PATH, FileCommand))
            } else if (CommandOnFile) {
                TMPLoadCMD = require(path.join(COMMANDS_PATH, FileCommand))
            } else {
                continue
            }
            
            if (!TMPLoadCMD.default) {
                
                continue
            }
            if (!TMPLoadCMD.support[DEVICE_OS]) {
                
                continue
            }
            if (TMPLoadCMD.disable.active) {
                
                continue
            }
            if (TMPLoadCMD.beta) {
                
            }
            
            if (TMPLoadCMD.category != '') {
                (!(this.category[TMPLoadCMD.category]) && (this.category[TMPLoadCMD.category] = {}));
                this.category[TMPLoadCMD.category][TMPLoadCMD.name] = TMPLoadCMD
            } else {
                this.uncategory[TMPLoadCMD.name] = TMPLoadCMD
            }
        } catch (error) {
            logger.error(error)
        }
    }
}

export class Commands {
    category: CategoryCommand = {
        
    } as CategoryCommand
    
    uncategory = {
        
    } as any
    
    load = () => {}
    constructor() {
        this.load = loader
        this.load()
    }
}