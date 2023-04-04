module.exports = [async (args) => {
    const chalk = require('chalk')
    if (!require('../lib/isProjectInitialized')()) return console.log(require('chalk').red('This command require a nautus project. Initialize it using ' + require('chalk').cyan('nautus create') + '!'))
    
    if (args.join(' ').includes('--help')) {
        console.log('This command can help you lint your code. To configure it take a look at ./nautus/lint.yaml. To run use nautus lint [--fix]')
    } else {
        await require('../lib/cmdTankEngine')('lint.yaml', args.join(' ').includes('--fix'), 'main')
        console.log(chalk.green('Successfully linted ' + (args.join(' ').includes('--fix') ? '& fixed ' : '') + ' your code!'))
    }

}, 'lint [--help] [--fix]', 'Lints your code']