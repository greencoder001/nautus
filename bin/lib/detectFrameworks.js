module.exports = () => {
    const fs = require('fs-extra')
    const path = require('path')
    const frameworks = []

    function findFilesWithExtension(dirPath, extension, fileList = []) {
        const files = fs.readdirSync(dirPath)

        for (const file of files) {
            const filePath = path.join(dirPath, file)
            const fileStat = fs.statSync(filePath)

            if (fileStat.isDirectory()) {
                findFilesWithExtension(filePath, extension, fileList)
            } else {
                if (file.endsWith('.' + extension)) {
                    fileList.push(filePath)
                }
            }
        }

        return fileList
    }

    // Node & npm
    if (fs.existsSync(path.join(process.cwd(), 'package.json'))) {
        frameworks.push('node')
        frameworks.push('npm')
    }

    // HTML
    if (findFilesWithExtension(process.cwd(), 'html').length > 0 || findFilesWithExtension(process.cwd(), 'htm').length > 0) frameworks.push('html')

    // Javascript
    if (findFilesWithExtension(process.cwd(), 'js').length > 0 || findFilesWithExtension(process.cwd(), 'mjs').length > 0) frameworks.push('js')

    // Typescript
    if (findFilesWithExtension(process.cwd(), 'ts').length > 0) frameworks.push('ts')

    // CSS
    if (findFilesWithExtension(process.cwd(), 'css').length > 0) frameworks.push('css')

    // Sass & Scss
    if (findFilesWithExtension(process.cwd(), 'sass').length > 0 || findFilesWithExtension(process.cwd(), 'scss').length > 0) frameworks.push('sass')

    // Svelte
    if (findFilesWithExtension(process.cwd(), 'svelte').length > 0 ) frameworks.push('svelte')

    // Vue
    if (findFilesWithExtension(process.cwd(), 'vue').length > 0) frameworks.push('vue')

    // Python
    if (findFilesWithExtension(process.cwd(), 'py').length > 0) frameworks.push('python')
    if (findFilesWithExtension(process.cwd(), 'pyw').length > 0) frameworks.push('python')

    // Arduino
    if (findFilesWithExtension(process.cwd(), 'ino').length > 0) frameworks.push('arduino')

    // C++
    if (findFilesWithExtension(process.cwd(), 'cpp').length > 0) frameworks.push('cpp')

    // C
    if (findFilesWithExtension(process.cwd(), 'c').length > 0) frameworks.push('c')

    // C#
    if (findFilesWithExtension(process.cwd(), 'cs').length > 0) frameworks.push('cs')


    return frameworks
}