module.exports = [async (args) => {
    const chalk = require('chalk')
    const isProjectInitialized = require('../lib/isProjectInitialized')
    const initializeProject = require('../lib/initializeProject')

    if (isProjectInitialized()) return console.log(chalk.red('Error: Directory is already a project. Please use nautus delete first!'))

    await initializeProject()

}, 'create', 'Creates a nautus project in the current directory (can be in use)']