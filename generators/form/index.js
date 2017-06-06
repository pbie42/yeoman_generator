const Generator = require('yeoman-generator')

class Base extends Generator {
	mirror(name, dest, data={}) {
		this.fs.copyTpl(this.templatePath(name), this.destinationPath(dest), data)
	}
}

const questions = [
    { type: 'input',
      name: 'name',
      message: 'What is the name of this form?',
      default: 'someForm'
    },
    {
      type: 'input',
      name: 'path',
      message: 'What is the destination path for this form?',
      default: 'src/'
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
   return this.prompt(questions).then((answers) => {
      if (this.formother) this.prompting()
      this.formName = answers.name
      this.path = answers.path
      this.log(this.formName)
      this.log(this.path)
   })
  }

  prompting2 () {
   const done = this.async()
    return this.prompt(names).then((answers) => {
      inputs.push(answers.inputs)
      if (answers.another) this.prompting2()
      else {
        this.inputs = inputs
        this.log(this.inputs)
        done()
      }
    })
  }

  writing() {
		this.mirror('src/form_main.js', `${this.path}_${this.formName}.js`, { name: this.formName })
    this.mirror('src/form_model.js', `${this.path}model.js`, { inputs: this.inputs })
    this.mirror('src/form_intent.js', `${this.path}intent.js`, { inputs: this.inputs })
    this.mirror('src/form_view.js', `${this.path}view.js`, { inputs: this.inputs })
    this.mirror('src/form_views.js', `${this.path}views.js`)
  }

}

module.exports = Form