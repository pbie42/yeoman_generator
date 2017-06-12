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
  { type: 'input',
    name: 'name',
    message: 'What is the name of this list?',
    default: 'someList'
  },
  {
    type: 'input',
    name: 'path',
    message: 'What is the destination path including the desired folder name?',
    default: 'src/someList'
  },
  { type: 'input',
    name: 'itemName',
    message: 'What is the main item this list will hold?',
    default: 'item'
  },
]

const names = [
    {
      type: 'input',
      name: 'inputs',
      message: "What is a key name in the list item's datafield?",
      default: 'name'
    },
    {
      type: 'confirm',
      name: 'another',
      message: "Is there another datafield?",
      default: true
    }
  ]

  const inputs = []

class List extends Base {

  prompting() {
   return this.prompt(questions).then((answers) => {
      if (this.formother) this.prompting()
      this.listName = answers.name
      this.format = answers.format
      this.itemName = answers.itemName
      if (answers.path.endsWith('/')) this.path = answers.path
      else this.path = answers.path + '/'
      this.log(this.listName)
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
    const data = {
      name: this.listName,
      inputs: this.inputs,
      itemNameL:this.itemName.toLowerCase(),
      itemNameU: capitalizeFirstLetter(this.itemName)
    }
    let filetype = this.format === 'typescript' ? 'ts' : 'js'
    this.mirror(`src/${this.format}/list_main.${filetype}`, `${this.path}_${this.listName}.${filetype}`, data)
    this.mirror(`src/${this.format}/list_model.${filetype}`, `${this.path}model.${filetype}`, data)
    this.mirror(`src/${this.format}/list_intent.${filetype}`, `${this.path}intent.${filetype}`, data)
    this.mirror(`src/${this.format}/list_view.${filetype}`, `${this.path}view.${filetype}`, data)
    this.mirror(`src/${this.format}/item/_item.${filetype}`, `${this.path}/item/_item.${filetype}`, data)
    if (this.format === 'typescript') this.mirror(`src/typescript/list_interfaces.${fileType}`, `${this.path}/interfaces.${fileType}`, data)
  }

}

module.exports = List