module.exports = [async (args) => {
    const chalk = require('chalk')
    const exec = require('../lib/executeScript')

    if (args.join(' ').includes('--help')) {
        console.log('This command will run your code.')
        console.log('To define how to run your code, please edit ' + chalk.cyan('./nautus/scripts/@Run.js'))
    } else {
        await exec('Prep')
        await exec('Run')
    }
}, 'run [--help]', 'Runs your code']