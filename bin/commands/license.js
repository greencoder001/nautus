module.exports = [async (args) => {
    const chalk = require('chalk')
    const fs = require('fs-extra')
    const path = require('path')
    const q = require('../lib/prompts')
    const { getLicense } = await import('license')
    const about = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', '.nautusme')))

    if (fs.existsSync(path.join(process.cwd(), 'LICENSE')) && !(await q.confirm('A LICENSE already exists, do you want to replace it?'))) {
        console.log(chalk.red('Didn\'t generate license.'))
    } else {
        const lName = await q.prompt('License:', 'MIT', require('../lib/regexes').license, false)
        fs.writeFileSync(path.join(process.cwd(), 'LICENSE'), getLicense(lName, {
            author: (about.realName || about.name) + ' (' + about.githubUsername + ') <' + (about.email || 'No email provided') + '>',
            name: (about.realName || about.name) + ' (' + about.githubUsername + ') <' + (about.email || 'No email provided') + '>',
            year: (new Date()).getFullYear(),
            email: about.email,
            project: JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'project.json'))).name
        }))
        console.log(chalk.green('Successfully generated license file!'))
        console.log(chalk.cyan('Please make sure to take a look at this file and replace placeholders if necessary'))
    }
}, 'license', 'Generates a license file']