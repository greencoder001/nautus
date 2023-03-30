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
    const sleep = (ms) => new Promise(r => setTimeout(r, ms))

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
    fs.writeFileSync(path.join(dir, '.internal', 'tanks.json'), JSON.stringify([{id: 'main'}]))
    fs.writeFileSync(path.join(dir, '.internal', 'project.json'), JSON.stringify({
        identifier: projectIdentifier,
        name: nameOfProject
    }))
    fs.writeFileSync(path.join(dir, '.internal', 'techniques.json'), JSON.stringify({
        techniques: techs
    }))
    fs.writeFileSync(path.join(dir, 'lint.yaml'), '# Here you can specify linting commands for specific tanks\n# If you haven\'t created any yet, use the main tank\n' + YAML.stringify({
        tanks: {
            main: {
                lintingCommand: 'echo "No linting command specified! Please edit nautus/lint.yaml"',
                fixCommand: 'echo "No fix command specified! Please edit nautus/lint.yaml"'
            }
        }
    }))

}