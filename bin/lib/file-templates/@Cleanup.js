/*
This file is used to define what happens after you used 'nautus run'
You can write this script like every normal node.js app, but are also
able to use special functions defined below:
async cmd(command: string): Promise<[exitCode, stdout]> - Execute a command in the default shell and waits until completion. Returns [exitCode, stdout]
os(): string - Returns 'windows', 'linux, 'mac' or 'unknown'
info(what: any): void - Displays an info in the console
warn(what: any): void - Displays a warning in the console
error(what: any): void - Displays an error in the console & exits with code 1
exit(code: number = 0): void - Exits with a code (default: 0)
async script(name: string): Promise<void> - Runs another script and returns after it has run. Define it by creating a @ScriptName.js file in this folder and run it by using await script('ScriptName')
async spawn(command: string): Promise<exitCode> - Executes a command and displays the output in the shell

modules: A useful collection of some modules, because it's bad practice to use require
Over time we might add more (jsut check using info(modules)), but right now it's:
- modules.fs
- modules.fse
- modules.path
- modules.chalk
- modules.axios
*/

module.exports = async (cmd, os, info, warn, error, exit, script, spawn, modules) => {
    // This script will be run after the @Run.js script
    /*
        If you made some preparations before or your code leaves some unnecessary files,
        you can clean them up here. An example would be:

        await cmd('rm temp.txt')
    */

    /* PLEASE DON'T CHANGE METHOD NAMES, AS IT MIGHT BE REQUIRED BY RUNTIMES */
    /* PLEASE DON'T DELETE OR MODIFY THIS COMMENT, IT WILL BE USED TO INJECT SCRIPTS BY KELP */
}