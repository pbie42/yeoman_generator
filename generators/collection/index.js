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
  {
    type: 'input',
    name: 'path',
    message: 'What is the destination path for the collections file?',
    default: 'src/'
  }
]

class Collection extends Base {

  prompting() {
   return this.prompt(questions).then((answers) => {
      this.format = answers.format
      if (answers.path.endsWith('/')) this.path = answers.path
      else this.path = answers.path + '/'
      this.log(this.format)
      this.log(this.path)
   })
  }

  writing() {
    let fileType = this.format === 'typescript' ? 'ts' : 'js'
    this.mirror(`src/${this.format}/collections.${fileType}`, `${this.path}collections.${fileType}`)
  }

}

module.exports = Collection