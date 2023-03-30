module.exports = [async (args) => {
    const chalk = require('chalk')
    const engine = require('../lib/kelpEngine')
    if (!require('../lib/isProjectInitialized')()) return console.log(require('chalk').red('This command require a nautus project. Initialize it using ' + require('chalk').cyan('nautus create') + '!'))

    engine(args[0].trim(), 'generator', true)
}, 'kelp-try', '@dontshow']