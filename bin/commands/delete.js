module.exports = [async (args) => {
    const chalk = require('chalk')
    const isProjectInitialized = require('../lib/isProjectInitialized')
    const fs = require('fs-extra')
    const path = require('path')

    if (!isProjectInitialized()) return console.log(chalk.red('Error: Directory isn\'t a project. Please use nautus create first!'))

    fs.removeSync(path.join(process.cwd(), '.nautus'))

    console.log(chalk.green('Deleted Nautus project successfully'))

}, 'delete', 'Deletes a nautus project in the current directory (can be in use)']