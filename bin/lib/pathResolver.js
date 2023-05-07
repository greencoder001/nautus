const path = require('path')
const fs = require('fs-extra')

function findFilesRecursive() {
    const result = [];

    function traverse(currentPath) {
        const files = fs.readdirSync(currentPath, { withFileTypes: true });
        for (const file of files) {
            if (file.isFile()) {
                result.push(path.join(currentPath, file.name).replace(process.cwd() + path.sep, ''));
            } else if (file.isDirectory()) {
                traverse(path.join(currentPath, file.name));
            }
        }
    }

    traverse(process.cwd());
    return result;
}

function findFilesAndFoldersRecursive() {
    const result = [];

    function traverse(currentPath) {
        const files = fs.readdirSync(currentPath, { withFileTypes: true });
        for (const file of files) {
            const fullPath = path.join(currentPath, file.name).replace(process.cwd() + path.sep, '');
            if (file.isFile()) {
                result.push(fullPath);
            } else if (file.isDirectory()) {
                result.push(fullPath + '/');
                traverse(path.join(currentPath, file.name));
            }
        }
    }

    traverse(process.cwd());
    return result;
}

const { minimatch } = require('minimatch')
const mini = minimatch

function engine ($path, include, exclude) {
    $path = $path.replace(/\\/g, '/')
    if ($path.startsWith('nautus/')) return false
    let oi = false
    for (const i of include) {
        if (mini($path, i)) oi = true
    }
    for (const x of exclude) {
        if (mini($path, x)) return false
    }
    return oi
}

exports.resolveMinimum = (include, exclude) => {
    const files = fs.readdirSync(process.cwd(), { withFileTypes: true });
    const names = files.map((file) => file.name)
    return names.filter(name => engine(name, include, exclude))
}

exports.resolveFiles = (include, exclude) => {
    return findFilesRecursive().filter(name => engine(name, include, exclude))
}

exports.resolveFilesPlusFolders = (include, exclude) => {
    return findFilesAndFoldersRecursive().filter(name => engine(name, include, exclude))
}