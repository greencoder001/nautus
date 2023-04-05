const path = require('path')
const fs = require('fs-extra')

module.exports = [async (args) => {
    const chalk = require('chalk')
    const q = require('../lib/prompts')
    const jsdoc2md = require('jsdoc-to-markdown')

    const files = []
    let lastAnswer = false
    let i = 1
    console.log(chalk.cyan('Please add all filepaths you want to document. You can use path literals. To select every js file use "**/*.js". Leave blank to stop adding paths'))
    while (!lastAnswer) {
        const answer = await q.prompt('Path (' + i + '):', '', null, true)

        if (answer.trim() === '') {
            lastAnswer = true
        } else {
            files.push(answer)
        }

        i += 1
    }

    const out = await q.prompt('Output filename (should end with .md)')

    const md = jsdoc2md.renderSync({
        files: files
    })

    fs.writeFileSync(path.join(process.cwd(), out), md)

}, 'docs', 'Generates markdown documentation using the jsdoc comments in your program']