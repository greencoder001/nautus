module.exports = [async (args) => {
    const engine = require('../lib/kelpEngine')
    const axios = require('axios')
    const chalk = require('chalk')

    if (!require('../lib/isProjectInitialized')()) return console.log(require('chalk').red('This command require a nautus project. Initialize it using ' + require('chalk').cyan('nautus create') + '!'))

    function fillUp(txt, c) {
        if (txt.length >= c) return txt
        txt = txt + ' '.repeat(c - txt.length)
        return txt
    }

    if (!args[0] || typeof args[0] !== 'string' || args[0].trim().length < 1) {
        console.log(chalk.red(`Please provide a generator like this ${chalk.cyan('nautus use [generator-name]')}! Also make sure to remove the nautus- infront of the generator name!`))
        console.log(`\n${chalk.bgCyan(chalk.white('                                      Available Generators                                      '))}`)
        const res = await axios.get('https://registry.npmjs.org/-/v1/search?text=nautus&size=250')
        const cmds = res.data.objects.map(p => {
            return { name: p.package.name, description: p.package.description }
        }).filter(p => p.name.startsWith('nautus-')).map(p => {
            return { name: p.name.replace('nautus-', ''), description: p.description }
        }).sort((a, b) => a.name - b.name)

        for (const cmd of cmds) {
            console.log(fillUp(cmd.name, 30) + chalk.grey(fillUp(cmd.description, 66)))
        }

        return
    }

    engine(args[0].trim(), 'use', false)
}, 'use <framework>', 'Initializes a framework / runtime']