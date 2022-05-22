import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../../lib/logger';

const deepReadDir = function deepReadDir(dir) {
    let results = [] as any;
    const list = fs.readdirSync(dir);
    let i = 0;
    function next() {
        let file = list[i++];
        if (!file) return results;
            file = path.resolve(dir, file);
            const stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                const res = deepReadDir(file);
                results = results.concat(res);
                return next();
            } else {
            results.push(file);
            return next();
        }
    }
    return next();
};

const commands = {} as any;
const file = deepReadDir(path.resolve(__dirname, '../cmd'));

const TypeCommand = file.map(filename => {
    const folder = filename.split('/').reverse().slice(1)[0]
    if (folder.endsWith('.ts')) return 
    return folder
})
console.log(TypeCommand)
TypeCommand.forEach(type => {
    commands[type] = {}
})

file.forEach(filename => {
    const FilenameNoExt = filename.replace('.ts', '')
    const FilenameSplit = FilenameNoExt.split('/').reverse()
    
    const command = require(filename)
    commands[FilenameSplit[1]][FilenameSplit[0]] = command
})

export {
    commands
}