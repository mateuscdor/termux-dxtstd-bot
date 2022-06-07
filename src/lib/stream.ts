import * as NodeStream from 'node:stream'
import * as fs from 'fs'

const toStream = async function (input: any) {
    try {
        if (!input) throw new Error("no input???")
        let buffer;
        if (typeof input == "object" && Buffer.isBuffer(input)) buffer = input
        else if (typeof input == "string") {
            if (!fs.existsSync(input)) {
                throw new Error("No such file or directory")
            } else buffer = fs.readFileSync(input)
        } else throw new Error('input is not stream/buffer???')
        const stream = new NodeStream.Transform({
            read() {
                this.push(buffer)
                this.push(null)
            }
        })
        return stream
    } catch (error) {
        throw error
    }
}
const toBuffer = async function (input: any) {
    try {
        let buffer = Buffer.from([])
        
        for await(const chunk of input) {
            buffer = Buffer.concat([buffer, chunk])
        }
        
        return buffer
    } catch (error) {
        throw error
    }
}

const to = {
    buffer: toBuffer,
    stream: toStream
}

export {
    to
}