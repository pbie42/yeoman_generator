var Generator = require('yeoman-generator')

module.exports = class extends Generator {

   method1() {
      this.log('form method 1 just ran')
   }

   method2() {
      this.log('form method 2 just ran')
   }

   _private_method() {
      console.log('private hey');
   }

}