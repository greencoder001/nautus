module.exports = [async (args) => {
    const chalk = require('chalk')
    const path = require('path')
    const fs = require('fs-extra')
    const q = require('../lib/prompts')
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
        show('refactor <respath> [-h]', 'Refactors your code. Use refactor -h for more help')
        show('format [options] [-h]', 'Formats your code. Use format -h for more help')
        show('lint [--fix]', 'Lints or fixes your code')
        show('protect', 'Protects this tank against changes')
        show('cmd <command> [-d] [-h]', 'Runs a command for every file. Use cmd -h for more help')
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
            if (!JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json'))).map(e => e.id).includes(args[0])) console.log(chalk.red('Error: Tank dosn\' exist'))

            let tanks = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json')))
            tanks = tanks.filter(tank => tank.id !== args[0])
            fs.writeFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json'), JSON.stringify(tanks))

            console.log(chalk.green('Successfully deleted tank ' + args[0]))
        } else if (args[1] === 'paths') {
            let exit = false
            while (!exit) {
                const menu = await q.select('What do you want to do?', [
                    'List paths',
                    'Include a path',
                    'Edit included paths',
                    'Exclude a path',
                    'Edit excluded paths',
                    'Exit'
                ])

                function getIncluded () {
                    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json'))).filter(e => e.id === args[0])[0].paths.include
                }

                function setIncluded (v) {
                    let uv = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json')))
                    uv = uv.map(e => {
                        if (e.id === args[0]) {
                            e.paths.include = v
                        }
                        return e
                    })
                    fs.writeFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json'), JSON.stringify(uv))
                }

                function getExcluded() {
                    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json'))).filter(e => e.id === args[0])[0].paths.exclude
                }

                function setExcluded(v) {
                    let uv = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json')))
                    uv = uv.map(e => {
                        if (e.id === args[0]) {
                            e.paths.exclude = v
                        }
                        return e
                    })
                    fs.writeFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json'), JSON.stringify(uv))
                }

                if (menu === 'List paths') {
                    console.log(chalk.cyan('Included:'))
                    for (const p of getIncluded()) {
                        console.log(p)
                    }
                    console.log()
                    console.log(chalk.cyan('Excluded:'))
                    for (const p of getExcluded()) {
                        console.log(p)
                    }
                } else if (menu === 'Include a path') {
                    console.log(chalk.cyan('Enter all paths or press enter to stop'))
                    let last = false
                    while (!last) {
                        const now = getIncluded()
                        const a = await q.prompt('Path', '', null, true)
                        if (a.trim() === '') {
                            last = true
                            break
                        }
                        now.push(a)
                        setIncluded(now)
                    }
                } else if (menu === 'Exclude a path') {
                    console.log(chalk.cyan('Enter all paths or press enter to stop'))
                    let last = false
                    while (!last) {
                        const now = getExcluded()
                        const a = await q.prompt('Path', '', null, true)
                        if (a.trim() === '') {
                            last = true
                            break
                        }
                        now.push(a)
                        setExcluded(now)
                    }
                } else if (menu === 'Edit included paths') {
                    let ps = getIncluded()
                    const toDel = await q.multiSelect('Select every path you don\'t want to include anymore:', ps)
                    ps = ps.filter(e => !toDel.includes(e))
                    setIncluded(ps)
                } else if (menu === 'Edit excluded paths') {
                    let ps = getExcluded()
                    const toDel = await q.multiSelect('Select every path you don\'t want to exclude anymore:', ps)
                    ps = ps.filter(e => !toDel.includes(e))
                    setExcluded(ps)
                } else {
                    exit = true
                }

                console.log()
            }
            console.log(chalk.green('Updated paths successfully'))
        } else if (args[1] === 'include') {
            function getIncluded() {
                return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json'))).filter(e => e.id === args[0])[0].paths.include
            }

            function setIncluded(v) {
                let uv = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json')))
                uv = uv.map(e => {
                    if (e.id === args[0]) {
                        e.paths.include = v
                    }
                    return e
                })
                fs.writeFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json'), JSON.stringify(uv))
            }

            const now = getIncluded()
            if (!args[2]) return console.log(chalk.red('Please provide a path'))
            now.push(args[2])
            setIncluded(now)
            console.log(chalk.green('Action was successful'))
        } else if (args[1] === 'exclude') {
            function getExcluded() {
                return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json'))).filter(e => e.id === args[0])[0].paths.exclude
            }

            function setExcluded(v) {
                let uv = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json')))
                uv = uv.map(e => {
                    if (e.id === args[0]) {
                        e.paths.exclude = v
                    }
                    return e
                })
                fs.writeFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json'), JSON.stringify(uv))
            }

            const now = getExcluded()
            if (!args[2]) return console.log(chalk.red('Please provide a path'))
            now.push(args[2])
            setExcluded(now)
            console.log(chalk.green('Action was successful'))
        } else if (args[1] === 'refactor') {
            if (args.includes('-h') || !args[2]) {
                console.log('This command can help you refactor your code using RegExScript. Please refer to GitHub for more info.')
            } else {

            }
        } else if (args[1] === 'format') {

        } else if (args[1] === 'lint') {

        } else if (args[1] === 'protect') {

        } else if (args[1] === 'cmd') {

        } else {
            console.log(chalk.red('Error: Unknown command ' + args[1]))
            console.log(chalk.red('Use "nautus tank --help" for a list of commands'))
            return
        }
    }


}, 'tank <tank> <cmd> [options]', 'Seperates your code (tank --help for more info)']