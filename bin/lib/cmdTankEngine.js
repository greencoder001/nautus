const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const { spawn } = require('child_process')
const YAML = require('yamljs')
const uuid = require('uuid')
const { resolveFiles, resolveFilesPlusFolders, resolveMinimum } = require('./pathResolver')

const spwn = (comd, args, cwd = null) => {
    return new Promise((resolve, reject) => {
        const prcss = spawn(comd, args, {
            cwd: cwd || process.cwd(),
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
            resolve(code || 0)
        })

        process.stdin.pipe(prcss.stdin)
    })
}

const f = async (filename, fix, tank, rawData = null) => {
    let cmd
    if (rawData) {
        cmd = rawData
    } else {
        const PATH = path.join(process.cwd(), 'nautus', filename)
        if (!fs.existsSync(PATH)) return console.log(chalk.red('Error: Please make sure file ' + PATH + ' exists!'))
        const parsed = YAML.parse(fs.readFileSync(PATH).toString('utf8'))
        const commandIdentifier = fix ? 'fixCommand' : 'command'
        if (!parsed.tanks[tank]) return console.log(chalk.red('Error: Tank ' + tank + ' not found in yaml file'))
        const t = parsed.tanks[tank]
        if (!t[commandIdentifier]) return console.log(chalk.red('Error: command not specified'))
        cmd = t[commandIdentifier]
    }

    // Parse cmd


    // Run it
    if (cmd.startsWith('@ONCE')) {
        if (await spwn(cmd.substring(5), []) !== 0 ) {
            console.log(chalk.red('Errror while running command!'))
            return
        }
    } else if (cmd.startsWith('@COPY')) {
        cmd = cmd.substring(5)
        const cpp = path.join(require('os').homedir(), `nautus-random-path-${uuid.v4()}`)
        const res = resolveMinimum()
        for (const fp of res) {
            fs.moveSync(fp, path.join(cpp, fp), { overwrite: true })
        }
        cmd = cmd.replace(/\$\{filename\}/gi, cpp)
        if (await spwn(cmd, [], cpp) !== 0) {
            console.log(chalk.red('Errror while running command!'))
            for (const fp of res) {
                fs.moveSync(path.join(cpp, fp), fp, { overwrite: true })
            }
            fs.rmSync(cpp)
            return
        }
        for (const fp of res) {
            fs.moveSync(path.join(cpp, fp), fp, { overwrite: true })
        }
        fs.rmSync(cpp)
    } else {
        for (const fp of resolveFiles()) {
            if (await spwn(cmd.replace(/\$\{filename\}/gi, fp), []) !== 0) {
                console.log(chalk.red('Errror while running command!'))
                return
            }
        }
    }
    
    return true
}

module.exports = async (...args) => {
    if (await f(...args) !== true) {
        process.exit(1)
    }
    return
}