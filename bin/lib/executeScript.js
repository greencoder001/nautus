const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const { exec, spawn } = require('child_process')

const runScript = async (scriptName, exitfunc = process.exit) => {
    if (typeof scriptName !== 'string') throw new TypeError('scriptName must be a string')
    const scriptPath = path.join(process.cwd(), 'nautus', 'scripts', `@${scriptName}.js`)
    const script = require(scriptPath)

    const cmd = command => {
        return new Promise((resolve, reject) => {
            if (typeof command !== 'string') throw new TypeError('command must be a string')
            exec('cd ' + process.cwd() + ' && ' + command, (error, stdout, stderr) => {
                if (error) {
                    return reject([error.code, (stdout || '') + (stderr || '')])
                }
                resolve([0, (stdout || '') + (stderr || '')])
            })
        })
    }

    const os = () => {
        const platform = require('os').platform()
        if (platform === 'darwin') return 'mac'
        if (platform === 'win32') return 'windows'
        if (platform === 'linux') return 'linux'
        return 'unknown'
    }

    const info = (...what) => {
        console.log(...what)
    }

    const warn = (...what) => {
        console.warn(chalk.yellow(...what))
    }

    const error = (...what) => {
        console.error(chalk.red('Error:'))
        console.error(...what)
        exitfunc(1)
    }

    const exit = exitfunc

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
                resolve(code || 0)
            })

            process.stdin.pipe(prcss.stdin)
        })
    }

    await script(cmd, os, info, warn, error, exit, runScript, spwn, {
        chalk,
        fse: fs,
        fs: require('fs'),
        path: path,
        axios: require('axios')
    })
}

module.exports = runScript