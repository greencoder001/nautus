module.exports = [async (args) => {
    const chalk = require('chalk')
    const exec = require('../lib/executeScript')

    if (args.join(' ').includes('--help')) {
        console.log('This command will release your code.')
        console.log('To define how to release your code, please edit ' +
            chalk.cyan('./nautus/scripts/@Release.js'))

        console.log('\nUse release [major|minor|patch] to specify the release type')
    } else {
        if (typeof args[0] === 'string' && (args[0] === 'major' || args[0] === 'minor' || args[0] === 'patch')) {
            global.releasetype = args[0]
            await exec('Release')
        } else {
            global.releasetype = 'minor'
            await exec('Release')
        }
    }
}, 'release [type] [--help]', 'Releases your code']