const path = require('path')
const fs = require('fs-extra')
const axios = require('axios')
const chalk = require('chalk')
const os = require('os')
const { exec } = require('child_process')

const cmd = (cwd, command) => {
    return new Promise((resolve, reject) => {
        if (typeof command !== 'string') throw new TypeError('command must be a string')
        exec('cd ' + cwd + ' && ' + command, (error, stdout, stderr) => {
            if (error) {
                return reject([error.code, (stdout || '') + (stderr || '')])
            }
            resolve([0, (stdout || '') + (stderr || '')])
        })
    })
}

const rcmd = (command) => {
    return new Promise((resolve, reject) => {
        if (typeof command !== 'string') throw new TypeError('command must be a string')
        exec('cd ' + process.cwd() + ' && ' + command, (error, stdout, stderr) => {
            if (error) {
                return reject([error.code, (stdout || '') + (stderr || '')])
            }
            resolve([0, (stdout || '') + (stderr || '')])
        })
    })
}

const kelpDir = path.join(os.homedir(), '.nautus-kelp')

module.exports = async (name, type = 'generator', isLocal = false) => {
    const moduleName = `nautus-${name}`
    const spinner = (await import('nanospinner')).createSpinner
    let genp
    let dela = null

    if (!require('../lib/isProjectInitialized')()) return console.log(require('chalk').red('This command require a nautus project. Initialize it using ' + require('chalk').cyan('nautus create') + '!'))

    if (isLocal) {
        const uuid = require('uuid')
        const f = path.join(kelpDir, uuid.v4())
        // Check if exists
        if (!fs.existsSync(name)) console.log(chalk.red(`Error: Can't find kelp generator "${name}". Make sure that the path is existent!`))
        
        fs.ensureDirSync(f)
        fs.ensureDirSync(path.join('f', 'node_modules'))
        fs.copySync(name, path.join(f, 'node_modules', 'nautus-local'))
        fs.writeFileSync(path.join(f, '_helper.js'), `
        const fs = require('fs');
        const path = require('path');

        const nautusModulesDir = path.join(__dirname, 'node_modules');
        const nautusDirs = fs.readdirSync(nautusModulesDir)
        .filter(dirName => dirName.startsWith('nautus-'))
        .map(dirName => path.join(nautusModulesDir, dirName));

        const jsFileFilter = /\\.m?js$/;

        function replaceFileSync(filePath) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        let newContent = fileContent.replace(/fs\\.writeFileSync\\(/g, 'await fs.writeFileSync(');
        newContent = newContent.replace(/fs\\.writeJSONSync\\(/g, 'await fs.writeJSONSync(')
        newContent = newContent.replace(/fs\\.writeJsonSync\\(/g, 'await fs.writeJsonSync(')
        fs.writeFileSync(filePath, newContent);
        }

        function processDir(dirPath) {
        fs.readdirSync(dirPath).forEach(file => {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
            processDir(filePath);
            } else if (jsFileFilter.test(filePath)) {
            replaceFileSync(filePath);
            }
        });
        }

        nautusDirs.forEach(processDir);
        const entry = require('./node_modules/nautus-local/package.json').main
        module.exports = require('./node_modules/nautus-local/' + entry);`)
        genp = path.join(f, '_helper.js')
        dela = f
    } else {
        // Check if module exists
        try {
            const res = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(moduleName)}`)
            if (res.data && res.data.error) {
                console.log(chalk.red(`Error: Can't find kelp generator "${name}". Make sure that the npm package "${moduleName}" exists!`))
                return
            }
        } catch {
            console.log(chalk.red(`Error: Can't find kelp generator "${name}". Make sure that the npm package "${moduleName}" exists!`))
            return
        }
        
        const s = spinner('Installing generator').start({ color: 'cyan' })

        // Install module
        const folder = path.join(kelpDir, name)
        fs.removeSync(folder)
        fs.ensureDirSync(folder)
        const l1 = await cmd(folder, 'npm init -y')
        if (l1[0] !== 0) {
            console.log(chalk.red('Error while initializing: '))
            console.log(l1[1])
            return
        }
        const l2 = await cmd(folder, `npm i ${moduleName}`)
        if (l2[0] !== 0) {
            console.log(chalk.red('Error while installing: '))
            console.log(l2[1])
            return
        }

        // Create helper
        fs.writeFileSync(path.join(folder, 'index.js'), `
        const fs = require('fs');
        const path = require('path');

        const nautusModulesDir = path.join(__dirname, 'node_modules');
        const nautusDirs = fs.readdirSync(nautusModulesDir)
        .filter(dirName => dirName.startsWith('nautus-'))
        .map(dirName => path.join(nautusModulesDir, dirName));

        const jsFileFilter = /\\.m?js$/;

        function replaceFileSync(filePath) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        let newContent = fileContent.replace(/fs\\.writeFileSync\\(/g, 'await fs.writeFileSync(');
        newContent = newContent.replace(/fs\\.writeJSONSync\\(/g, 'await fs.writeJSONSync(')
        newContent = newContent.replace(/fs\\.writeJsonSync\\(/g, 'await fs.writeJsonSync(')
        fs.writeFileSync(filePath, newContent);
        }

        function processDir(dirPath) {
        fs.readdirSync(dirPath).forEach(file => {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
            processDir(filePath);
            } else if (jsFileFilter.test(filePath)) {
            replaceFileSync(filePath);
            }
        });
        }

        nautusDirs.forEach(processDir);
        module.exports = require('${moduleName}');`)
        
        // Stop spinner
        s.success({ text: 'Successfully installed generator' })

        genp = path.join(folder, 'index.js')
    }

    // Run generator
    const generator = require(genp)
    // Change .gitignore
    fs.appendFileSync(path.join(process.cwd(), '.gitignore'), `\n\n# Injected by nautus from kelp generator ${name}\n${generator.gitIgnore || ''}`)

    await generator[type](require('./prompts'),
        require('./regexes'),
        JSON.parse(fs.readFileSync(path.join(process.cwd(), 'nautus', '.internal', '.nautusme'))),
        process.cwd(),
        rcmd,
        require('./mergeScript'),
        require('./removeDefault'), chalk,
        require('./secure-fs'))

    // TODO: Use generator.commands to create new commands
    if (dela) fs.removeSync(dela)
}