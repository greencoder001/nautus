const YAML = require('yaml')
const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')

const getYML = () => {
    const yml = YAML.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', 'agents', 'agents.yaml')).toString('utf8'))
    return yml.agents
}

const engine = async (agentName) => {
    if (!fs.existsSync(path.join(process.cwd(), 'nautus', 'agents', `@${agentName}.js`))) {
        console.log(chalk.red(`[ERROR] Agent ${agentName} not found! Create it using nautus agent create ${name}`))
        process.exit(1)
    }

    const tanks = ((getYML()[agentName] || { watches: { tanks: ['main'] } }).watches || { tanks: ['main'] }).tanks || ['main']

    // Tank existance
    for (const tank of tanks) {
        // Check if tank exists
        if (!JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json'))).map(e => e.id).includes(tank)) {
            console.log(chalk.yellow(`[WARN] Tank ${tank} doesn't exist! Skipping watch process for this tank!`))
            continue
        }
    }

    function getIncluded(t) {
        return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json'))).filter(e => e.id === t)[0].paths.include
    }

    function getExcluded(t) {
        return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', 'tanks.json'))).filter(e => e.id === t)[0].paths.exclude
    }

    // Watch
    const chokidar = require('chokidar')
    const mini = require('minimatch')

    function isPathInTank($path, tank) {
        const include = getIncluded(tank)
        const exclude = getExcluded(tank)
        $path = $path.replace(process.cwd(), '')
        $path = $path.replace(/\\/g, '/')
        if ($path.startsWith('nautus/')) return false
        if ($path.startsWith('/')) $path = $path.substring(1)
        let oi = false
        for (const i of include) {
            if (mini($path, i)) oi = true
        }
        for (const x of exclude) {
            if (mini($path, x)) return false
        }
        return oi
    }

    const watcher = chokidar.watch(process.cwd(), {
        ignored: /^nautus\//, // ignore nautus dir
        persistent: true,
        ignoreInitial: true // ignore initial add events
    })

    let operating = false

    const runAgent = async ($path) => {
        const exec = require('./executeScript')
        await exec(agentName, process.exit, true)
    }

    const rAgent = async ($path) => {
        // Check if operating
        if (!operating) {
            // Only run when not operationg atm
            operating = true
            // Check if agent is responsible for $path
            for (const tank of tanks) {
                if (isPathInTank($path, tank)) {
                    // Found, stop checking
                    await runAgent($path)
                    break
                }
            }
            operating = false
        }
    }

    watcher
        .on('add', $path => rAgent($path))
        .on('change', $path => rAgent($path))
        .on('unlink', $path => rAgent($path))
        .on('unlinkDir', $path => rAgent($path))

    console.log(chalk.gray(`[INFO] Agent ${agentName} is running in background and watches tanks ${tanks.join(', ')}`))
}
engine.runAll = async () => {
    const yml = getYML()
    const agents = []

    for (const name of Object.keys(yml)) {
        const agent = yml[name]
        if (!fs.existsSync(path.join(process.cwd(), 'nautus', 'agents', `@${name}.js`))) {
            console.log(chalk.red(`[ERROR] Agent ${name} not found! Create it using nautus agent create ${name}`))
            process.exit(1)
        }
        agents.push(engine(name))
    }

    return await Promise.all(agents)
}

module.exports = engine