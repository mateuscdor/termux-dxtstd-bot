import { startClient, pathAuth, saveAuth } from "./client"

const start = async function () {
    const client = global.client = startClient()
    client.ev.on('creds.update', () => {
        saveAuth(client.authState, pathAuth)
    })
    return client
}

start()