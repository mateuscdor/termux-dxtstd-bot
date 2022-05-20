import * as fs from "fs"
import * as path from "path"

export function ContactsHandler (contact) {
    const db = globalThis.db
    const id = contact[0].id
    if (!db.users[id]) { 
        const user = JSON.parse(String(fs.readFileSync(path.join(__dirname, '..', '..', '..', 'assets', 'newUser.json'))))
        user.id = id
        user.profile.name.notify = contact[0].notify
        db.users[id] = user
    } else if (db.users[id]) {
        const user = db.users[id]
        if (user.profile.name.notify != contact[0].notify) {
            user.profile.name.notify = contact[0].notify
        }
    }
    db.save()
    globalThis.db = db
}