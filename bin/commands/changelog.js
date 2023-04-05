module.exports = [async (args) => {
    const chalk = require('chalk')
    const fs = require('fs')
    const path = require('path')
    const { Octokit } = require('@octokit/rest')

    const [user, repo, GITHUB_TOKEN, outputFileName, version, since] = args
    if (args.length === 0 || args.join(' ').includes('--help')) {
        return console.log(chalk.cyan('This will generate a changelog for you\'r repo on GitHub. To use this command you will need to specify a lot of arguments, as we wanted to make it easy to include this in a GitHub workflow. ' +
        'Before you will be able to use this command, you\'ll have to create a PERSONAL ACCESS TOKEN on GitHub. Make sure you grant all repo scopes to it. ' +
        'If you are not sure how to create one, use this link https://github.com/settings/tokens/new?scopes=repo. ' +
        '\n\nKeep in mind: This token will grant access to your GitHub repos, so make sure you trust the services you give it to. As nautus is open source, you might want to take a look at https://raw.githubusercontent.com/greencoder001/nautus/main/bin/commands/changelog.js to see how your token is used.' +
        '\n\nIf you have your token created you can run this command like this:\nnautus changelog <user> <repo> <GITHUB_TOKEN> <outputFileName> <releaseTag> [sinceCommit]\n' +
        'Example usage: nautus changelog greencoder001 nautus MYGITHUBTOKEN123 changelog.md v1.0.0 7599e2d44a18f5c8edef7924ff5945a77be5fc62' +
        '\nThe last argument is only necessary if you want to create a changelog since a specific commit and not since the last release. You don\'t have to provide it\n\n\nIf you need more info about how to create a GitHub workflow & more take a look at https://github.com/greencoder001/nautus#generating-changelogs') + '\n\n' + chalk.yellow('If you want to add badegs to your changelog, add them in the file ./badges.md'))
    }

    if (!user) return console.log(chalk.red('Error: Please specify the user(name). For more information run nautus changelog --help'))
    if (!repo) return console.log(chalk.red('Error: Please specify the repository. For more information run nautus changelog --help'))
    if (!GITHUB_TOKEN) return console.log(chalk.red('Error: Please specify the Personal Access Token. For more information run nautus changelog --help'))
    if (!outputFileName) return console.log(chalk.red('Error: Please specify the output file name. For more information run nautus changelog --help'))
    if (!version) return console.log(chalk.red('Error: Please specify the release tag. Fpr more information run nautus changelog --help'))

    // Init API
    const kit = new Octokit({ auth: `${GITHUB_TOKEN}` })
    try {
        const { data: { login } } = await kit.rest.users.getAuthenticated()
        console.log(chalk.green('Successfully loggedin as ' + login + '!'))
    } catch (err) {
        if (err.toString().toLowerCase().includes('bad credentials')) {
            console.log(chalk.red('Error: Bad credentials. Make sure you provided a valid GitHub token!'))
        } else {
            console.log(chalk.red('An unexpected error occured. This is probably because bad login data. Feel free to create an issue at our repository on GitHub.'))
            console.log(err)
        }
        return process.exit(1)
    }

    try {
        await kit.rest.repos.get({
            owner: user,
            repo
        })
        console.log(chalk.green('Repo was found!'))
    } catch (err) {
        if (err.toString().toLowerCase().includes('not found')) {
            console.log(chalk.red('Error: Repository not found. Make sure that the repository ' + user + '/' + repo + ' exists. And you have access to it through your access token!'))
        } else {
            console.log(chalk.red('An unexpected error occured:'))
            console.log(err)
        }

        return process.exit(1)
    }

    const kitrepo = await kit.rest.repos.get({
        owner: user,
        repo
    })

    const collectedData = {
        name: kitrepo.data.name,
        description: kitrepo.data.description,
        pulls: [],
        mergedPulls: []
    }

    const tagsUrl = kitrepo.data.tags_url
    const commitsUrl = `https://api.github.com/repos/${user}/${repo}/commits`

    // Get since date
    let searchInfoSinceDate = null

    if (since) {
        // Commit provided
        try {
            const commit = new Date((await kit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
                owner: user,
                repo,
                ref: since
            })).data.commit.author.date)
            searchInfoSinceDate = commit
        } catch {
            console.log(chalk.red('Error: Please make sure the commit you provided really exists!'))
            process.exit(1)
        }
    } else {
        // Search for last release
        try {
            const latestRelease = await kit.request('GET /repos/{owner}/{repo}/releases/latest', {
                owner: user,
                repo
            })
            searchInfoSinceDate = new Date(latestRelease.data.created_at)
        } catch {
            // No release found, setting date to 1800
            searchInfoSinceDate = new Date(-5364665608000)
        }
    }
    console.log(chalk.green('Resolved last release date successfully!'))

    // Get closed issues since last release
    const issues = (await kit.request(`GET /repos/{owner}/{repo}/issues?state=closed&per_page=100&page=1&since=${searchInfoSinceDate.toISOString()}`, {
        owner: user,
        repo
    })).data.filter(issue => {
        if (issue.pull_request) {
            collectedData.pulls.push({
                title: issue.title,
                url: issue.pull_request.html_url,
                labels: issue.labels.map(label => label.name)
            })
            return false
        }
        return true
    }).map(issue => {
        return {
            title: issue.title,
            url: issue.html_url,
            labels: issue.labels.map(label => label.name)
        }
    })
    collectedData.issues = issues

    // Add pull commits
    for (let i = 0; i < collectedData.pulls.length; i++) {
        const pull = collectedData.pulls[i]
        const id = pull.url.split('/').pop()
        try {
            const commitsOnPull = (await kit.request('GET /repos/{owner}/{repo}/pulls/{id}/commits?per_page=100', {
                owner: user,
                repo,
                id
            })).data.map(commit => {
                return {
                    msg: commit.commit.message,
                    url: commit.html_url
                }
            })
            pull.commits = commitsOnPull
        } catch {
            pull.commits = []
        }

        collectedData.pulls[i] = pull
    }

    // Get merged pulls
    for (const pull of collectedData.pulls) {
        const id = pull.url.split('/').pop()
        try {
            await kit.request('GET /repos/{owner}/{repo}/pulls/{id}/merge', {
                owner: user,
                repo,
                id
            })
            collectedData.mergedPulls.push(pull)
        } catch {}
    }

    // Filter pulls by not merged
    collectedData.pulls = collectedData.pulls.filter(pull => !collectedData.mergedPulls.includes(pull))

    // Get commits on main since last release
    const commitsOnMain = (await kit.request('GET /repos/{owner}/{repo}/commits?page=1&per_page=100&since=' + searchInfoSinceDate.toISOString(), {
        owner: user,
        repo
    })).data.map(commit => {
        return {
            msg: commit.commit.message,
            url: commit.html_url
        }
    })
    collectedData.commitsOnMain = commitsOnMain

    // Filter issues by labels
    collectedData.issuesFixingBugs = collectedData.issues.filter(e => e.labels.includes('bug'))
    collectedData.issuesFixingVulnerabilities = collectedData.issues.filter(e => e.labels.includes('vulnerability'))
    collectedData.issuesAddingFeatures = collectedData.issues.filter(e => e.labels.includes('feature') || e.labels.includes('enhancement'))

    collectedData.issues = collectedData.issues.filter(e => {
        return !(e.labels.includes('bug') ||
                 e.labels.includes('vulnerability') ||
                 e.labels.includes('feature') ||
                 e.labels.includes('enhancement'))
    })

    // Filter merged pulls by labels
    collectedData.mergedPullsFixingBugs = collectedData.mergedPulls.filter(e => e.labels.includes('bug'))
    collectedData.mergedPullsFixingVulnerabilities = collectedData.mergedPulls.filter(e => e.labels.includes('vulnerability'))
    collectedData.mergedPullsAddingFeatures = collectedData.mergedPulls.filter(e => e.labels.includes('feature') || e.labels.includes('enhancement'))
    collectedData.mergedPullsUpdatingDependencies = collectedData.mergedPulls.filter(e => e.labels.includes('dependencies'))
    collectedData.mergedPullsUpdatingTests = collectedData.mergedPulls.filter(e => e.labels.includes('test') || e.labels.includes('tests'))

    collectedData.mergedPulls = collectedData.mergedPulls.filter(e => {
        return !(e.labels.includes('bug') ||
            e.labels.includes('vulnerability') ||
            e.labels.includes('feature') ||
            e.labels.includes('enhancement') ||
            e.labels.includes('dependencies') ||
            e.labels.includes('test') ||
            e.labels.includes('tests'))
    })

    // Collected everything, generating changelog
    console.log(chalk.green('Done gathering information'))

    let badges = ''
    if (fs.existsSync(path.join(process.cwd(), 'badges.md'))) {
        badges = fs.readFileSync(path.join(process.cwd(), 'badges.md')).toString('utf8')
    }

    let commitLog = ''
    if (collectedData.commitsOnMain.length !== 0) {
        commitLog += '**Main**\n\n'
        for (const cmt of collectedData.commitsOnMain) {
            commitLog += `- [${cmt.url.split('/').pop().substring(0, 7)}](${cmt.url}) ${cmt.msg.replace(/\n/g, ' ')}\n`
        }
        commitLog += '\n\n'
    }

    let prLog = ''

    for (const pr of collectedData.mergedPulls) {
        prLog += `- [#${pr.url.split('/').pop()}](${pr.url}) ${pr.title}`

        if (pr.commits.length !== 0) {
            commitLog += `**PR #${pr.url.split('/').pop()} - ${pr.title}**\n\n`
            for (const cmt of pr.commits) {
                commitLog += `- [${cmt.url.split('/').pop().substring(0, 7)}](${cmt.url}) ${cmt.msg.replace(/\n/g, ' ')}\n`
            }
            commitLog += '\n\n'
        }
    }

    let featureLog = ''

    for (const i of collectedData.issuesAddingFeatures) {
        featureLog += `- [Issue #${i.url.split('/').pop()}](${i.url}) ${i.title}\n`
    }
    for (const i of collectedData.mergedPullsAddingFeatures) {
        featureLog += `- [PR #${i.url.split('/').pop()}](${i.url}) ${i.title}\n`
    }

    let issueLog = ''
    for (const i of collectedData.issues) {
        issueLog += `- [#${i.url.split('/').pop()}](${i.url}) ${i.title}\n`
    }

    let bugLog = ''

    for (const i of collectedData.issuesFixingBugs) {
        bugLog += `- [Issue #${i.url.split('/').pop()}](${i.url}) ${i.title}\n`
    }
    for (const i of collectedData.mergedPullsFixingBugs) {
        bugLog += `- [PR #${i.url.split('/').pop()}](${i.url}) ${i.title}\n`
    }

    let vulnerabilityLog = ''

    for (const i of collectedData.issuesFixingVulnerabilities) {
        vulnerabilityLog += `- [Issue #${i.url.split('/').pop()}](${i.url}) ${i.title}\n`
    }
    for (const i of collectedData.mergedPullsFixingVulnerabilities) {
        vulnerabilityLog += `- [PR #${i.url.split('/').pop()}](${i.url}) ${i.title}\n`
    }

    let depsLog = ''
    for (const i of collectedData.mergedPullsUpdatingDependencies) {
        depsLog += `- [PR #${i.url.split('/').pop()}](${i.url}) ${i.title}\n`
    }

    let testLog = ''
    for (const i of collectedData.mergedPullsUpdatingTests) {
        testLog += `- [PR #${i.url.split('/').pop()}](${i.url}) ${i.title}\n`
    }

    let changelog = `# ${version}
${badges}

<details>
<summary>Commits</summary>

${commitLog}
</details>

${collectedData.mergedPulls.length > 0 ? `<details>
<summary>Merged pull requests</summary>

${prLog}
</details>` : ''}
${collectedData.issues.length > 0 ? `<details>
<summary>Closed issues</summary>

${issueLog}
</details>` : ''}

## Features
${featureLog}

${bugLog !== '' ? `## Fixed bugs
${bugLog}

` : ''}
${vulnerabilityLog !== '' ? `## Fixed vulnerabilities
${vulnerabilityLog}
` : ''}
${depsLog !== '' ? `## Updated dependencies
${depsLog}

` : ''}
${testLog !== '' ? `## Updated tests
${testLog}

` : ''}
`

    fs.writeFileSync(path.join(process.cwd(), outputFileName), changelog)
    console.log(chalk.green('Successfully generated changelog!'))
}, 'changelog [options] [--help]', 'Generates a changelog based on commits, issues and PRs']