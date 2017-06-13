const Generator = require('yeoman-generator')

class Base extends Generator {
	mirror(name, dest, data={}) {
		this.fs.copyTpl(this.templatePath(name), this.destinationPath(dest), data)
	}
}

const questions = [
  {
    type: 'list',
    name: 'format',
    message: 'Would you like the files output in TypeScript or JavaScript?',
    choices: ['TypeScript', 'JavaScript'],
    filter: function (val) {
      return val.toLowerCase();
    }
  },
  { type: 'input',
    name: 'name',
    message: 'What is the name of this form?',
    default: 'someForm'
  },
  {
    type: 'input',
    name: 'path',
    message: 'What is the destination path for this form? (Include desired folder name)',
    default: 'src/someForm'
  },
  {
    type: 'confirm',
    name: 'views',
    message: 'Add views file? (Can also add separetly with yo paul:views)',
    default: 'true'
  }
]

const names = [
  {
    type: 'input',
    name: 'inputs',
    message: 'What is the name of the input in this form?',
    default: 'input'
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
      this.format = answers.format
      if (answers.path.endsWith('/')) this.path = answers.path
      else this.path = answers.path + '/'
      this.views = answers.views
      this.log(this.formName)
      this.log(this.path)
      this.log(this.format)
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
    let filetype = this.format === 'typescript' ? 'ts' : 'js'
		this.mirror(`src/${this.format}/form_main.${filetype}`, `${this.path}_${this.formName}.${filetype}`, { name: this.formName })
    this.mirror(`src/${this.format}/form_model.${filetype}`, `${this.path}model.${filetype}`, { inputs: this.inputs })
    this.mirror(`src/${this.format}/form_intent.${filetype}`, `${this.path}intent.${filetype}`, { inputs: this.inputs })
    this.mirror(`src/${this.format}/form_view.${filetype}`, `${this.path}view.${filetype}`, { inputs: this.inputs })
    if (this.views === true) this.mirror(`src/${this.format}/form_views.${filetype}`, `${this.path}views.${filetype}`, { inputs: this.inputs })
    if (this.format === 'typescript') this.mirror(`src/typescript/form_interfaces.${filetype}`, `${this.path}/interfaces.${filetype}`, { inputs: this.inputs })
  }

}

module.exports = Form