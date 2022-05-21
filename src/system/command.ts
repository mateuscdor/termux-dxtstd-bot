import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../../lib/logger';

const deepReadDir = function deepReadDir(dir) {
    var results = [];
    const list = fs.readdirSync(dir);
    var i = 0;
    function next() {
        var file = list[i++];
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
const file = deepReadDir('../cmd/').filter((filename) => {
    filename.endsWith('.ts');
});
for (const i in file) {
    try { 
        const command = require(path.join(__dirname, 'src', 'cmd', file[i]))

        
    } catch (error) {
        logger.error(error,`Command [ ${file} ]`)
    }
}

export {
    commands
}