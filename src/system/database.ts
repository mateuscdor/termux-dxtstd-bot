/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from "fs"
import * as path from "path"
import { makeInMemoryStore } from "@adiwajshing/baileys"

const path_database = path.join(__dirname, '..', '..', 'database/')
const path_database_user = path_database + "users.json";
const path_database_group = path_database + "groups.json";
const path_database_store = path_database + "store.json";

((!fs.existsSync(path_database)) && fs.mkdirSync(path_database))

const database = {} as any
      database.users = fs.existsSync(path_database_user) ? JSON.parse(String(fs.readFileSync(path_database_user))) : {} 
      database.groups = fs.existsSync(path_database_group) ? JSON.parse(String(fs.readFileSync(path_database_group))) : {}
      database.save = function (this: any, type: string) {
    switch (type) {
        case 'user':
        case 'users': 
            fs.writeFileSync(path_database_user, JSON.stringify(this.users, null, '\t'))
            break
        case 'group':
        case 'groups':
            fs.writeFileSync(path_database_group, JSON.stringify(this.groups, null, '\t'))
            break
        default:
            fs.writeFileSync(path_database_user, JSON.stringify(this.users, null, '\t'))
            fs.writeFileSync(path_database_group, JSON.stringify(this.groups, null, '\t'))
    }
}

      database.store = makeInMemoryStore({})
      fs.existsSync(path_database_store) ? database.store.readFromFile(path_database_store) : {} 
      database.store.save = function (this: any) {
    fs.writeFileSync(path_database_store, JSON.stringify(this.toJSON(), null, '\t'))
}

export {
    database
}