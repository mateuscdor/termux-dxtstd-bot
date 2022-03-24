const util = require("util")
const moment = require('moment-timezone')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json')))

const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

const bgcolor = (text, bgcolor) => {
    return !bgcolor ? chalk.green(text) : chalk.bgKeyword(bgcolor)(text)
}


const colors = ['red', 'white', 'black', 'blue', 'yellow', 'green', 'aqua', 'cyan']

//AUTH

const load = function () {
    let time = moment.tz(config.timezone).format('HH:mm:ss')
    
        let teks = time
    + color(' [  AUTH  ] ', 'yellow')
    + 'Load Auth...'
    console.log(teks)
}

const existnt = function () {
    let time = moment.tz(config.timezone).format('HH:mm:ss')
    
    let teks = time
    + color(' [  AUTH  ] ', 'yellow')
    + 'Auth Doesn\'t Exist'
    console.log(teks)
}


//CONNECTION

const qr = function () {
    let time = moment.tz(config.timezone).format('HH:mm:ss')
    
    let teks = time
    + color(' [  QR  ] ', 'yellow')
    + 'Scan This QR...'
    console.log(teks)
}

const connecting = function () {
    let time = moment.tz(config.timezone).format('HH:mm:ss')
    
    let teks = time
    + color(' [  CONNECTION  ] ', 'red')
    + "Connecting To WhatsApp Web..."
    console.log(teks)
}

const connected = function () {
    let time = moment.tz(config.timezone).format('HH:mm:ss')
    
    let teks = time
    + color(' [  CONNECTION  ] ', 'lime')
    + "Connected!"
    console.log(teks)
}

const reconnect = function () {
    let time = moment.tz(config.timezone).format('HH:mm:ss')
    
    let teks = time
    + color(' [  CONNECTION  ] ', 'red')
    + "Reconnect To WhatsApp Web..."
    console.log(teks)
}

const disconnect = function (reason) {
    let time = moment.tz(config.timezone).format('HH:mm:ss')
    
    let teks = time
    + color(' [  CONNECTION  ] ', 'red')
    + `Disconnect from WhatsApp Web (${reason})`
    console.log(teks)
}

//CHAT UPDATE

const pc = function (text, user, type) {
    let time = moment.tz(config.timezone).format('HH:mm:ss')
    
    let teks = time
    + color(' [  PRIVATE  ] ', 'cyan')
    + '"' + text + '"'
    + color(' From ', 'yellow')
    + user
    + color(`, MessageType: ${type}`, `lime`)
    console.log(teks)
}

const cmdpc = function (text, user, type) {
    let time = moment.tz(config.timezone).format('HH:mm:ss')
    
    let teks = time
    + color(' [  COMMAND  ] ', 'cyan')
    + '"' + text + '"'
    + color(' From: ', 'yellow')
    + user
    + color(`, MessageType: ${type}`, `lime`)
    console.log(teks)
}

const gc = function (text, user, group, type) {
    let time = moment.tz(config.timezone).format('HH:mm:ss')
    
    let teks = time
    + color(' [  GROUP  ] ', 'cyan')
    + '"' + text + '"'
    + color(' From: ', 'yellow')
    + user
    + color(', In Group: ', 'yellow')
    + group
    + color(`, MessageType: ${type}`, `lime`)
    console.log(teks)
}

const cmdgc = function (text, user, group, type) {
    let time = moment.tz(config.timezone).format('HH:mm:ss')
    
    let teks = time
    + color(' [  COMMAND  ] ', 'cyan')
    + '"' + text + '"'
    + color(' From: ', 'yellow')
    + user
    + color(', In Group: ', 'yellow')
    + group
    + color(`, MessageType: ${type}`, `lime`)
    console.log(teks)
}

//WARN

const error = function (error) {
    let time = moment.tz(config.timezone).format('HH:mm:ss')
    
    let teks = time
    + color(' [  ERROR  ] ', 'red')
    + `${util.format(error)}`

    console.log(teks)
}

module.exports = {
    //AUTH
    load,
    existnt,
    //CONNECTION
    qr,
    connecting,
    connected,
    reconnect,
    disconnect,
   
    //CHAT-UPDATE
    pc,
    cmdpc,
    gc,
    cmdgc,
    //
    error
}
