module.exports = [async (args) => {
    const chalk = require('chalk')
    const exec = require('../lib/executeScript')

    if (args.join(' ').includes('--help')) {
        console.log('This command will build your code.')
        console.log('To define how to build your code, please edit ' +
            chalk.cyan('./nautus/scripts/@Build.js'))
    } else {
        await exec('Build')
    }
}, 'build [--help]', 'Builds your code']