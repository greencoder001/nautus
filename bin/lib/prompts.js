const chalk = require('chalk')
const { Input, Toggle, Confirm, NumberPrompt, Select, MultiSelect } = require('enquirer')

module.exports = {
    /*
        async prompt(question, defaultValue = '', validationRegEx = null, canBeEmpty = false, validatorFunction = null) => string // NOTE: The validatorFunction can be async
        async confirm(question) => true|false
        async numeral(question, validatorFunction) => number
        async toggle(question, option1, option2) => option1|option2
        async select(question, [...choices]) => choice
        async multiSelect(question, [...choices], min = 0, max = Infinity) => [...choices]
    */
    async prompt (question, defaultValue = '', validationRegEx = null, canBeEmpty = false, validatorFunction = () => true) {
        question = `${question}`
        defaultValue = `${defaultValue}`
        let validAnswer = false
        let firstTry = true
        while (!validAnswer) {
            if (!firstTry) console.log(chalk.yellow('Invalid answer!'))
            firstTry = false
            const prompt = new Input({
                message: question.trim(),
                initial: defaultValue
            })
            const answer = await prompt.run().catch(() => {
                console.log(chalk.red('Cancelled'))
                process.exit(1)
            })
            if (answer.trim() === '' && !canBeEmpty) continue
            if (validationRegEx instanceof RegExp && answer.replace(validationRegEx, '').trim() !== '') continue 
            if (!(awaitvalidatorFunction(answer))) continue
            return answer
        }
    },
    async confirm(question) {
        const prompt = new Confirm({
            name: 'question',
            message: question
        })
        return await prompt.run().catch(() => {
            console.log(chalk.red('Cancelled'))
            process.exit(1)
        })
    },
    async numeral(question, validatorFunction = () => true) {
        question = `${question}`
        let validAnswer = false
        let firstTry = true
        while (!validAnswer) {
            if (!firstTry) console.log(chalk.yellow('Invalid answer!'))
            firstTry = false
            const prompt = new NumberPrompt({
                name: 'number',
                message: question.trim()
            })
            const answer = await prompt.run().catch(() => {
                console.log(chalk.red('Cancelled'))
                process.exit(1)
            })
            if (!(await validatorFunction(answer))) continue
            return answer
        }
    },
    async toggle(question, option1, option2) {
        const prompt = new Toggle({
            message: question,
            enabled: option2,
            disabled: option1
        })
        const answer = await prompt.run().catch(() => {
            console.log(chalk.red('Cancelled'))
            process.exit(1)
        })
        return answer ? option2 : option1
    },
    async select (question, choices) {
        const prompt = new Select({
            name: 'select',
            message: question,
            choices: choices
        })
        return await prompt.run().catch(() => {
            console.log(chalk.red('Cancelled'))
            process.exit(1)
        })
    },
    async multiSelect(question, choices, min = 0, max = Infinity) {
        let validAnswer = false
        let firstTry = true
        while (!validAnswer) {
            if (!firstTry) console.log(chalk.yellow('Please select at least ' + min + '!'))
            firstTry = false
            const obj = {
                name: 'value',
                message: question,
                choices: choices.map(e => { return { name: e, value: e } })
            }
            if (max !== Infinity) obj.limit = max
            const prompt = new MultiSelect(obj)
            const answer = await prompt.run().catch(() => {
                console.log(chalk.red('Cancelled'))
                process.exit(1)
            })
            if (min !== 0 && answer.length < min) continue
            return answer
        }
    },
}