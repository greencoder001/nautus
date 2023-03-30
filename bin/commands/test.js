module.exports = [async (args) => {
    const chalk = require('chalk')
    const exec = require('../lib/executeScript')
    if (!require('../lib/isProjectInitialized')()) return console.log(require('chalk').red('This command require a nautus project. Initialize it using ' + require('chalk').cyan('nautus create') + '!'))

    if (args.join(' ').includes('--help')) {
        console.log('This command test build your code.')
        console.log('To define how to test your code, please edit ' +
            chalk.cyan('./nautus/scripts/@Test.js'))
    } else {
        await exec('Test')
    }
}, 'test [--help]', 'Tests your code']