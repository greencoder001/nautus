const path = require('path')
const fs = require('fs-extra')

function findFilesRecursive() {
    const result = [];

    function traverse(currentPath) {
        const files = fs.readdirSync(currentPath, { withFileTypes: true });
        for (const file of files) {
            const fullPath = path.join(currentPath, file.name).replace(process.cwd() + path.sep, '');
            if (file.isFile()) {
                result.push(fullPath);
            } else if (file.isDirectory()) {
                traverse(path.join(currentPath, file.name));
            }
        }
    }

    traverse(process.cwd());
    return result;
}

module.exports = [async (args) => {
    const chalk = require('chalk')
    const ignore = (await import('ignore')).default
    const AdmZip = require('adm-zip')

    const folderName = `Backup ${(new Date()).toUTCString().replace(/:/g, '-') + ' ' + ((new Date()).getMilliseconds())}`
    const pth = path.join(process.cwd(), 'nautus', 'backups', folderName + '.zip')
    fs.ensureFileSync(path.join(process.cwd(), '.gitignore'))
    const ig = ignore().add(fs.readFileSync(path.join(process.cwd(), '.gitignore')).toString()).add('nautus')
    

    const zip = new AdmZip()

    for (let $path of findFilesRecursive()) {
        if (!ig.ignores($path)) {
            $path = $path.replace(/\\/g, '/')
            const arr = $path.split('/')
            arr.pop()
            if (arr.length < 1) {
                zip.addLocalFile($path.replace(/\\/g, '/'))
            } else {
                zip.addLocalFile($path.replace(/\\/g, '/'), arr.join('/'))
            }
        }
    }

    await zip.writeZipPromise(pth)

    console.log(chalk.green('Backup created successfully. Take a look at it in ./nautus/backups'))
}, 'backup', 'Creates a full code backup (except for files in .gitignore)']