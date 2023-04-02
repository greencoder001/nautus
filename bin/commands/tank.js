module.exports = [async (args) => {
    const chalk = require('chalk')
    const path = require('path')
    const fs = require('fs-extra')
    if (!require('../lib/isProjectInitialized')()) return console.log(require('chalk').red('This command require a nautus project. Initialize it using ' + require('chalk').cyan('nautus create') + '!'))
    
    function fillUp(txt, c) {
        if (txt.length >= c) return txt
        txt = txt + ' '.repeat(c - txt.length)
        return txt
    }

    if ((typeof args[0] !== 'string' || args[0].trim().length === 0) || (args.join(' ').includes('--help'))) {

        function show (a, b) {
            console.log(fillUp(a, 30) + chalk.grey(fillUp(b, 66)))
        }

        console.log('\n' + chalk.bgCyan(chalk.white('                                            Commands                                            ')))
        console.log(chalk.cyan('Use nautus tank <tankname> and a command from below:'))
        show('nautus tank ls', 'Lists all tanks (no need to specify a tank here!)')
        show('create', 'Creates a new tank')
        show('delete', 'Deletes an existing tank')
        show('paths', 'Gives you a nice UI to mage paths')
        show('include <path>', 'Includes a path')
        show('exclude <path>', 'Excludes a path that would be included by the above')
        show('refactor [options] [-h]', 'Refactors your code. Use refactor -h for more help')
        show('format [options] [-h]', 'Formats your code. Use format -h for more help')
        show('lint [--fix]', 'Lints or fixes your code')
        show('protect', 'Protects this tank against changes')
        return
    }

    // Check if create or ls command
    if (args[1] === 'create') {
        if (args[0].length < 2) return console.log(chalk.red('Error: Tank name has to be at least 2 characters long'))
        if (JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json'))).map(e => e.id).includes(args[0])) console.log(chalk.red('Error: Tank already exists'))
        
        const tanks = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json')))
        tanks.push({
            id: args[0],
            paths: {
                include: [],
                exclude: []
            },
            protected: false
        })
        fs.writeFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json'), JSON.stringify(tanks))
        
        console.log(chalk.green('Successfully created tank ' + args[0]))
    } else if (args[0] === 'ls' || args[1] === 'ls') {
        const t = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json')))
        console.log(chalk.bgCyan(chalk.white(fillUp('Tanks:', Math.max(...t.map(e => e.id.length))))))
        for (const T of t) {
            console.log(T.id)
        }
    } else {
        // Check if tank exists
        if (!JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json'))).map(e => e.id).includes(args[0])) {
            return console.log(chalk.red('Error: Tank doesn\'t exist. Create it using ' + chalk.cyan('nautus tank ' + args[0] + ' create')))
        }

        if (args[1] === 'delete') {

        } else if (args[1] === 'paths') {

        } else if (args[1] === 'include') {

        } else if (args[1] === 'exclude') {

        } else if (args[1] === 'refactor') {

        } else if (args[1] === 'format') {

        } else if (args[1] === 'lint') {

        } else if (args[1] === 'protect') {

        } else {
            console.log(chalk.red('Error: Unknown command ' + args[1]))
            console.log(chalk.red('Use "nautus tank --help" for a list of commands'))
            return
        }
    }


}, 'tank <tank> <cmd> [options]', 'Seperates your code (tank --help for more info)']