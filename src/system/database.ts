/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from "fs"
import * as path from "path"
import { makeInMemoryStore } from "@adiwajshing/baileys"

const path_db = path.join(__dirname, '..', '..', 'database/')
const path_db_user = path_db + "users.json";
const path_db_group = path_db + "groups.json";
const path_db_store = path_db + "store.json";

((!fs.existsSync(path_db)) && fs.mkdirSync(path_db))

const db = {} as any
      db.users = fs.existsSync(path_db_user) ? JSON.parse(String(fs.readFileSync(path_db_user))) : {} 
      db.groups = fs.existsSync(path_db_group) ? JSON.parse(String(fs.readFileSync(path_db_group))) : {}
      db.save = function (this: any, type: string) {
    switch (type) {
        case 'user':
        case 'users': 
            fs.writeFileSync(path_db_user, JSON.stringify(this.users, null, '\t'))
            break
        case 'group':
        case 'groups':
            fs.writeFileSync(path_db_group, JSON.stringify(this.groups, null, '\t'))
            break
        default:
            fs.writeFileSync(path_db_user, JSON.stringify(this.users, null, '\t'))
            fs.writeFileSync(path_db_group, JSON.stringify(this.groups, null, '\t'))
    }
}

      db.store = makeInMemoryStore({})
      fs.existsSync(path_db_store) ? db.store.readFromFile(path_db_store) : {} 
      db.store.save = function (this: any) {
    fs.writeFileSync(path_db_store, JSON.stringify(this.toJSON(), null, '\t'))
}

export {
    db as database
}