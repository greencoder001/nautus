module.exports = () => {
    const fs = require('fs')
    const path = require('path')
    return fs.existsSync(path.join(process.cwd(), 'nautus'))
}