const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const shq = require('shell-quote')
const { exec, spawn } = require('child_process')
const requireRuntime = require('require-runtime')

const runScript = async (scriptName, exitfunc = process.exit, isAgent = false) => {
    if (typeof scriptName !== 'string') throw new TypeError('scriptName must be a string')
    const scriptPath = isAgent ? path.join(process.cwd(), 'nautus', 'agents', `@${scriptName}.js`) : path.join(process.cwd(), 'nautus', 'scripts', `@${scriptName}.js`)
    const script = requireRuntime(scriptPath)

    const cmd = command => {
        return new Promise((resolve, reject) => {
            if (typeof command !== 'string') throw new TypeError('command must be a string')
            exec('cd ' + shq(process.cwd()) + ' && ' + command, (error, stdout, stderr) => {
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

    async function findBinCommand(binCommand) {
        const nodeModulesDir = path.join(process.cwd(), 'node_modules');
        const packageJsonFiles = await fs.readdir(nodeModulesDir);

        const binaryPaths = [];
        for (const packageJsonFile of packageJsonFiles) {
            const packageJsonPath = path.join(nodeModulesDir, packageJsonFile, 'package.json');

            if (await fs.pathExists(packageJsonPath)) {
                const packageJson = await fs.readJson(packageJsonPath);

                if (packageJson.bin && packageJson.bin[binCommand]) {
                    console.log('FOUND ONE!')
                    const binaryPath = path.join(nodeModulesDir, packageJsonFile, packageJson.bin[binCommand]);
                    binaryPaths.push(binaryPath);
                }
            }
        }

        return binaryPaths[0];
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

    async function nodeBin(command, args = []) {
        const binCmdPath = findBinCommand(command)
        console.log('FINALBINPATH:', binCmdPath)
        if (!binCmdPath) return error(`${command} not found. Make sure to install the right package locally!`)
        return await spwn('cmd', ['/c', binCmdPath, ...args])
    }

    await script(cmd, os, info, warn, error, exit, runScript, spwn, {
        chalk,
        fse: fs,
        fs: require('fs'),
        path: path,
        axios: require('axios')
    }, nodeBin)
}

module.exports = runScript