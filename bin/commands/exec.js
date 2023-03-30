module.exports = [async (args) => {
    const chalk = require('chalk')
    const exec = require('../lib/executeScript')

    if (!require('../lib/isProjectInitialized')()) return console.log(require('chalk').red('This command require a nautus project. Initialize it using ' + require('chalk').cyan('nautus create') + '!'))
    
    if (typeof args[0] !== 'string' || args[0].length < 1) {
        console.log(chalk.red('Error: Please provide a script name'))
        console.log(chalk.cyan('Example: nautus exec Run'))
        process.exit(1)
    }

    await exec(args[0])
}, 'exec <script>', 'Run specific script']