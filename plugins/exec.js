const util = require('util');
let cp = require('child_process');
let {
    promisify
} = require('util');
let exec = promisify(cp.exec).bind(cp);


let command = async (data) => {
    let execu;
    try {
        execu = await exec(data.args.join(" "));
    } catch (e) {
        execu = e;
    } finally {
        if (execu.stderr) {
            client.sendMessage(data.from, {
              text: util.format(execu.stderr)
            }, {
                quoted: data.chat
            });
        } else if (execu != undefined && !execu.stdout) {
            client.sendMessage(data.from, {
              text: util.format(execu)
            }, {
                quoted: data.chat
            });
        }
        if (execu.stdout) {
            client.sendMessage(data.from, {
                text: util.format(execu.stdout)
            }, {
                quoted: data.chat
            });
        }
        
    }
};

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
    verified: true,
    limit: {
        amount: 0
    },
    cash: {
        amount: 0
    },
    level: 0
};
//INFO
command.name = 'exec';
command.help = ['exec']
command.tags = ['owner'];
command.use = (/^ex(ec)?$/);

//OPTION
command.disable = false;
command.beta = false;
command.support = {
    android: true,
    linux: true,
    windows: true
}

module.exports = command;