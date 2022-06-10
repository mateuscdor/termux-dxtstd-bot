import * as fs from "fs"
import * as path from "path"

import { logger } from "../lib";
import { DatabaseType } from '../types'

import { AuthenticationState, useSingleFileAuthState, initAuthCreds, makeInMemoryStore, BufferJSON } from "@adiwajshing/baileys"

const PathDatabase = path.join(__dirname, '..', '..', 'database/')
!fs.existsSync(PathDatabase) && fs.mkdirSync(PathDatabase)

const MakePathDatabase = function (name: string='') {
    name = name || 'main'
    const DirDB = (path.resolve(__dirname, '..', '..', 'database', name) + '/')
    const FileConfigJSON = DirDB + 'config.json'
    const FileAuthJSON = DirDB + 'auth.json'
    const FileUsersJSON = DirDB + 'users.json'
    const FileGroupsJSON = DirDB + 'groups.json'
    const FileStoreJSON = DirDB + 'store.json'
    
    return {
        dir: DirDB,
        file: {
            config: FileConfigJSON,
            auth: FileAuthJSON,
            users: FileUsersJSON,
            groups: FileGroupsJSON,
            store: FileStoreJSON
        }
    }
}

const Stringify = function (value: object={}, replacer: any=null, space='\t') {
    return JSON.stringify((value || {}), (replacer), (space))
}

const NotEmptyFile = function (file) {
    const exist = fs.existsSync(file)
    if (exist) {
        const buffer = fs.readFileSync(file)
        if ((buffer).length < 1) {
            return false
        } else if ((buffer).length > 0) {
            return true
        } else return false
    } else return false
}

const NotEmptyJSON = function (value) {
    return (!(value == {}))
}

const exist = function (this: any, name: string='') {
    name = name || this.config.db.name || 'main'
    
    const PathDB = MakePathDatabase(name)
    return fs.existsSync(PathDB.dir)
}
const make = function (this: any, name: string='') {
    if (this.exist(name)) { 
        logger.warn('This database has exists!');
        this.load(name);
        return
    }
    
    name = name || this.config.db.name || 'main'
    this.config.db.name = name
    logger.info('Make database for "%s"...', name)

    const PathDB = MakePathDatabase(name)
    
    this.config.db.dir = PathDB.dir;
    this.config.db.file = PathDB.file;
    
    fs.mkdirSync(PathDB.dir)
    Object.keys(PathDB.file).forEach((value) => {
        fs.writeFileSync(PathDB.file[value], Stringify(this[value]))
    })
};

const load = function (this: any, name: string='') {
    name = name || this.config.db.name || 'main';
    this.config.db.name = name

    logger.debug('Load database "%s"...', name)

    if (!this.exist(name)) {
        logger.warn('This database doesn\'t exists!');
        this.make(name);
        return
    }
    
    const PathDB = MakePathDatabase(name)
    
    this.config.db.dir = PathDB.dir;
    this.config.db.file = PathDB.file;
    
    Object.keys(PathDB.file).forEach((value) => {
        if (value == "auth") {
            if (!NotEmptyFile(PathDB.file[value])) return
            this[value] = (useSingleFileAuthState(PathDB.file[value])).state;
            if (!this[value].creds) this[value].creds = initAuthCreds()
        } else {
            this[value] = NotEmptyFile(PathDB.file[value]) ? JSON.parse(String(fs.readFileSync(PathDB.file[value]))) : this[value]
        }
    })
}
const save = function (this: any, name: string='') {
    name = name || this.config.db.name || 'main'
    logger.debug('Save database "%s"...', name)
    
    const PathDB = MakePathDatabase(name);
    
    Object.keys(PathDB.file).forEach((value) => {
        if (NotEmptyJSON(this[value])) {
            if (value == "auth") {
                fs.writeFileSync(PathDB.file[value], Stringify(this[value], BufferJSON.replacer))
            } else {
                fs.writeFileSync(PathDB.file[value], Stringify(this[value]))
            }
        }
    })
}

export class Database {
    config = {
        db: {
            name: '',
            dir: '',
            file: {}
        }
    }
    auth = {
        creds: initAuthCreds(),
        keys: {}
    } as AuthenticationState
    users = {} 
    groups = {}
    store = {}
    
    exist = (name: string='') => {};
    make = (name: string='') => {};
    load = (name: string='') => {};
    save = (name: string='') => {};
    
    constructor(name: string='') {
        this.config.db.name = name || 'others'
        this.store = makeInMemoryStore({})
        this.exist = exist
        this.make = make
        this.load = load
        this.save = save
    }
}

