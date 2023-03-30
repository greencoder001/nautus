const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')

module.exports = async (scriptName, code) => {
    try {
        let content = fs.readFileSync(path.join(process.cwd(), 'nautus', 'scripts', `@${scriptName}.js`))
        content = content.toString('utf-8')
        content = content.replace(/\/\* PLEASE DON'T DELETE OR MODIFY THIS COMMENT, IT WILL BE USED TO INJECT SCRIPTS BY KELP \*\//, `\/\* PLEASE DON'T DELETE OR MODIFY THIS COMMENT, IT WILL BE USED TO INJECT SCRIPTS BY KELP \*\/
// Injected by kelp:
${code}
`)
        fs.writeFileSync(path.join(process.cwd(), 'nautus', 'scripts', `@${scriptName}.js`), content)
    } catch (err) {
        console.log(chalk.red('Error while merging script:'))
        throw err
    }
}