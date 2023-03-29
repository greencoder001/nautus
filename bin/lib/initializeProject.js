module.exports = async () => {
    const { question } = require('readline-sync')
    const chalk = require('chalk')
    const fs = require('fs-extra')
    const os = require('os')
    const detectFrameworks = require('./detectFrameworks')
    const techniques = detectFrameworks()
    const techs = {}
    const path = require('path')
    const dir = path.join(process.cwd(), 'nautus')
    const YAML = require('yaml')

    // General Info
    const nameOfProject = question(`Project name: (${process.cwd().replace(/\\/g, '/').split('/').pop()}) `) || process.cwd().replace(/\\/g, '/').split('/').pop()
    let projectIdentifier
    let pit = false
    while (projectIdentifier == null || projectIdentifier == '' || projectIdentifier.match(/[^\S\r\n]|:|\/|\\|[*'#²³{\[\]}=?`$!%\(\)&<>\|,;]/g)) {
        if (pit) console.log(chalk.red(`Project identifier cannot contain ${(projectIdentifier.match(/[^\S\r\n]|:|\/|\\|[*'#²³{\[\]}=?`$!%\(\)&<>\|,;]/g) || ['emptyness'])[0]}`))
        projectIdentifier = question('Project identifier: ')
        pit = true
    }

    // Verify techniques
    if (techniques.length > 0) {
        console.log('We tried to identify some used techniques for you. Please verify if you really used them.')
        for (const tech of techniques) {
            if (question(`${tech} (Y/n): `) !== 'n') {
                techs[tech] = {}
            }
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