import { startClient } from "./client"
import { logger } from '../lib'
import { config } from './config'

import { spawn } from 'child_process'
import * as fs from 'fs'

const StartBot = function (name: string, opts: any={}) {
    try {
        const client = startClient(name, opts)
        return client as any
    } catch (error) {
        return {} as any
    }
}

const SpawnBot = function (opts: any={}) {
    let AutoRestart
    logger.info('Spawn new bot!')
    let args: Array<string> = [...(process.argv[1])]
    if (opts.autorestart) AutoRestart = true
    if (opts.qrimage) args = args.concat(['--qr-image'])
    if (opts.db) args = args.concat(['--database', opts.db])
    if (opts.prefix) args = args.concat(['--prefix', opts.prefix])
    if (opts.timezone) args = args.concat(['--timezone', opts.timezone])
    
    
    const node = spawn('ts-node', args, { stdio: ['pipe', 'inherit', 'inherit', 'ipc'] })
    node.on('exit', (...exit) => {
        
        if (exit[0]) logger.warn('exit code (ts-node "%s"): %s', opts.db, exit[0])
        if (exit[1]) logger.warn('exit signal (ts-node "%s"): %s', opts.db, exit[1])
        
        if (AutoRestart) logger.info('Restarting...(ts-node "%s")', opts.db), SpawnBot(opts)
        
    })
    
    node.on('message', msg => {
        logger.info('Receive MSG (ts-node "%s"): %s', opts.db, msg)
        switch (msg) {
            case 'shutdown':
                node.kill();
                break;
            case 'restart':
                node.kill();
                if (AutoRestart) return;
                logger.info('Restarting...')
                SpawnBot(opts);
                break;
            case 'uptime':
                node.send(process.uptime())
                break
        }
    })
    return node
}

if (!module.parent) {
    StartBot(config.db, {
        printQR: true,
        bind: true
    })
}

export {
    StartBot,
    SpawnBot
}