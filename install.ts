import * as readline from 'readline';
import { spawn, spawnSync, exec, execSync } from 'child_process';
import * as fs from 'fs'
import * as os from 'os'

const PLATFORM = process.platform
console.log('Detected Platform: %s', PLATFORM)
const createInput = function () {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}

const PACKAGE_LINUX = "libreoffice wget curl git ffmpeg sox imagemagick"
const PACKAGE_ANDROID = "nodejs wget curl git ffmpeg sox imagemagick"
const PACKAGE_WINDOWS = ""

const NODEJS_LINUX = ""
const NODEJS_ANDROID = ""

const PACKAGE = {
    android: PACKAGE_ANDROID,
    linux: PACKAGE_LINUX
}

const NODEJS = {
    android: NODEJS_LINUX,
    linux: {
        amd64: "https://nodejs.org/dist/v18.3.0/node-v18.3.0-linux-x64.tar.gz",
        arm64: "https://nodejs.org/dist/v18.3.0/node-v18.3.0-linux-arm64.tar.gz"
    }
}

if (PLATFORM == "android") {
    let input = createInput()
    
    const SpawnAPT = function () {
        input.question('Install package (APT)? [y/n]: ', () => {
            const ArgsAPT = ("install " + PACKAGE_ANDROID + " -y").split(' ')
            
        })
    }
    
    const NodeJS = function () {
        input.question('Install NODEJS? [y/n]: ', () => {
            const ArgsAPT = ("install " + "nodejs" + " -y").split(' ')
        })
    }
    
} else if (PLATFORM == "linux") {
    
    const CheckPackageManager = function () {
        const APT = '/usr/bin/apt';
        const PACMAN = '/usr/bin/pacman';
        const APK = '/usr/bin/apk'
        
        const PACKAGE_MANAGER = {
            APT: {
                executeable: '/usr/bin/apt',
                install: 'install',
                upgrade: 'upgrade',
                update: 'update'
            },
            PACMAN: {
                executeable: '/usr/bin/pacman',
                install: '-S',
                upgrade: '-Syu',
                update: '-Syu'
            },
            APK: {
                executeable: '/usr/bin/apk',
                install: 'add',
                upgrade: 'upgrade',
                update: 'update'
            },
            DNF: {
                executeable: '/usr/bin/dnf',
                install: 'install',
                upgrade: 'upgrade',
                update: 'check-update'
            },
            YUM: {
                executeable: '/usr/bin/yum',
                install: 'install',
                upgrade: 'upgrade',
                update: 'update'
            }
        }
        let result = {}
        Object.keys(PACKAGE_MANAGER).forEach(PM => {
            if (fs.existsSync(PACKAGE_MANAGER[PM].executeable)) {
                console.log('Detected Package Manager: %s', PM)
                result = PACKAGE_MANAGER[PM]
            }
        })
        
        if (result == {}) {
            console.log('No Package Manager support..')
            console.log('exit...')
            process.exit()
        }
        
        return result as any
    }
    
    const opts = {
        env: {
            ...process.env
        },
        stdio: 'inherit'
    } as any
    const SpawnPM = async function () {
        const PACKAGE_MANAGER = CheckPackageManager();
        const SpawnPMUpdate = function () {
            return spawn(PACKAGE_MANAGER.executeable, [PACKAGE_MANAGER.update], opts)
        }
        const SpawnPMUpgrade = function () {
            return spawn(PACKAGE_MANAGER.executeable, [PACKAGE_MANAGER.upgrade], opts)
        }
        const SpawnPMInstall = function () {
            return spawn(PACKAGE_MANAGER.executeable, [PACKAGE_MANAGER.install].concat(PACKAGE['linux'].split(' ')), opts)
        }
        
        await new Promise((resolve) => {
            const Update = SpawnPMUpdate()
            Update.on('exit', () => {
                const Upgrade = SpawnPMUpgrade()
                Upgrade.on('exit', () => {
                    const Install = SpawnPMInstall()
                    Install.on('exit', () => {
                        resolve('a')
                    })
                })
            })
        })
    }
    
    let input = createInput()
    const execute = async function () {
        const PM = await new Promise((resolve, reject) => {
            input.question('Install Package? [y/n]: ', async (answer) => {
                input.close()
                if (answer == 'y') {
                    await SpawnPM()
                }
                return resolve("a")
            })
        })
        
        input = createInput()
        const NodeJS = await new Promise((resolve, reject) => {
            input.question('Install/Upgrade NodeJS? [y/n]: ', async (answer) => {
                input.close()
                if (answer == 'y') {
                    const opts = {
                        cwd: '/tmp',
                        env: {
                            ...process.env,
                            PWD: '/tmp'
                        },
                        stdio: 'inherit'
                    } as any
                    console.log('Downloading NodeJS')
                    
                    if (!fs.existsSync('/tmp/nodejs.tar.gz')) {
                        await execSync(`curl ${NODEJS['linux'][os.arch()]} --output "/tmp/nodejs.tar.gz"`, opts)
                    }
                    
                    console.log('Extract NodeJS')
                    await execSync('mkdir /tmp/nodejs', opts)
                    await execSync(`tar xvfz /tmp/nodejs.tar.gz -C /tmp/nodejs`, opts)
                    
                    console.log('Move NodeJS to /usr/bin (ACCESS ROOT REQ)')
                    await execSync(`sudo cp -rf /tmp/nodejs/*/* /usr/`, opts)
                    
                    console.log('Remove TMP')
                    await execSync(`sudo rm -rf /tmp/node*`, opts)
                    
                    console.log('Successfull install NodeJS...')
                }
                return resolve("a")
            })
        })
        input = createInput()
        const NPM = await new Promise((resolve, reject) => {
            input.question('Install Package Bot (NPM)? [y/n]: ', (answer) => {
                input.close()
                if (answer == 'y') {
                    await execSync('npm install --no-bin-links --production')
                }
            })
        })
    }
    execute()
}
