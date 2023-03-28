module.export = () => {
    const fs = require('fs-extra')
    const path = require('path')
    const frameworks = []

    if (fs.existsSync(path.join(process.cwd('package.json')))) {
        frameworks.push('node')
        frameworks.push('npm')
    }

    return frameworks
}