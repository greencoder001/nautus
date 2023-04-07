/*
This file is used to define what happens when the agent runs. It uses the nautus script syntax (see: https://github.com/greencoder001/nautus#using-scripts)
To learn more about agents take a look at https://github.com/greencoder001/nautus#agents
Before this will work you might need to define it in agents.yaml

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

    // This is an agent, define commands to be run if the in
    // agents.yaml specified tank content changes here!

}