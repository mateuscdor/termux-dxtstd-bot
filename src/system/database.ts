/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from "fs"
import * as path from "path"

const path_db = path.join(__dirname, '..', '..', 'database/')
const path_db_user = path_db + "users.json"
const path_db_group = path_db + "groups.json" 

const db = {} as any
      db.users = JSON.parse(String(fs.readFileSync(path_db_user))) 
      db.groups = JSON.parse(String(fs.readFileSync(path_db_group)))
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

export {
    db as database
}