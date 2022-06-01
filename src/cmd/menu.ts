import * as util from "util"
import { commands } from "../system/command"
import { CommandType } from "../types"

const menu = {
    header: `
*DXTSTD Bot*
Hi %user%!

*[ %typeMenu% ]*
`.trimStart(),
    body: `%menu%
    
*<>* = _requirement_, *()* = _optional_
*|* = _or_, *&* = _and_
*@* = _tag_, *R* = _reply_

information for donation, type *%donate*`.trimStart(),
    footer: `
Owner bot: %nameOwner%
%package%
`.trimStart().trimEnd()
}
const command: CommandType = {} as CommandType
command['default'] = async (client, data, logger) => {
    try {
        
    } catch (e) {
        logger.error(e)
        client.sendMessage(data.from, {
            text: util.format(e)
        }, {
            quoted: data.chat
        })
    }
}
//PERMISSION
command['permission'] = {
    owner: true,
    admin: {
        bot: false,
        normal: false,
        super: false
    },
    premium: false,
    group: false,
    private: false
};
//NEED
command['need'] = {
    register: false,
    limit: {
        amount: 0
    },
    cash: {
        amount: 0
    },
    level: 0
};
//INFO
command['name'] = "Menu"
command['help'] = ['menu'].map(v => v + " ");
command['use'] = /^menu$/i;

//OPTION
command['disable'] = false;
command['beta'] = false;
command['support'] = {
    android: true,
    linux: true,
    windows: true
};

module.exports = command;
