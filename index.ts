import { spawn } from "child_process"

const start = function (file: string, opts: Object={}) {
    const nodejs = spawn('ts-node', [file], {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    })
}

start('./src/system/index.ts')