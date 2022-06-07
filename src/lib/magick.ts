import { spawn } from 'child_process'
import { MakeTMPFile } from './tmp'

const processor = {
    main: (input: any, opts: any={}) => {},
    convert: (input: any, opts: any={}) => {},
    compare: (input: any, opts: any={}) => {}
}

const opts = {
    main: () => {},
    convert: () => {},
    compare: () => {}
}

const ProcessorConvert = async function (input: any, opts: any={}) {
    try {
        const result = await new Promise(async (resolve, reject) => {
            const magick = spawn
        })
        return result
    } catch (error) {
        throw error
    }
}
processor.convert = ProcessorConvert

const OptsConvert = function () {
    
}
opts.convert = OptsConvert

export {
    processor,
    opts
}