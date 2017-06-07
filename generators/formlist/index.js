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
      message: 'What is the destination path for this formList?',
      default: 'src/'
    }
  ]

const names = [
    {
      type: 'input',
      name: 'inputs',
      message: 'What is the name of the input in the form?',
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

class FormList extends Base {

  prompting() {
   return this.prompt(questions).then((answers) => {
      if (this.formother) this.prompting()
      this.formName = answers.formName
      this.listName = answers.listName
      this.itemName = answers.itemName
      this.format = answers.format
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
    this.mirror('src/${this.format}/formlist_app.ts', `${this.path}app.ts`, data)
    this.mirror('src/${this.format}/form/form_main.ts', `${this.path}${this.formName}/_${this.formName}.ts`, data)
    this.mirror('src/${this.format}/form/form_model.ts', `${this.path}${this.formName}/model.ts`, data)
    this.mirror('src/${this.format}/form/form_intent.ts', `${this.path}${this.formName}/intent.ts`, data)
    this.mirror('src/${this.format}/form/form_view.ts', `${this.path}${this.formName}/view.ts`, data)
    this.mirror('src/${this.format}/list/list_main.ts', `${this.path}${this.listName}/_${this.listName}.ts`, data)
    this.mirror('src/${this.format}/list/list_model.ts', `${this.path}${this.listName}/model.ts`, data)
    this.mirror('src/${this.format}/list/list_intent.ts', `${this.path}${this.listName}/intent.ts`, data)
    this.mirror('src/${this.format}/list/list_view.ts', `${this.path}${this.listName}/view.ts`, data)
    this.mirror('src/${this.format}/list/item/_item.ts', `${this.path}${this.listName}/item/_item.ts`, data)
    if (this.format === 'typescript') this.mirror('src/typescript/formlist_interfaces.ts', `${this.path}/interfaces.ts`, data)
  }

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = FormList