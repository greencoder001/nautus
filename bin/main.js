#! /usr/bin/env node

const argv = process.argv.slice(2)
const cmd = argv[0] || '@main'
argv[0] = cmd
const args = argv.slice(1)
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const { version } = require('../package.json')
const axios = require('axios')

;(async () => {
    for (const registeredCMD of fs.readdirSync(path.join(__dirname, 'commands'))) {
        const cmdName = registeredCMD.substring(0, registeredCMD.length - 3)
        if (cmd.toLowerCase() === cmdName.toLowerCase()) {
            const com = require(path.join(__dirname, 'commands', registeredCMD))[0]
            com(args)
            try {
                const newest = (await axios.get('https://registry.npmjs.org/nautus')).data['dist-tags'].latest
                if (newest > version) {
                    console.log(chalk.yellow('[INFO] A newer version of nautus is available! Use ') + chalk.cyan('npm i nautus -g') + chalk.yellow(' to update!'))
                }
            } catch { }
            return
        }
    }

    if (cmd.startsWith('@hook/')) {
        const hookName = cmd.substring(6)
        try {
            // deepcode ignore CodeInjection: We trust our users
            await require('./hooks/' + hookName + '.js')()
        } catch (err) {
            console.log(chalk.yellow(`Warn: Hook ${hookName} not found!`))
            console.log(err)
        }
        return
    }

    console.log(chalk.red(`Error: Command ${cmd} not found. Use ${chalk.cyan('nautus help')} for a list of commands!`))
})()
