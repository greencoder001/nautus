module.exports = [async (args) => {
    const chalk = require('chalk')
    const rl = require('readline-sync')
    const axios = require('axios')
    const FormData = require('form-data')
    const q = require('../lib/prompts')
    const fs = require('fs-extra')
    const path = require('path')

    console.log(chalk.cyan(`Welcome to the nautus api client! Use ${chalk.italic('HELP')} for help`))
    let exit = false
    let lastBaseURL = 'http://localhost/'

    const formDatas = []

    const instance = (URL) => {
        const tough = require('tough-cookie')
        const cookieJar = new tough.CookieJar()
        const { wrapper } = require('axios-cookiejar-support')
        return wrapper(axios.create({
            withCredentials: true,
            jar: cookieJar,
            timeout: 0,
            baseURL: URL || lastBaseURL,
            headers: {},
            validateStatus: () => true
        }))
    }

    let api = instance()
    while (!exit) {
        const cmd = rl.question('>> ').split(' ')
        const mainCmd = cmd[0].toUpperCase()

        if (mainCmd === 'HELP') {
            console.log(chalk.cyan('Here\'s a list of available commands:'))
            let cmds = [
                ['HELP', 'Shows this help menu'],
                ['EXIT|QUIT', 'Exits this client'],
                ['CLEAR', 'Clears the console'],
            ].sort((a, b) => a[0].localeCompare(b[0]))

            cmds = [...cmds,
                ['GET <PATH> <?HEADERS>', 'Executes a get request. HEADERS should be a JSON Object'],
                ['HEAD <PATH> <?HEADERS>', 'Executes a head request. HEADERS should be a JSON Object'],
                ['OPTIONS <PATH> <?HEADERS>', 'Executes a head request. HEADERS should be a JSON Object'],
                ['POST <PATH> <?HEADERS> <?DATA> <?DATATYPE>', 'Executes a post request. HEADERS should be a JSON Object. DATATYPE should be a valid mimetype. DATA should either be plain text, a json string, a formdata id or urlencoded string'],
                ['PUT <PATH> <?HEADERS> <?DATA> <?DATATYPE>', 'Executes a put request. HEADERS should be a JSON Object DATATYPE should be a valid mimetype. DATA should either be plain text, a json string, a formdata id or urlencoded string'],
                ['PATCH <PATH> <?HEADERS> <?DATA> <?DATATYPE>', 'Executes a put request. HEADERS should be a JSON Object DATATYPE should be a valid mimetype. DATA should either be plain text, a json string, a formdata id or urlencoded string'],
                ['DELETE <PATH> <?HEADERS>', 'Executes a get request. HEADERS should be a JSON Object'],
                ['CLEARCOOKIES', 'Reinitializes the instance, thus deleting cookies'],
                ['BASE <URL>', 'Sets the base url'],
                ['FORMDATA', 'Creates a form data object (useful for POST requests)']
            ]

            for (const c of cmds) {
                console.log(`${chalk.cyan(c[0])} - ${chalk.gray(c[1])}`)
            }
        } else if (mainCmd === 'EXIT' || mainCmd === 'QUIT') {
            console.log(chalk.cyan('Goodbye!'))
            process.exit(0)
        } else if (mainCmd === 'CLEAR') {
            console.clear()
        } else if (mainCmd === 'GET') {
            let headers = {}
            try {
                headers = JSON.parse(cmd[2])
            } catch {}
            
            const res = await api.get(cmd[1], {
                headers
            })

            let statusColor = 'green'
            if (res.status > 400) statusColor = 'red'
            if (res.status >= 300 && res.status < 400) statusColor = 'yellow'

            console.log(`${chalk[statusColor](res.status)}`)
            console.log(res.data)
        } else if (mainCmd === 'HEAD') {
            let headers = {}
            try {
                headers = JSON.parse(cmd[2])
            } catch { }

            const res = await api.head(cmd[1], {
                headers
            })

            let statusColor = 'green'
            if (res.status > 400) statusColor = 'red'
            if (res.status >= 300 && res.status < 400) statusColor = 'yellow'

            console.log(`${chalk[statusColor](res.status)}`)
            console.log(res.data)
        } else if (mainCmd === 'DELETE') {
            let headers = {}
            try {
                headers = JSON.parse(cmd[2])
            } catch { }

            const res = await api.delete(cmd[1], {
                headers
            })

            let statusColor = 'green'
            if (res.status > 400) statusColor = 'red'
            if (res.status >= 300 && res.status < 400) statusColor = 'yellow'

            console.log(`${chalk[statusColor](res.status)}`)
            console.log(res.data)
        } else if (mainCmd === 'OPTIONS') {
            let headers = {}
            try {
                headers = JSON.parse(cmd[2])
            } catch { }

            const res = await api.options(cmd[1], {
                headers
            })

            let statusColor = 'green'
            if (res.status > 400) statusColor = 'red'
            if (res.status >= 300 && res.status < 400) statusColor = 'yellow'

            console.log(`${chalk[statusColor](res.status)}`)
            console.log(res.data)
        } else if (mainCmd === 'POST') {
            let headers = {}
            try {
                headers = JSON.parse(cmd[2])
            } catch { }

            let data = cmd[3] || {}
            let dataType = cmd[4] || 'text/plain'

            // Different data types
            if (data.toString().startsWith('$')) {
                // FormData
                if (!formDatas[parseInt(data.substring(1))]) {
                    console.log(chalk.red('Error: FormData with this id is not available'))
                    continue
                }
                data = formDatas[parseInt(data.toString().substring(1))]
                dataType = 'multipart/form-data'
                headers = {
                    ...headers,
                    ...(data.getHeaders())
                }
            }

            // Set data type
            headers['Content-Type'] = dataType

            const res = await api.post(cmd[1], data, {
                withCredentials: true,
                headers,
                data
            })

            let statusColor = 'green'
            if (res.status > 400) statusColor = 'red'
            if (res.status >= 300 && res.status < 400) statusColor = 'yellow'

            console.log(`${chalk[statusColor](res.status)}`)
            console.log(res.data)
        } else if (mainCmd === 'PUT') {
            let headers = {}
            try {
                headers = JSON.parse(cmd[2])
            } catch { }

            let data = cmd[3] || {}
            let dataType = cmd[4] || 'text/plain'

            // Different data types
            if (data.toString().startsWith('$')) {
                // FormData
                if (!formDatas[parseInt(data.substring(1))]) {
                    console.log(chalk.red('Error: FormData with this id is not available'))
                    continue
                }
                data = formDatas[parseInt(data.toString().substring(1))]
                dataType = 'multipart/form-data'
                headers = {
                    ...headers,
                    ...(data.getHeaders())
                }
            }

            // Set data type
            headers['Content-Type'] = dataType

            const res = await api.put(cmd[1], data, {
                withCredentials: true,
                headers,
                data
            })

            let statusColor = 'green'
            if (res.status > 400) statusColor = 'red'
            if (res.status >= 300 && res.status < 400) statusColor = 'yellow'

            console.log(`${chalk[statusColor](res.status)}`)
            console.log(res.data)
        } else if (mainCmd === 'PATCH') {
            let headers = {}
            try {
                headers = JSON.parse(cmd[2])
            } catch { }

            let data = cmd[3] || {}
            let dataType = cmd[4] || 'text/plain'

            // Different data types
            if (data.toString().startsWith('$')) {
                // FormData
                if (!formDatas[parseInt(data.substring(1))]) {
                    console.log(chalk.red('Error: FormData with this id is not available'))
                    continue
                }
                data = formDatas[parseInt(data.toString().substring(1))]
                dataType = 'multipart/form-data'
                headers = {
                    ...headers,
                    ...(data.getHeaders())
                }
            }

            // Set data type
            headers['Content-Type'] = dataType

            const res = await api.patch(cmd[1], data, {
                withCredentials: true,
                headers,
                data
            })

            let statusColor = 'green'
            if (res.status > 400) statusColor = 'red'
            if (res.status >= 300 && res.status < 400) statusColor = 'yellow'

            console.log(`${chalk[statusColor](res.status)}`)
            console.log(res.data)
        } else if (mainCmd === 'FORMDATA') {
            const id = formDatas.length
            console.log(chalk.cyan('You can reference this form data using $' + id + ' as DATA option in requests'))
            formDatas[id] = new FormData()
            let exitF = false
            while (!exitF) {
                const doContinue = await q.toggle('Do you want to add a field?', 'Yes', 'No')
                if (doContinue === 'No') break
                const what = await q.select('What do you want to add?', [
                    'File',
                    'Field'
                ])
                const key = await q.prompt('Key:')
                if (what === 'File') {
                    const fileName = await q.prompt('Enter a path', '', null, false, (v) => {
                        return fs.existsSync(v)
                    })
                    formDatas[id].append(key, fs.createReadStream(fileName))
                } else {
                    let value = await q.prompt('Value:')
                    try {
                        value = JSON.parse(value)
                    } catch {}
                    formDatas[id].append(key, value)
                }
            }
            console.log(chalk.green('FormData was saved!'))
        } else if (mainCmd === 'CLEARCOOKIES') {
            api = instance(lastBaseURL)
            console.log(chalk.green('Done!'))
        } else if (mainCmd === 'BASE') {
            cmd[1] = cmd[1].startsWith('http') ? cmd[1] : `//${cmd[1]}`
            api = instance(cmd[1])
            lastBaseURL = cmd[1]
            console.log(chalk.green('Set base url to ' + lastBaseURL))
        } else {
            console.log(chalk.red(`Error: Command ${mainCmd} not found. Use ${chalk.italic('HELP')} for help`))
        }
    }
}, 'api', 'A basic API client which saves cookies']