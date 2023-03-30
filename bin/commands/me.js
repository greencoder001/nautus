module.exports = [async (args) => {
    const chalk = require('chalk')
    const readline = require('readline-sync')
    const fs = require('fs-extra')
    const path = require('path')
    const ipi = require('../lib/isProjectInitialized')
    const local = args.join(' ').includes('--local')
    const { Input, Toggle } = require('enquirer')
    const prompt = async (msg, defaultv) => {
        const p = new Input({
            message: msg,
            initial: defaultv
        })
        return await p.run()
    }
    if (local && !ipi()) return console.log(chalk.red('Error: Please create a project first'))
    if (local) console.log(chalk.gray('[INFO] This will only be applied to current project'))
    const savepath = local ? path.join(process.cwd(), 'nautus', '.internal', '.nautusme') : path.join(require('os').homedir(), '.nautusme')
    console.log(chalk.gray('[INFO] This will be used to complete boilerplate code. If you don\'t want to answer a question just leave it blank'))

    const realName = await prompt('Real (full) name')
    const githubUsername = await prompt('GitHub Username')
    const name = await prompt('I like to be called')
    const gender = ((await (new Toggle({
        message: 'Gender',
        enabled: 'female',
        disabled: 'male'
    })).run()) ? 'female' : 'male')

    const email = await prompt('E-Mail')

    const string = JSON.stringify({
        realName,
        githubUsername,
        name,
        gender,
        email
    })

    fs.writeFileSync(savepath, string)

}, 'me [--local]', 'Fill out a form about you (only for this project when --local)']