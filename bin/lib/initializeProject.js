module.exports = async () => {
    const chalk = require('chalk')
    const fs = require('fs-extra')
    const os = require('os')
    const detectFrameworks = require('./detectFrameworks')
    let techniques = detectFrameworks()
    const techs = {}
    const path = require('path')
    const dir = path.join(process.cwd(), 'nautus')
    const YAML = require('yaml')
    const { MultiSelect, Input } = require('enquirer')
    const q = require('./prompts')
    const sleep = (ms) => new Promise(r => setTimeout(r, ms))
    const kelpEngine = require('./kelpEngine')

    // General Info
    const projectnameprompt = new Input({
        message: 'Project name?',
        initial: process.cwd().replace(/\\/g, '/').split('/').pop()
    })
    const nameOfProject = await projectnameprompt.run() || process.cwd().replace(/\\/g, '/').split('/').pop()
    let projectIdentifier = null
    let pit = false
    while (projectIdentifier == null || projectIdentifier == '' || projectIdentifier.match(/[^\S\r\n]|:|\/|\\|[*'#²³{\[\]}=?`$!%\(\)&<>\|,;]/g)) {
        const projectidentifierprompt = new Input({
            message: 'Project identifier?',
            initial: nameOfProject.replace(/[^\S\r\n]|:|\/|\\|[*'#²³{\[\]}=?`$!%\(\)&<>\|,;]/g, '')
        })
        if (pit) console.log(chalk.red(`Project identifier cannot contain ${(projectIdentifier.match(/[^\S\r\n]|:|\/|\\|[*'#²³{\[\]}=?`$!%\(\)&<>\|,;]/g) || ['emptyness'])[0]}`))
        projectIdentifier = await projectidentifierprompt.run()
        pit = true
    }

    // Verify techniques
    techniques = [...new Set(techniques)]
    if (techniques.length > 0) {
        const prompt = new MultiSelect({
            name: 'value',
            message: 'We tried to identify some used techniques for you. Please verify if you really used them',
            choices: techniques.map(e => {
                return { name: e, value: e}
            })
        })

        const verifiedTechs = await prompt.run()
        
        for (const tech of verifiedTechs) {
            techs[tech] = {}
        }
    }

    fs.mkdirSync(dir)
    fs.mkdirSync(path.join(dir, '.internal'))
    fs.mkdirSync(path.join(dir, 'refactor'))
    fs.mkdirSync(path.join(dir, 'backups'))
    fs.mkdirSync(path.join(dir, 'agents'))
    fs.writeFileSync(path.join(dir, 'agents', 'agents.yaml'), `# Here you can define your agents
# If you want to read a full documentation about agents, look here: https://github.com/greencoder001/nautus#agents
# Agents help you recompile specific parts of your code when needed
# To create an agent create a file called @AgentName.js in this directory
# You can write it like a nautus script (see: https://github.com/greencoder001/nautus#using-scripts)
# If you want to have some boilerplate, you can use the nautus agent create commad
# Here you can define which agent watches which tank, just take a look at the example
# and add your code when needed\n` + YAML.stringify({
        agents: {
            DefaultAgent: {
                watches: {
                    tanks: [ 'main', 'defineOtherTanksHere' ]
                }
            }
        }
    }))
    fs.copySync(path.join(__dirname, 'file-templates-agent.js'), path.join(dir, 'agents', '@DefaultAgent.js'))
    if (fs.existsSync(path.join(os.homedir(), '.nautusme'))) {
        fs.copyFileSync(path.join(os.homedir(), '.nautusme'), path.join(dir, '.internal', '.nautusme'))
    } else {
        fs.writeFileSync(path.join(dir, '.internal','.nautusme'), JSON.stringify({
            realName: '',
            githubUsername: '',
            name: '',
            gender: '',
            email: ''
        }))
    }
    fs.copySync(path.join(__dirname, 'file-templates'), path.join(dir, 'scripts'))
    fs.writeFileSync(path.join(dir, '.internal', 'tanks.json'), JSON.stringify([
        {
            id: 'main',
            paths: {
               include: ['*'],
               exclude: [] 
            },
            protected: false
        }
    ]))
    fs.writeFileSync(path.join(dir, '.internal', 'project.json'), JSON.stringify({
        identifier: projectIdentifier,
        name: nameOfProject
    }))
    fs.writeFileSync(path.join(dir, 'lint.yaml'), '# Here you can specify linting commands for specific tanks\n# If you haven\'t created any yet, use the main tank\n# Every command will get run for every file\n# To get the file name use ${filename}\n# If your linter does not support filenames, use @COPY [YOUR_COMMAND]\n# This will run the command in a isolated directory only containing this file\n# If you only want to execute a command once, use @ONCE [YOUR_COMMAND]\n' + YAML.stringify({
        tanks: {
            main: {
                command: '@ONCE echo "No linting command specified! Please edit nautus/lint.yaml"',
                fixCommand: '@ONCE echo "No fix command specified! Please edit nautus/lint.yaml"'
            }
        }
    }))

    fs.writeFileSync(path.join(dir, 'format.yaml'), '# Here you can specify formatting commands for specific tanks\n# If you haven\'t created any yet, use the main tank\n# Every command will get run for every file\n# To get the file name use ${filename}\n# If your formatter does not support filenames, use @COPY [YOUR_COMMAND]\n# This will run the command in a isolated directory only containing this file\n# If you only want to execute a command once, use @ONCE [YOUR_COMMAND]\n' + YAML.stringify({
        tanks: {
            main: {
                command: '@ONCE echo "No formatting command specified! Please edit nautus/format.yaml"'
            }
        }
    }))

    if (Object.keys(techs).length > 0) {
        console.log(chalk.cyan('We tried to figure out used techniques for you above, now you get the option to run a kelp-generator for them (generates boilerplate), add support in your scripts or just skip configuring it for nautus:'))
        for (const t of Object.keys(techs)) {
            const a = await q.select(t, [
                'Generate boilerplate',
                'Configure it for nautus',
                'Skip'
            ])
            switch (a) {
                case 'Generate boilerplate':
                    await kelpEngine(t)
                    break
                case 'Configure it for nautus':
                    await kelpEngine(t, 'use')
                    break
                case 'Skip':
                    break
                default:
                    break
            }
        }
    }

}