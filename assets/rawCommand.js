const command = async (data) => {
    
}

//PERMISSION
command.permission = {
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
command.permission.owner = false;

command.permission.group = false;
command.permission.private = false;

command.permission.admin.bot = false;
command.permission.admin.normal = false;
command.permission.admin.super = false;

command.permission.premium = false;

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
command.need.register = true;
command.need.limit.amount = 0;
command.need.cash.amount = 0;
command.need.level = 0;

//INFO
command.name = '';
command.help = [''];
command.tags = [''];
command.use = (/^s$/i);

//OPTION
command.disable = false;
command.beta = false;
command.support = {
    android: true,
    linux: true,
    windows: true
}

module.exports = command;