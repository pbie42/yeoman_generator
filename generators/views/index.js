const Generator = require('yeoman-generator')

class Base extends Generator {
	mirror(name, dest, data={}) {
		this.fs.copyTpl(this.templatePath(name), this.destinationPath(dest), data)
	}
}

const questions = [
    {
      type: 'input',
      name: 'path',
      message: 'What is the destination path for the views file?',
      default: 'src/'
    }
  ]

class Views extends Base {

  prompting() {
   return this.prompt(questions).then((answers) => {
      this.path = answers.path
      this.log(this.path)
   })
  }

  writing() { this.mirror('src/views.ts', `${this.path}views.ts`) }

}

module.exports = Views