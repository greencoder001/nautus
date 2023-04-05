module.exports = [async (args) => {
    const chalk = require('chalk')
    const path = require('path')
    const fs = require('fs-extra')
    const $path = args[0]
    const providers = args.slice(1)
    if (!$path) return console.log(chalk.red('Please provide a path!'))
    if (providers.length === 0) return console.log(chalk.red('Please provide a provider!'))

    for (const provider of providers) {
        fs.appendFileSync(path.join(process.cwd(), `.${provider}ignore`), '\n' + $path)
    }

    console.log(chalk.green('Successfully added ignore paths!'))
}, 'ignore <path> <provider1> [provider2] [...]', 'Adds a path to your ignore files. Example usage: ignore dist git npm']