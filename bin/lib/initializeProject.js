module.exports = async () => {
    const readline = require('readline-sync')
    const chalk = require('chalk')
    const fs = require('fs')
    const os = require('os')
    const path = require('path')
    const dir = path.join(process.cwd(), 'nautus')

    fs.mkdirSync(dir)
    fs.mkdirSync(path.join(dir, '.internal'))
    if (fs.existsSync(path.join(os.homedir(), '.nautusme'))) {
        fs.copyFileSync(path.join(os.homedir(), '.nautusme'), path.join(dir, '.internal', '.nautusme'))
    } else {
        fs.writeFileSync(path.join(dir, '.internal','.nautusme'), JSON.stringify({
            realName: '',
            githubUsername: '',
            name: '',
            gender: '',
            email: ''
        }))
    }
}