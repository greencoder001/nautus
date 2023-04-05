# Nautus 🪸
 Your one & only ultimate software development tool
 **NOTE: Development is still in progress, this notice will dissapear when the first stable version is released**

# Contribution
We want to see nautus grow, so if you have a feature request just create a issue on GitHub and if you want to add a feature yourself, fix a typo or just want to optimize something, please feel free to open a pull request with a detailed explanation.

# Use cases
**Nautus can help you:**
- [X] Create boilerplate code
- [X] Compile your code
- [X] Run your code
- [X] Test your code
- [X] Build your code
- [ ] Debug your code
- [X] Release your code
- [ ] Generate Changelogs
- [X] Format your code
- [X] Refactor your code
- [ ] Manage .ignore files
- [ ] Test APIs
- [X] Create docs
- [X] Generate a license file
- [X] Lint your code
- [ ] Manage GitHub workflows
- [ ] Automatically detect used technologies & integrate them with nautus

# Goals
**Some things we'd like nautus to achieve:**
- Becoming the the only software tool you'll ever need
- Integrating yeoman generators in the kelp ecosystem
- Getting a GUI
- Being used in at least 5 projects (If you use nautus, please create a issue stating for what you use nautus so we can list you as an early supporter)

# Why shouldn't I just use a task runner?
The answer is simple: A task runner does what it should, it runs tasks. But nautus can do much more (as seen [above](#use-cases)). Nautus also provides you with a useful cli and has made becoming the only software development tool you'll ever need to it's goal. Nautus will help you manage and automate your code and has it's own boilerplate generator. Also, who says you can't use both? For example if you wanted to use gulp, just add
```js
await cmd('gulp').catch(error)
```
to your `@Prep.js` script, and gulp will run it's tasks each time before your code will be run

# Download
To download nautus, make sure you have npm installed and run `npm i nautus -g`

# Getting started
1. Download nautus (see [above](#download))
2. Switch to your project directory (it does't have to be empty)
3. Create a new nautus project using `nautus create`
4. Either [use a kelp boilerplate generator](#using-kelp-to-generate-boilerplate) or [start a project from scratch](#configuring-nautus-for-your-needs)
5. Run your project using `nautus run`
6. Learn about the [commands](#commands) & how to use them
7. If not already done in step 4, [learn how to use & write scripts](#using-scripts) & [how to configure nautus for your needs](#configuring-nautus-for-your-needs)
8. Learn how to use [tanks](#tanks)
9. Learn how to [create your own boilerplate generators](#creating-a-boilerplate-generator-for-kelp)

# Using kelp to generate boilerplate
If you want to generate boilerplate code, use kelp. To list all available generators run `nautus kelp`. Now let's say you want to build a npm package. In that case you would need to pick the right generator, in this case *npm*. Then you run `nautus kelp npm` to start the generator. It will ask you a few question and automatically create boilerplate, install necessary dependencies & configure [scripts](#using-scripts) for you. If no other info provided, look into the files, write some code and use `nautus run` to execute everything. If you want to create your own kelp generator look [here](#creating-a-boilerplate-generator-for-kelp). If you can't find a suiting generator, it's because nautus doesn't have a big community. In that case you might want to use a tool like [Yeoman](https://yeoman.io/) instead. After that you need to [configure nautus manually](#configuring-nautus-for-your-needs)

# Configuring nautus for your needs

# Using scripts

# Commands

# Tanks
**If you want to lint, format or refactor parts of your code, you can use the nautus tank command:**
To list all commands run `nautus tank`.
If you want to list all tanks you can use the `nautus tank ls` command. All other commands are listed here and have the followeing syntax: `nautus tank <tankname> <command> [options]`

## create
> Creates a tank with the specified tankname
> Usage: nautus tank mytank create

## delete
> Deletes a tank with the specified tankname
> Usage: nautus tank mytank delete

## paths
> Walks you through an UI to include and exclude specific patgs in the tank
> You can use the default path template syntax (e.g. src/\*\*/\*.js)
> Usage: nautus tank mytank paths

## include
> Includes specific filepath
> Usage: nautus tank mytank include src/*.js

## exclude
> Excludes a beforehand included filepath
> Usage: nautus tank mytank exclude src/*.min.js

## refactor
> Refactors the code in the tank using a Regular Expression Script file (read more about that [here](#regular-expression-script-res))
> Usage: nautus tank mytank refactor myregexscript

## format
> Formats your code using a formatter like prettier. Define it in `./nautus/format.yaml`
> Usage: nautus tank mytank format

## lint
> Lints or fixes your code. Define it in `./nautus/lint.yaml`
> Usage: nautus tank mytank lint --fix

## cmd
> Runs a command for every file, kind of like [format](#format)
> Usage: nautus tank mytank cmd "@ONCE echo this is a command!!"

# Creating a boilerplate generator for kelp
If you want to generate boilerplate code, you need to use kelp. If you wanted to create a npm-module you could use `nautus kelp npm`. This would search for a npm package called `nautus-npm`. If this package exists, nautus will download it and use it for boilerplate generation. To create your own generator create a new project using `nautus create` and `nautus kelp kelp`. Now jump into your editor to write some code and see examples. If you need inspiration or more examples, look [here](https://www.npmjs.com/search?q=nautus). After your done, run `nautus release major` to release your first version to npm. After that you can use `nautus release <major|minor|patch>` to publish it again. After that you can use it by using `nautus kelp my-generator`.


# Regular Expression Script (RES)
If you are working with tanks, you might need to refactor your code. To do that we use RES, which is a custom language to write replacements using regular expressions. If you want matching syntax highlighting choose `CoffeScript` in your editor. To create a new RES, create a file called `coolnamehere.res` in the `./nautus/refactor` directory. Here you can write your script like this:
```coffee
/regular expression belongs here/g -> 'value to replace with'
/2nd reg(.*?)ex/gi -> 'You entered "' + $1 + '" between reg and ex!'
```
After that you can use it by running `nautus tank main refactor coolnamehere`. If you want a more real example, here's how to refactor commonjs require code to esm:

**require-to-esm.res**:
```coffee
/(const|var|let) (.*?)([ ]*)=([ ]*)require\(["'](.*?)["']\)/g -> 'import ' + $1 + ' from ' + $5 + $6 + $5
```
This will replace `const fs = require('fs')` with `import fs from 'fs'`

The syntax is basically this:
```
RegExp -> String
```
The string is allowed to be concattenated with content of groups by using `String + $groupNumber`