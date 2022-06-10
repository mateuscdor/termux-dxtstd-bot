import * as util from 'util'

const command: CommandType = {} as CommandType;
command.default = async (client, { data, database }, logger) => {
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
command.permission = {
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
command.need = {
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
command.name = ''
command.help = [].map(v => v + ' ');
command.category = ''
command.user = /^$/i;

//OPTION
command.disable = false;
command.beta = false;
command.support = {
    android: true,
    linux: true,
    windows: true
};

module.exports = command;
