import * as fs from 'fs';
import * as path from 'path';
import {logger} from '../../lib/logger';

const commands = [] as any;
const file = fs.readdirSync('../commands/').filter((filename) => {
    filename.endsWith('.ts');
});
for (const i in file) {
    try { 
        const command = require(path.join(__dirname, 'src', 'cmd', file[i]))

        commands.push(command)
    } catch (error) {
        logger.error(error,`Command [ ${file} ]`)
    }
}

export {
    commands
}