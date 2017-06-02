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
      return this.prompt(questions).then(function (answers) {
        self.formName = answers.name
        console.log(`self.formName`, self.formName)
    });
   }

  prompting2 () {
    const self = this
    return this.prompt(names).then(function (answers) {
      inputs.push(answers.inputs)
      if (answers.another) self._inputs()
      else self.inputs = inputs
    })
  }

}