module.exports = [async (args) => {
    const engine = require('../lib/kelpEngine')
    const chalk = require('chalk')

    if (!require('../lib/isProjectInitialized')()) return console.log(require('chalk').red('This command require a nautus project. Initialize it using ' + require('chalk').cyan('nautus create') + '!'))

    if (!args[0] || typeof args[0] !== 'string' || args[0].trim().length < 1) {
        return console.log(chalk.red(`Error: Please provide a generator like this ${chalk.cyan('nautus kelp [generator-name]')}! Also make sure to remove the nautus- infornt of the generator name!`))
    }

    engine(args[0].trim(), 'generator', false)
}, 'kelp', 'Helps you create boilerplate code']