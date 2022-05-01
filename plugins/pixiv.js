const fs = require('fs')
const util = require('util');
const scrapper = require(dir.lib + 'scrapper.js')
const readmore = require(dir.lib + 'readmore.js')

const command = async (data) => {
    try {
        const pixiv = new scrapper.pixiv()
        
        let hasil = await pixiv.search(data.args.join(" "))
        
        if (hasil.error) return;
        const arrayIllust = hasil.body.illust.data
        
        const random = Math.floor(Math.random() * arrayIllust.length)
        let illust = await pixiv.illust(arrayIllust[random].id)
        
        client.sendMessage(data.from, {  image: { url: illust.body.urls.original } })
    } catch (e) {
      logger.error(e)
        client.sendMessage(data.from, {
            text: util.format(e)
        }, {
            quoted: data.chat
        })
    }
};
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
command.name = 'Pixiv';
command.help = ['pixiv'].map(v => v + "*<keyword>*");
command.tags = ['downloader'];
command.use = (/^pixiv$/i);

//OPTION
command.disable = false;
command.beta = false;
command.support = {
    android: true,
    linux: true,
    windows: true
};

module.exports = command;
