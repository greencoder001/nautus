module.exports = [async (args) => {
    const chalk = require('chalk')
    if (!require('../lib/isProjectInitialized')()) return console.log(require('chalk').red('This command require a nautus project. Initialize it using ' + require('chalk').cyan('nautus create') + '!'))
    console.log(chalk.gray('Coming soon...'))
}, 'kelp-try', '@dontshow']