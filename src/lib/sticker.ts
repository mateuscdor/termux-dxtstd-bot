import * as cp from "child_process"
import * as fs from "fs"
import * as path from "path"

export async function toWEBP(input: any) {
    return new Promise(async function (resolve, reject) {
        let input2
        let type
        if (input._readableState) type = "stream";
            else if (typeof input == "string") type = "path";
        else reject();
        
        const filename = ((path.resolve(__dirname, '..', '..', 'tmp') + '/') + new Date() + ".webp").replace(/ +/g, '_')
        let args;
        let opts;
        switch (type) {
            case "stream": 
                input2 = input
                input2.resume()
                args = ['-i', 'pipe:0','-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1', filename]
                break
            case "path":
                args = ['-i', input, '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1', filename ]
                break;
        }
        
        const ffmpeg = await cp.spawn('ffmpeg', args, opts)
        
        if (type == "stream") {
            input2.pipe(ffmpeg.stdio[0])
        }
        
        ffmpeg.on('exit', async () => {
            const result = await fs.readFileSync(filename)
            fs.unlinkSync(filename)
            
            resolve(result)
        })
    })
}

export function addExif(json: any) {
    
}