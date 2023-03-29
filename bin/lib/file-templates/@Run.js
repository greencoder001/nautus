/*
This file is used to define what happens when you use 'nautus run'
You can write this script like every normal node.js app, but are also
able to use special functions defined below:
async cmd(command: string): Promise<[exitCode, stdout]> - Execute a command in the default shell and waits until completion. Returns [exitCode, stdout]
os(): string - Returns 'windows', 'linux, 'mac' or 'unknown'
info(what: any): void - Displays an info in the console
warn(what: any): void - Displays a warning in the console
error(what: any): void - Displays an error in the console & exits with code 1
exit(code: number = 0): void - Exits with a code (default: 0)
async script(name: string): Promise<void> - Runs another script and returns after it has run. Define it by creating a @ScriptName.js file in this folder and run it by using await script('ScriptName')
*/

module.exports = async (cmd, os, info, warn, error, exit, script) => {
    /* Example Script for a node.js app 
    const [exitCode] = await cmd('node index.js')
    exit(exitCode)

    Yes, it's that simple.
    */

    /*
        If you need to compile some piece of your code before
        running, use the @Prep.js script. It will get run every
        time before executing this script.
    */

    return error('No run script defined, please edit ./nautus/scripts/@Run.js')
}