const Generator = require('yeoman-generator')

class Base extends Generator {
	mirror(name, dest, data={}) {
		this.fs.copyTpl(this.templatePath(name), this.destinationPath(dest), data)
	}
}

const questions = [
    { type: 'input',
      name: 'formName',
      message: 'What is the name of the form in this formList?',
      default: 'someForm'
    },
    { type: 'input',
      name: 'listName',
      message: 'What is the name of the list in this formList?',
      default: 'someList'
    },
    { type: 'input',
      name: 'itemName',
      message: 'What is the main item this list will hold?',
      default: 'item'
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
    this.mirror('src/formlist_app.js', `${this.path}app.js`, { formName: this.formName,
                                                               listName: this.listName,
                                                               itemNameL:this.itemName.toLowerCase(),
                                                               itemNameU: capitalizeFirstLetter(this.itemName) })
		this.mirror('src/form_main.js', `${this.path}${this.formName}/_${this.formName}.js`, { formName: this.formName,
                                                                                           listName: this.listName,
                                                                                           itemNameL:this.itemName.toLowerCase(),
                                                                                           itemNameU: capitalizeFirstLetter(this.itemName) })
    this.mirror('src/form_model.js', `${this.path}${this.formName}/model.js`, { inputs: this.inputs,
                                                                                formName: this.formName,
                                                                                listName: this.listName,
                                                                                itemNameL:this.itemName.toLowerCase(),
                                                                                itemNameU: capitalizeFirstLetter(this.itemName) })
    this.mirror('src/form_intent.js', `${this.path}${this.formName}/intent.js`, { inputs: this.inputs })
    this.mirror('src/form_view.js', `${this.path}${this.formName}/view.js`, { inputs: this.inputs })
		this.mirror('src/list_main.js', `${this.path}${this.listName}/_${this.listName}.js`, { listName: this.listName,
                                                                                           itemNameL:this.itemName.toLowerCase(),
                                                                                           itemNameU: capitalizeFirstLetter(this.itemName)})
    this.mirror('src/list_model.js', `${this.path}${this.listName}/model.js`, { inputs: this.inputs })
    this.mirror('src/list_intent.js', `${this.path}${this.listName}/intent.js`, { inputs: this.inputs,
                                                                                  itemNameL:this.itemName.toLowerCase(),
                                                                                  itemNameU: capitalizeFirstLetter(this.itemName) })
    this.mirror('src/list_view.js', `${this.path}${this.listName}/view.js`, { inputs: this.inputs,
                                                                              itemNameL:this.itemName.toLowerCase(),
                                                                              itemNameU: capitalizeFirstLetter(this.itemName) })
    this.mirror('src/item_main.js', `${this.path}${this.listName}/item/_item.js`, { itemNameL:this.itemName.toLowerCase(),
                                                                              itemNameU: capitalizeFirstLetter(this.itemName),
                                                                              inputs: this.inputs })
  }

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = FormList