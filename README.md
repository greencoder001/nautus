# Nautus 🪸
 Your one & only ultimate software development tool

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
- [ ] Format your code
- [ ] Refactor your code
- [ ] Manage .ignore files
- [ ] Test APIs
- [ ] Create docs
- [ ] Choose a license
- [ ] Lint your code

# Development Status
**Commands that have functionality:**
- [X] @main
- [X] build
- [X] create
- [X] delete
- [X] exec
- [X] help
- [X] kelp
- [X] kelp-try
- [ ] lint
- [X] me
- [X] release
- [X] run
- [ ] tank
- [X] test
- [ ] use

# Creating a boilerplate generator for kelp
If you want to generate boilerplate code, you need to use kelp. If you wanted to create a npm-module you could use `nautus kelp npm`. This would search for a npm package called `nautus-npm`. If this package exists, nautus will download it and use it for boilerplate generation. To create your own generator create a new project using `nautus create` and `nautus kelp kelp`. Now jump into your editor to write some code and see examples. After your done, run `nautus release major` to release your first version to npm. After that you can use `nautus release <major|minor|patch>` to publish it again. After that you can use it by using `nautus kelp my-generator`.