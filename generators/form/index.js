const Generator = require('yeoman-generator')

const questions = [
    { type: 'input',
      name: 'name',
      message: 'What is the name of this form?',
      default: 'someForm'
    }
  ]

const names = [
    {
      type: 'input',
      name: 'inputs',
      message: 'What is the name of the input?',
      default: '.input'
    },
    {
      type: 'confirm',
      name: 'another',
      message: "Is there another input?",
      default: true
    }
  ]

  const inputs = []

module.exports = class extends Generator {

  prompting() {
    var self = this
      return this.prompt(questions).then((answers) => {
        this.formName = answers.name
        this.log(this.formName)
    })
  }

  prompting2 () {
    const self = this
    return this.prompt(names).then((answers) => {
      inputs.push(answers.inputs)
      if (answers.another) this.prompting2()
      else {
        self.inputs = inputs
        this.log(self.inputs)
      }
    })
  }

}