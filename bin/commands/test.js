module.exports = [async (args) => {
    const chalk = require('chalk')
    const exec = require('../lib/executeScript')

    if (args.join(' ').includes('--help')) {
        console.log('This command test build your code.')
        console.log('To define how to test your code, please edit ' +
            chalk.cyan('./nautus/scripts/@Test.js'))
    } else {
        await exec('Test')
    }
}, 'test [--help]', 'Tests your code']