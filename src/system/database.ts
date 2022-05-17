import * as fs from "fs"

let path_db = "../../database/"
let path_db_user = path_db + "users.json"
let path_db_group = path_db + "groups.json"

const db = {} as any
      db.users = JSON.parse(String(fs.readFileSync(path_db_user)))
      db.groups = JSON.parse(String(fs.readFileSync(path_db_group)))

const saveDB = function (db: Object, type: string) {
    switch (type) {
        case 'user':
        case 'users': 
            fs.writeFileSync(path_db_user, JSON.stringify(db, null, '\t'))
            break
        case 'group':
        case 'groups':
            fs.writeFileSync(path_db_group, JSON.stringify(db, null, '\t'))
            break
        default: 
            return
    }
}

export {
    saveDB,
    db
}