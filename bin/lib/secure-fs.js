const fse = require('fs-extra')
const { select } = require('./prompts')
const promisify = require('promisify-function').default
const deasync = require('deasync')

// NOTE: This requires a compiler which replaces fs.writeFileSync(...) with (await fs.writeFileSync(...))

const fs = {
    ...fse
}

fs.writeFile = (...args) => {
    if (fse.existsSync(args[0])) {
        select(`The generator wants to overwrite the file ${args[0].replace(process.cwd(), '')}`, [
            'Overwrite',
            'Skip',
            `Write into ${args[0].replace(process.cwd(), '')}.new`
        ]).then(answer => {
            if (answer === 'Overwrite') return fse.writeFile(...args)
            if (answer === 'Skip') return
            if (answer === `Write into ${args[0].replace(process.cwd(), '')}.new`) {
                const argv = args.slice(1)
                fse.writeFile(args[0] + '.new', ...argv)
            }
        })
    } else {
        fse.writeFile(...args)
    }
}
fs.writeFileSync = promisify(fs.writeFile)
fs.writeJSON = (...args) => {
    if (fse.existsSync(args[0])) {
        select(`The generator wants to overwrite the file ${args[0].replace(process.cwd(), '')}`, [
            'Overwrite',
            'Skip',
            `Write into ${args[0].replace(process.cwd(), '')}.new`
        ]).then(answer => {
            if (answer === 'Overwrite') return fse.writeJSON(...args)
            if (answer === 'Skip') return
            if (answer === `Write into ${args[0].replace(process.cwd(), '')}.new`) {
                const argv = args.slice(1)
                fse.writeJSON(args[0] + '.new', ...argv)
            }
        })
    } else {
        fse.writeJSON(...args)
    }
}
fs.writeJSONSync = promisify(fs.writeJSON)
fs.writeJson = (...args) => {
    if (fse.existsSync(args[0])) {
        select(`The generator wants to overwrite the file ${args[0].replace(process.cwd(), '')}`, [
            'Overwrite',
            'Skip',
            `Write into ${args[0].replace(process.cwd(), '')}.new`
        ]).then(answer => {
            if (answer === 'Overwrite') return fse.writeJson(...args)
            if (answer === 'Skip') return
            if (answer === `Write into ${args[0].replace(process.cwd(), '')}.new`) {
                const argv = args.slice(1)
                fse.writeJson(args[0] + '.new', ...argv)
            }
        })
    } else {
        fse.writeJson(...args)
    }
}
fs.writeJsonSync = promisify(fs.writeJson)
fs.promises.writeFile = promisify(fs.writeFile)
fs.promises.writeJSON = promisify(fs.writeJSON)
fs.promises.writeJson = promisify(fs.writeJson)

module.exports = fs