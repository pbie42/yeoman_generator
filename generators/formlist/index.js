const Generator = require('yeoman-generator')
const { capitalizeFirstLetter } = require('../helpers')

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
    {
      type: 'confirm',
      name: 'onion',
      message: "Would you like the state onionified? (Otherwise it is a simple object per component)",
      default: true
    },
    { type: 'input',
      name: 'itemName',
      message: 'What is the main item this formList will hold?',
      default: 'item'
    },
    { type: 'input',
      name: 'formName',
      message: 'What is the name of the FORM in this formList?',
      default: 'someForm'
    },
    { type: 'input',
      name: 'listName',
      message: 'What is the name of the LIST in this formList?',
      default: 'someList'
    },
    {
      type: 'input',
      name: 'path',
      message: 'What is the destination path for this form? (Include desired folder name)',
      default: 'src/formList'
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
      message: 'What is the name of the input in the form?',
      default: 'email'
    },
    {
      type: 'confirm',
      name: 'another',
      message: "Is there another input?",
      default: true
    }
  ]

  const inputs = []

class FormList extends Base {

  prompting() {
   return this.prompt(questions).then((answers) => {
      if (this.formother) this.prompting()
      this.formName = answers.formName
      this.listName = answers.listName
      this.itemName = answers.itemName
      this.format = answers.format
      this.onion = answers.onion
      this.views = answers.views
      if (answers.path.endsWith('/')) this.path = answers.path
      else this.path = answers.path + '/'
      this.log(this.formName)
      this.log(this.listName)
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
    const data = {
      inputs: this.inputs,
      formName: this.formName,
      listName: this.listName,
      itemNameL:this.itemName.toLowerCase(),
      itemNameU: capitalizeFirstLetter(this.itemName)
    }
    let src = this.onion ? 'onionify' : 'src'
    let filetype = this.format === 'typescript' ? 'ts' : 'js'
    this.mirror(`${src}/${this.format}/formlist_app.${filetype}`, `${this.path}app.${filetype}`, data)
    this.mirror(`${src}/${this.format}/form/form_main.${filetype}`, `${this.path}${this.formName}/_${this.formName}.${filetype}`, data)
    this.mirror(`${src}/${this.format}/form/form_model.${filetype}`, `${this.path}${this.formName}/model.${filetype}`, data)
    this.mirror(`${src}/${this.format}/form/form_intent.${filetype}`, `${this.path}${this.formName}/intent.${filetype}`, data)
    this.mirror(`${src}/${this.format}/form/form_view.${filetype}`, `${this.path}${this.formName}/view.${filetype}`, data)
    this.mirror(`${src}/${this.format}/list/list_main.${filetype}`, `${this.path}${this.listName}/_${this.listName}.${filetype}`, data)
    this.mirror(`${src}/${this.format}/list/list_model.${filetype}`, `${this.path}${this.listName}/model.${filetype}`, data)
    this.mirror(`${src}/${this.format}/list/list_intent.${filetype}`, `${this.path}${this.listName}/intent.${filetype}`, data)
    this.mirror(`${src}/${this.format}/list/list_view.${filetype}`, `${this.path}${this.listName}/view.${filetype}`, data)
    this.mirror(`${src}/${this.format}/list/item/_item.${filetype}`, `${this.path}${this.listName}/item/_item.${filetype}`, data)
    if (this.views === true) this.mirror(`${src}/${this.format}/form/form_views.${filetype}`, `${this.path}views.${filetype}`, data)
    if (this.format === 'typescript') this.mirror(`${src}/typescript/formlist_interfaces.${filetype}`, `${this.path}/interfaces.${filetype}`, data)
  }

}

module.exports = FormList