module.exports = [async (args) => {
    const chalk = require('chalk')
    const readline = require('readline-sync')
    const fs = require('fs-extra')
    const path = require('path')
    const ipi = require('../lib/isProjectInitialized')
    const local = args.join(' ').includes('--local')
    if (local && !ipi()) return console.log(chalk.red('Error: Please create a project first'))
    if (local) console.log(chalk.gray('[INFO] This will only be applied to current project'))
    const savepath = local ? path.join(process.cwd(), '.nautus', '.nautusme') : path.join(require('os').homedir(), '.natusme')

    console.log(chalk.gray('[INFO] This will be used to complete boilerplate code. If you don\'t want to answer a question just leave it blank'))

    const realName = readline.question('Real (full) name: ')
    const githubUsername = readline.question('GitHub Username: ')
    const name = readline.question('I like to be called: ')
    let gender = null
    let genderTried = false
    while (gender !== 'male' && gender !== 'female' && gender !== '') {
        if (genderTried) console.log(chalk.yellow('Please choose a valid option or leave blank!'))
        genderTried = true
        gender = readline.question('Gender (male/female): ')
    }
    const email = readline.questionEMail('E-Mail: ')

    const string = JSON.stringify({
        realName,
        githubUsername,
        name,
        gender,
        email
    })

    fs.writeFileSync(savepath, string)

}, 'me [--local]', 'Fill out a form about you (only for this project when --local)']