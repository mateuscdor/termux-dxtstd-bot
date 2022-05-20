import { spawn } from "child_process"
import * as path from "path"
import * as CFonts from "cfonts"

CFonts.say('dxtstd-bot', {
    font: 'block',
    align: 'center',
    colors: ['#00ffff', '#BEBEBE']
})

const start = function (file: string, opts: object={}) {
    const args = [path.join(__dirname, file), ...process.argv.slice(2)]
    const nodejs = spawn(process.argv[0], args, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    })

    nodejs.on('exit', () => { start(file) })

}

start('./src/system/index.ts')