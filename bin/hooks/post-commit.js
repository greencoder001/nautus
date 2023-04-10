const path = require('path')
const fs = require('fs-extra')
const { spawn } = require('child_process')

const spwnSilent = (comd, args) => {
    return new Promise((resolve, reject) => {
        const prcss = spawn(comd, args, {
            cwd: process.cwd(),
            env: process.env,
            shell: true
        })

        prcss.stderr.on('data', (data) => {
            process.stderr.write(data.toString())
        })


        prcss.on('exit', (code) => {
            if ((code || 0) !== 0) process.exit(code)
            resolve(code || 0)
        })
    })
}

module.exports = async () => {
    const hookRules = fs.readJSONSync(path.join(process.cwd(), 'nautus', '.internal', 'hook-rules.json'))
    
    if (hookRules['Fetch & Push git repo after commit (Not recommended in most cases)']) {
        await spwnSilent('git', ['fetch'])
        await spwnSilent('git', ['push'])
        console.log(require('chalk').green('✅ Pushed repo'))
    }
}