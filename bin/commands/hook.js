module.exports = [async (args) => {
    const chalk = require('chalk')
    const path = require('path')
    const fs = require('fs-extra')
    const q = require('../lib/prompts')

    if (args[0] === 'init') {
        if (!fs.existsSync(path.join(process.cwd(), '.git'))) return console.log(chalk.red('Error: No .git folder found'))
        fs.ensureDirSync(path.join(process.cwd(), '.git', 'hooks'))
        const hookNames = [
            'pre-commit',
            'pre-push',
            'post-commit'
        ]

        for (const hn of hookNames) {
            const hookPath = path.join(process.cwd(), '.git', 'hooks', hn) 
            if (fs.existsSync(hookPath)) {
                // Merge...
                const asOfNow = fs.readFileSync(hookPath).toString('utf8')
                const modified = asOfNow.includes('#!/bin/sh') ? 
                    asOfNow.replace('#!/bin/sh', '#!/bin/sh\n# Runs nautus hook\nnautus @hook/' + hn) :
                    '#!/bin/sh\n# Runs nautus hook\nnautus @hook/' + hn + '\n' + asOfNow
                fs.writeFileSync(hookPath, modified)
            } else {
                fs.writeFileSync(hookPath, `#!/bin/sh
# Runs nautus hook
nautus @hook/${hn}
`)
            }

            try {
                fs.chmodSync(hookPath, 0o755)
            } catch {
                console.log(chalk.yellow(`[WARN] Couldn't change permissions for ${hn}`))
            }
        }

        console.log(chalk.green('Successfully added hooks!'))
    } else if (args[0] === 'manager') {
        const rules = [
            'Lint code before commit',
            'Lint (fix) code before commit',
            'Format code before commit',
            'Test code before commit',
            'Build code before commit',
            'Build code before push',
            'Test code before push',
            'Generate docs before commit',
            'Fetch & Push git repo after commit (Not recommended in most cases)',
            'Auto add files before commit (Not recommended in most cases)'
        ]
        const rulesThatAreTrue = await q.multiSelect('Select all hooks you want to activate', rules)
        const robj = {}
        
        for (const rule of rules) {
            robj[rule] = rulesThatAreTrue.includes(rule)
        }

        fs.writeFileSync(path.join(process.cwd(), 'nautus', '.internal', 'hook-rules.json'), JSON.stringify(robj))

        console.log(chalk.green('Successfully saved hooks!'))
    } else {
        console.log(chalk.cyan('Take a look at https://github.com/greencoder001/nautus#git-hooks for more help!'))
    }

}, 'hook <init|manager>', 'Creates & manages git hooks']