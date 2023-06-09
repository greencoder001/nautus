module.exports = [async (args) => {
    const chalk = require('chalk')
    const exec = require('../lib/executeScript')
    const engine = require('../lib/agentEngine.js')
    if (!require('../lib/isProjectInitialized')()) return console.log(require('chalk').red('This command require a nautus project. Initialize it using ' + require('chalk').cyan('nautus create') + '!'))

    if (args.join(' ').includes('--help')) {
        console.log('This command will run your code.')
        console.log('To define how to run your code, please edit ' + chalk.cyan('./nautus/scripts/@Run.js'))
    } else {
        await exec('Prep')
        engine.runAll()
        let edr = false
        await exec('Run', async (runExitCode) => {
            edr = true
            await exec('Cleanup', (code) => {
                if (code !== 0) process.exit(code)
            })
            process.exit(runExitCode)
        })
        if (!edr) await exec('Cleanup')
        process.exit() // Make sure agents aren't running anymore
    }
}, 'run [--help]', 'Runs your code']