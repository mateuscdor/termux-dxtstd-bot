const NEW_USER = {
    id: '',
    uid: '',
    profile: {
        name: {
            notify: '',
            contact: ''
        }
    },
    status: {
        verified: false,
        banned: false,
        premium: {
            active: false,
            expired: 0
        }
    },
    level: 1,
    exp: {
        current: 0,
        need: 0
    },
   cash: 0,
    history: {
        purchase: {},
        donate: {},
        command: {
            last: ''
        }
    }
}

const NEW_GROUP = {
    config: {
        greeting: {
            active: false,
            welcome: 'Welcome @user, in group @subject!',
            leave: 'Goodbye @user, from @subject'
        },
        nsfw: false
    }
}

const NEW_CONFIG = {
    owner: {
        profile: {
            name: ''
        },
        NoPhone: ''
    },
    prefix: '%',
    timezone: 'Asia/Makassar',
    db: {
        name: 'main',
        dir: '',
        file: {}
    },
    ReadOnly: false,
    QRImage: false
}

export {
    NEW_USER,
    NEW_GROUP,
    NEW_CONFIG
}