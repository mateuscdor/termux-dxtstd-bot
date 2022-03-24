//
//   /$$$$$$$                        /$$                /$$$$$$  /$$   /$$
//  | $$__  $$                      | $$               /$$__  $$| $$  | $$
//  | $$  \ $$  /$$$$$$  /$$$$$$$  /$$$$$$    /$$$$$$ | $$  \__/| $$  | $$
//  | $$  | $$ /$$__  $$| $$__  $$|_  $$_/   |____  $$| $$      | $$$$$$$$
//  | $$  | $$| $$$$$$$$| $$  \ $$  | $$      /$$$$$$$| $$      | $$__  $$
//  | $$  | $$| $$_____/| $$  | $$  | $$ /$$ /$$__  $$| $$    $$| $$  | $$
//  | $$$$$$$/|  $$$$$$$| $$  | $$  |  $$$$/|  $$$$$$$|  $$$$$$/| $$  | $$
//  |_______/  \_______/|__/  |__/   \___/   \_______/ \______/ |__/  |__/
//
//
//THX TO
//Rxyu
//Fauzan
//Restu
//Vania
//Sanz
//Arifin
//and ETC

//MAIN MODULE
const baileys = global.baileys = require("@adiwajshing/baileys");

//
const fs = require("fs");
const util = require('util');
const moment = require("moment-timezone");
const path = require("path");
const os = require("os");
const pino = require('pino');
const chalk = require('chalk');

//LOCAL MODULE
const P = require('./lib/P');

//DIR
const dir = global.dir = {
    home: path.join(__dirname, '/'),
    assets: path.join(__dirname, '/', 'assets'),
    database: path.join(__dirname, '/', 'database', '/'),
    handler: path.join(__dirname, '/', 'handler', '/'),
    lib: path.join(__dirname, '/', 'lib', '/'),
    log: path.join(__dirname, '/', 'log', '/'),
    plugins: path.join(__dirname, '/', 'plugins', '/'),
    tmp: path.join(__dirname, '/', 'tmp', '/'),
    sdcard: '/sdcard/'
};

//PATH
const authPath = dir.home + 'auth.json';

//CONFIG
const config = global.config = JSON.parse(
    fs.readFileSync(
        path.join(
            __dirname,
            'config.json'
        )
    )
);

//COLOR CHALK
const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

const bgcolor = (text, bgcolor) => {
    return !bgcolor ? chalk.green(text) : chalk.bgKeyword(bgcolor)(text)
}


//LOGGER
const pinoLevel = function (logLevel) {
    if (logLevel == 10) {
        return color(("[  " + "TRACE" + "  ]"), 'yellow')
    } else if (logLevel == 20) {
        return color(("[  " + "DEBUG" + "  ]"), 'yellow')
    } else if (logLevel == 30) {
        return color(("[  " + "INFO" + "  ]"), 'lime')
    } else if (logLevel == 40) {
        return color(("[  " + "WARN" + "  ]"), 'yellow')
    } else if (logLevel == 50) {
        return color(("[  " + "ERROR" + "  ]"), 'red')
    } else if (logLevel == 60) {
        return bgcolor(("[  " + "FATAL" + "  ]"), 'red')
    } else {
        return color(("[  " + "USERLVL" + "  ]"), 'white')
    }
}


const customPino = {
    time: timestamp => moment.tz(config.timezone).format('HH:mm:ss'),
    level: levelLog => pinoLevel(levelLog)
}

const msgFormatPino = function (logPino) {
    //console.log(logPino)
    return logPino.msg
}

const PINO = pino({
    prettyPrint: {
        levelFirst: false,
        colorize: true,
        ignore: 'pid,hostname',
        messageFormat: msgFormatPino,
        customPrettifiers: customPino
    }
})

const logger = global.logger = require('./lib/logger');


//DATABASE
global.db = {
    users: {},
    groups: {},
    session: {
        game: {},
        auth: {}
    }
};
global.db.users = JSON.parse(fs.readFileSync(path.join(dir.database, 'users.json')));
global.db.groups = JSON.parse(fs.readFileSync(path.join(dir.database, 'groups.json')));


//AUTH
const loadAuth = function () {
    let auth = {}
    try {
        if (!fs.existsSync(authPath))
            return logger.existnt();

        logger.load();
        auth = baileys.useSingleFileAuthState(authPath)
    } catch (e) {
        logger.error("Load auth error!");
        console.error(e)
    }
    return auth.state
};

const saveAuth = function (auth) {
    P.info("Save auth");
    fs.writeFileSync(
        authPath,
        JSON.stringify(auth, baileys.BufferJSON.replacer, 2)
    );
    return auth;
};


//PLUGIN LOADER
global.loadPlugin = function () {
    let pluginFilter = filename => /\.js$/.test(filename);
    global.plugins = {};
    for (let filename of fs.readdirSync(dir.plugins).filter(pluginFilter)) {
        filename = filename.replace('.js', '');
        try {
            let pluginLoading = require(path.join(dir.plugins, filename));
            if (pluginLoading.support && pluginLoading.support[os.platform()]) {
                global.plugins[filename] = pluginLoading
            } else {
                PINO.error(`Plugin ${filename.split('.')[0]} Does'nt support in your OS`)
            }
            
            if (pluginLoading.beta) {
                PINO.warn(`Plugin ${filename.split('.')[0]} still in beta, there may be errors when running`)
            }
            
            if (pluginLoading.disable) {
                PINO.warn(`Plugin ${filename.split('.')[0]} is disable! for reason check the script`)
            }
        } catch (e) {
            PINO.error(`[PLUGIN ${filename}] `, util.format(e));
            delete global.plugins[filename];
        }
    }
};

//START API
startClient = function () {
    const starting = baileys.default({
        logger: PINO,
        printQRInTerminal: true,
        auth: loadAuth(),
        version: [2, 2281, 0]
    });
    return starting;
};

//START BOT
const start = async () => {
    try {
        const client = global.client = startClient();
        loadPlugin();

        //AUTH UPDATE
        client.ev.on('creds.update', () => {
            saveAuth(client.authState);
        });

        //CONTACT
        client.ev.on('contacts.update', (contact) => {
            id = contact[0].id;
            if (global.db.users[id] === undefined) {
                user = JSON.parse(fs.readFileSync(path.join(dir.assets, 'newUser.json')));
                user.profile.name.notify = contact[0].notify;
                user.id = id;
                global.db.users[id] = user;
            }
            fs.writeFileSync(path.join(dir.database, 'users.json'), JSON.stringify(global.db.users, null, '\t'));
        });

        //EVENT HANDLER
        client.handler = require('./handler');
        //client.ev.on('messages.upsert', client.handler.newHandler);
        client.ev.on('messages.upsert',
            client.handler.handler);

        //CONNECTION UPDATE
        client.ev.on('connection.update',
            (update) => {
                if (update.qr) {
                    return logger.qr();
                }
                if (update.connection === 'close') {
                    fs.writeFileSync("./log/connection/closed.json", JSON.stringify(update, null, "\t"));
                    console.log(update);
                    statusCode = update.lastDisconnect.error.output ? update.lastDisconnect.error.output.statusCode: undefined;
                    logger.disconnect(`Code ${statusCode} ${baileys.DisconnectReason[`${statusCode}`]}`);
                    // reconnect if not logged out
                    if (statusCode !== baileys.DisconnectReason.loggedOut) {
                        delete global.client;
                        delete client;
                        logger.reconnect();
                        start();
                    }
                }
                if (update.connection === "open") {
                    logger.connected();
                    fs.writeFileSync("./log/connection/open.json", JSON.stringify(update, null, "\t"));
                }
                return client
            });
    } catch (e) {
        P.error(e);
        logger.error(e);
    }
};
start();


module.exports = start
