const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')

module.exports = async (scriptName) => {
    try {
        let content = fs.readFileSync(path.join(process.cwd(), 'nautus', 'scripts', `@${scriptName}.js`))
        content = content.toString('utf-8')
        content = content.replace(/return error\('No (.*?) script defined, please edit \.\/nautus\/scripts\/@(\w*?)\.js'\)/, '')
        fs.writeFileSync(path.join(process.cwd(), 'nautus', 'scripts', `@${scriptName}.js`), content)
    } catch (err) {
        console.log(chalk.red('Error while removing default in script:'))
        throw err
    }
}