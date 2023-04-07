module.exports = [async (args) => {
    const chalk = require('chalk')
    const path = require('path')
    const fs = require('fs-extra')
    const YAML = require('yaml')
    const engine = require('../lib/agentEngine.js')

    if (args[0] === 'create') {
        if (typeof args[1] !== 'string' || args[1].length <= 0) return console.log(chalk.red('Error: Please provide an agentName!'))
        if (fs.existsSync(path.join(process.cwd(), 'nautus', 'agents', `@${args[1]}.js`))) return console.log(chalk.red('Error: Agent already exists!'))
        fs.copySync(path.join(__dirname, '../lib', 'file-templates-agent.js'), path.join(process.cwd(), 'nautus', 'agents', `@${args[1]}.js`))
        const yml = YAML.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', 'agents', 'agents.yaml')).toString('utf8'))
        yml.agents[args[1]] =  {
            watches: {
                tanks: [
                    'main'
                ]
            }
        }
        fs.writeFileSync(path.join(process.cwd(), 'nautus', 'agents', 'agents.yaml'), `# Here you can define your agents
# If you want to read a full documentation about agents, look here: https://github.com/greencoder001/nautus#agents
# Agents help you recompile specific parts of your code when needed
# To create an agent create a file called @AgentName.js in this directory
# You can write it like a nautus script (see: https://github.com/greencoder001/nautus#using-scripts)
# If you want to have some boilerplate, you can use the nautus agent create commad
# Here you can define which agent watches which tank, just take a look at the example
# and add your code when needed\n` + YAML.stringify(yml))
        console.log(chalk.green('Successfully create agent. On default it\'s watching the main tank'))
    } else if (args[0] === 'run') {
        if (typeof args[1] !== 'string' || args[1].length <= 0) return console.log(chalk.red('Error: Please provide an agentName!'))
        if (!fs.existsSync(path.join(process.cwd(), 'nautus', 'agents', `@${args[1]}.js`))) return console.log(chalk.red(`Error: Agent doesn't exist! Create it using nautus agent create ${args[1]}`))
        await engine(args[1])
    } else {
        console.log(chalk.cyan('This command can help you create or run agents.\nUsage: nautus agent <create|run> <agentName>\nFor more info about agents take a look at https://github.com/greencoder001/nautus#agents'))
    }

}, 'agent <create|run> <agentName>', 'Creates or runs an agent. Use nautus agent for more help!']