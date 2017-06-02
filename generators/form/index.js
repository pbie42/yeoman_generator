const Generator = require('yeoman-generator')

class Base extends Generator {
	mirror(name, data={}) {
		this.fs.copyTpl(this.templatePath(name), this.destinationPath(name), data)
	}
}

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

class Form extends Base {

  prompting() {
    var self = this
   return this.prompt(questions).then((answers) => {
      if (this.formother) self.prompting()
      this.formName = answers.name
      this.log(this.formName)
   })
  }

  prompting2 () {
     var done = this.async()
    const self = this
    return this.prompt(names).then((answers) => {
      inputs.push(answers.inputs)
      if (answers.another) this.prompting2()
      else {
        self.inputs = inputs
        this.log(self.inputs)
        done()
      }
    })
  }

  writing() {
		this.mirror('src/form_main.js', { name: this.formName })
  }

}

module.exports = Form