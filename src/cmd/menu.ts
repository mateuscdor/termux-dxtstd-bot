import * as util from 'util'
import { commands } from '../system/command'
import { CommandType } from '../types'

const MakeMenu = function () {
    return {
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
%package%`.trimStart()
    } as any
}
const command: CommandType = {} as CommandType
command['default'] = async (client, { data, database }, logger) => {
    try {
        const MENU = MakeMenu()
        let MenuType: string = '';
        
        if (!data.text.args) MenuType = 'main';
        else if (data.text.args) MenuType = 'sub'
        
        MENU.header = MENU.header.replace('%user%', data.name.user)
        MENU.header = MENU.header.replace('%typemenu', `${MenuType} menu`.toUpperCase())
        
        if (MenuType == 'main') {
            let ContentsMenu: string = ''
            Object.keys(commands).forEach(v => {
                ContentsMenu += database.config.prefix + ''
            })
            
        }
        
        if (MenuType == 'sub') {
            
        }
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
    owner: false,
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
command['name'] = 'Menu'
command['help'] = ['menu'].map(v => v + ' ');
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
