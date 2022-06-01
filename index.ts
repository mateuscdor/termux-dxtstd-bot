"use strict"
import { spawn } from "child_process"
import * as path from "path"
import * as CFonts from "cfonts"
import * as fs from "fs"
import { logger } from "./src/lib/logger"

const packageJSON = JSON.parse(String(fs.readFileSync('./package.json')))

CFonts.say('dxtstd-bot', {
    font: 'block',
    align: 'center',
    colors: ['#70ccff', '#AEAEAE']
})

CFonts.say(`'${packageJSON.name}' By @${packageJSON.author.name || packageJSON.author}`, {
  font: 'console',
  align: 'center',
  colors: ['#70ccff']
})

let AutoRestart = false
let IsRunning = false
/**
 * Start a ts file
 * @param {String} file `path/to/file`
 */
 
const start = function (file: string, opts: object={}) {
    IsRunning = true
    const args = [path.resolve(__dirname, file), ...process.argv.slice(2)]
    let i = 0
    args.slice(1).forEach(v => {
        i ++
        const opts = v.replace(/--/g, '')
        switch (opts) {
            case 'auto-restart':
                AutoRestart = true;
                break;
        }
    })
    
    logger.info("starting ts-node %s", args[0])
    
    const node = spawn(process.argv[0], args, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    })
    
    node.on('exit', (...exit) => {
        IsRunning = false
        logger.warn('exit code: %s', exit[0])
        logger.warn('exit signal: %s', exit[1])
        logger.info('Restarting...')
        if (IsRunning) return
        if (AutoRestart) start(file)
    })
    
    node.on('message', msg => {
        
        switch (msg) {
            case 'shutdown':
                node.kill();
                process.exit();
                break;
            case 'restart':
                node.kill();
                IsRunning = false;
                if (AutoRestart) return;
                start(file);
                break;
            case 'uptime':
                node.send(process.uptime())
                break
        }
    })
}

start('./src/system/index.ts')
