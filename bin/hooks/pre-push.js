const path = require('path')
const fs = require('fs-extra')
const { spawn } = require('child_process')

const spwn = (comd, args) => {
    return new Promise((resolve, reject) => {
        const prcss = spawn(comd, args, {
            cwd: process.cwd(),
            env: process.env,
            shell: true
        })


        prcss.stdout.on('data', (data) => {
            process.stdout.write(data.toString())
        })

        prcss.stderr.on('data', (data) => {
            process.stderr.write(data.toString())
        })

        prcss.on('exit', (code) => {
            if ((code || 0) !== 0) process.exit(code)
            resolve(code || 0)
        })

        process.stdin.pipe(prcss.stdin)
    })
}

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
    
    if (hookRules['Build code before push']) {
        await spwn('nautus', ['build'])
        await spwnSilent('git', ['add', '.'])
        console.log(require('chalk').green('✅ Built code'))
    }
    
    if (hookRules['Test code before push']) {
        await spwn('nautus', ['test'])
        await spwnSilent('git', ['add', '.'])
        console.log(require('chalk').green('✅ Tested code'))
    }
}