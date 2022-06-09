import { spawn } from 'child_process'
import * as fs from 'fs'
import { MakeTMPFile } from './tmp'

const MakeRandom = function (length: number=4) {
    return String(Math.floor(Math.random() * 9999))
}


const ss = async function (pathfile) {
    try { 
        const DEF_DISPLAY = (":" + MakeRandom());
        const DEF_ENV = {
            ...process.env,
            DISPLAY: DEF_DISPLAY
        } as any
        const DEF_STDIO = 'inherit' //['pipe', 'pipe', 'pipe', 'ipc']
        const DEF_OPTS = {
            env: DEF_ENV,
            stdio: DEF_STDIO
        } as any
        
        const result = await new Promise(async (resolve, reject) => {
            let ext;
            if (!fs.existsSync(pathfile)) return reject(new Error('file doesnt exists'))
            
            if (pathfile.endsWith('.pdf')) ext = 'pdf';
            else if (pathfile.endsWith('.docx')) ext = 'docx'
            
            
            const DEF_WIDTH = 1080
            const DEF_HEIGTH = 1480
            const DEF_COLORBIT = 24
            
            const RES_XVFB = `${DEF_WIDTH}x${DEF_HEIGTH}x${DEF_COLORBIT}`
            
            const DEF_ARGS_XFVB = (`${DEF_DISPLAY} -screen 0 ${RES_XVFB}`).split(/ +/)
            const XVFB = spawn('Xvfb', DEF_ARGS_XFVB, DEF_OPTS)
            const XFWM = spawn('xfwm4', [], DEF_OPTS)
            /*
            *
            *LIBRE OFFICE
            *
            **/
            
            const DEF_ARGS_LIBRE = (`--view --norestore ${pathfile}`).split(/ +/)
            const LibreOffice = spawn('libreoffice', DEF_ARGS_LIBRE, DEF_OPTS)
            
            const FileTMPImage = MakeTMPFile('.png')
            const DEF_DELAY_GSS = 10
            const DEF_ARGS_GSS = (`-f ${FileTMPImage} -d ${DEF_DELAY_GSS}`).split(/ +/)
            const GnomeSS = spawn('gnome-screenshot', DEF_ARGS_GSS, DEF_OPTS)
            GnomeSS.on('exit', async () => {
                XVFB.kill(); LibreOffice.kill();
                try { 
                    const IMAGE = await fs.readFileSync(FileTMPImage);
                    fs.unlinkSync(FileTMPImage)
                    resolve(IMAGE)
                } catch (error) {
                    reject()
                }
            })
        })
        
        return result
    } catch (error) {
        throw error
    }
}

export {
    ss
}