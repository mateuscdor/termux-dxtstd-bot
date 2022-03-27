const fetcher = require('../lib/fetcher.js')

module.exports = async (group) => {
    try {
        const groupdata = global.db.groups[group.jid]
        if (!groupdata.config.greeting.status) return;
        
        if (group.action == 'add') {
            let username;
            let manyParticipant = false;
            if (group.participant.length > 1) username = `${group.participant.length} Participant...`, manyParticipant = true;
            else if (group.participant.length == 1) username = global.db.users[group.participant[0]] ? global.db.users[group.participant[0]].profile.name.saved || global.db.users[group.participant[0]].profile.name.notify : `+${group.participant[0].split('@')[0]}`;
            
            var pp_user = manyParticipant ? ('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60') : (await client.profilePictureUrl(group.participant[0], 'image') || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60')
            
            let dirImg = dir.assets + "group/welcome/"
            let file = fs.readdirSync(dirImg).filter(filename => filename.endsWith('.png'))
            var random = Math.floor(Math.random() * file.length)
            
            const ppBuff = fetcher.getBuffer(pp_user)
            
            //Load File
            let image = await Jimp.read(dirImg + file[random])
            let ppImg = await Jimp.read(ppBuff)
            let font = await Jimp.loadFont(dir.assets + "font/Montserrat-Mid.ttf.fnt")
            
            image.print(font, 305, 525, {
                text: username
            }, 2000, 500) //NAME USER
            image.print(font, 382, 613, {
                text: groupdata.subject
            }, 2000, 500) //NAME GROUPS
            
            //Picture Profile User
            ppImg.resize(200, 200) //Resize Picture
            ppImg.circle() //Crop to circle
            image.blit(ppImg, 28, 300) //Add to image
            image.resize(Math.floor(1270*0.9), Math.floor(720*0.9))
            //END 
            
            let caption = ((groupdata.config.greeting.welcome).replace('@user', username)).replace('@subject', groupdata.subject)
            
            await client.sendMessage(group.jid, { image: await image.getBufferAsync("image/png"), mimetype: 'image/png' })
            
        } else if (group.action == 'remove') {
            
        }
    } catch (e) {
        logger.error(e)
    }
}