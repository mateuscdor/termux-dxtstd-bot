import * as util from "util"

const command = {} as any;
command.default = async (client, data, logger) => {
    try {
        const evalRes = await eval(data.text.body)
        client.sendMessage(data.from, { text: util.format(evalRes) }, { quoted: data.chat })
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
command.name = ""
command.help = ['eval'].filter(v => v + " ");
command.use = /^ev$/i as RegExp;

//OPTION
command.disable = false;
command.beta = false;
command.support = {
    android: true,
    linux: true,
    windows: true
};

module.exports = command;
