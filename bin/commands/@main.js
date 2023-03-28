module.exports = [async (args) => {
    const chalk = require('chalk')
    const ipi = require('../lib/isProjectInitialized')

    console.log(
        chalk.cyan("                                                             ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n") +
        chalk.cyan("                                                             ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢷⣤⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n") +
        chalk.cyan("                                                             ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠀⢰⡗⠀⠀⢠⡀⣠⡄⠀⠈⣿⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀\n") +
        chalk.cyan("    ███▄    █  ▄▄▄      █    ██ ▄▄▄█████▓ █    ██   ██████   ") + chalk.redBright("⠀⠀⠀⠸⢶⣤⣄⢿⡇⠀⠀⠈⣿⠏⠀⠀⠀⣿⡀⠀⣴⠟⠁⠀⠀⠀⠀⠀⠀⠀\n") +
        chalk.cyan("    ██ ▀█   █ ▒████▄    ██  ▓██▒▓  ██▒ ▓▒ ██  ▓██▒▒██    ▒   ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠙⠻⣿⣦⡀⢸⡏⠀⠀⠀⠀⢹⣇⣼⣏⣀⣀⣠⣤⡦⠀⠀⠀⠀\n") +
        chalk.cyan("   ▓██  ▀█ ██▒▒██  ▀█▄ ▓██  ▒██░▒ ▓██░ ▒░▓██  ▒██░░ ▓██▄     ") + chalk.redBright("⠀⠀⠀⢰⣶⡄⠀⠀⠘⢿⣿⣾⣧⠀⠀⠀⠀⣼⣿⠟⠉⠉⠉⢉⡀⠀⠀⠀⠀⠀\n") +
        chalk.cyan("   ▓██▒  ▐▌██▒░██▄▄▄▄██▓▓█  ░██░░ ▓██▓ ░ ▓▓█  ░██░  ▒   ██▒  ") + chalk.redBright("⠀⠘⠷⠶⢿⣿⡄⠀⠀⠀⠙⠿⣿⣦⣄⡀⣼⣿⠃⠀⠰⣦⣀⣸⡇⠀⠀⠀⠀⠀\n") +
        chalk.cyan("   ▒██░   ▓██░▒▓█   ▓██▒▒█████▓   ▒██▒ ░ ▒▒█████▓ ▒██████▒▒  ") + chalk.redBright("⠀⠀⠀⠀⠈⣿⣷⠀⠀⠀⢀⠀⠈⠛⠿⣿⣿⡏⠀⠀⠀⠈⣹⡟⠀⠀⣀⣤⣄⠀\n") +
        chalk.cyan("   ░ ▒░   ▒ ▒ ░▒▒   ▓▒█░▒▓▒ ▒ ▒   ▒ ░░   ░▒▓▒ ▒ ▒ ▒ ▒▓▒ ▒ ░  ") + chalk.redBright("⠀⠀⢠⡶⠟⠻⣿⣧⡀⣰⠏⠀⠀⠀⠀⢸⣿⡇⠀⣀⣠⣾⣯⣶⣶⣾⡏⠁⠀⠀\n") +
        chalk.cyan("   ░ ░░   ░ ▒░░ ░   ▒▒ ░░▒░ ░ ░     ░    ░░▒░ ░ ░ ░ ░▒  ░ ░  ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣀⠀⠀⠀⠀⠸⣿⣷⣿⣿⣿⣯⣉⡉⠉⠙⢷⡄⠀⠀\n") +
        chalk.cyan("   ░   ░ ░   ░   ▒   ░░░ ░ ░   ░       ░░░ ░ ░ ░  ░  ░       ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣷⣦⣄⣠⣾⣿⠋⠀⠀⠀⠈⣩⡿⠷⣤⠀⠀⠀⠀\n") +
        chalk.cyan("           ░       ░     ░                 ░           ░     ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠶⠶⣶⡶⠟⠛⠛⢿⣿⡿⠁⠀⠀⠀⠀⣰⡟⠁⠀⠀⠀⠀⠀⠀\n") +
        chalk.cyan("     Your one & only ultimate software development tool      ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n") +
        chalk.cyan("                                                             ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠀⠀⠹⠇⠀⠀⠀⣼⣿⠃⠀⠀⠀⠀⠀⠉⠁⠀⠀⠀⠀⠀⠀⠀\n") +
        chalk.cyan("                                                             ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n")
    )
    console.log('')
    if (ipi()) {
        console.log(chalk.gray(`Use ${chalk.italic('nautus help')} to get a list of commands`))
        console.log('\n' + chalk.bgCyan(chalk.white('                                          What\'s next                                          ')))
        // TODO: What's next
    } else {
        require('./help')[0](args)
    }
}, '', 'Main Menu']
