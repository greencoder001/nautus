module.exports = [async (args) => {
    const chalk = require('chalk')
    const fs = require('fs')
    const path = require('path')

    console.log('\n' + chalk.bgCyan(chalk.white('                                              Help                                              ')))
    
    function fillUp (txt, c)  {
        if (txt.length >= c) return txt
        txt = txt + ' '.repeat(c - txt.length)
        return txt
    }

    for (registeredCMD of fs.readdirSync(__dirname)) {
        if (registeredCMD.startsWith('@')) continue
        const usage = require(path.join(__dirname, registeredCMD))[1]
        const explanation = require(path.join(__dirname, registeredCMD))[2]
        console.log(fillUp(usage, 30) + chalk.grey(fillUp(explanation, 66)))
    }
    console.log('\n\n' + chalk.bgCyan(chalk.white('                                           What\'s next                                          ')))
    console.log(`Create a nautus project using ${chalk.green('nautus create')}\n\n`)
}, 'help', 'Shows this help menu']