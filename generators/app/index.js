"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

const QUESTIONS = [
  {
    type: "input",
    name: "moduleName",
    message: "Module name"
  },
  {
    type: "input",
    name: "moduleDescription",
    message: "Module description"
  },
  {
    type: "input",
    name: "githubUsername",
    message: "Your GitHub username"
  },
  {
    type: "input",
    name: "fullName",
    message: "Your full name"
  },
  {
    type: "list",
    name: "license",
    message: "Choose a license",
    default: "MIT",
    choices: [
      "Apache-2.0",
      "Artistic-2.0",
      "BSD-2-Clause",
      "BSD-3-Clause",
      "EPL-1.0",
      "GPL-2.0",
      "GPL-3.0",
      "ISC",
      "LGPL-2.1",
      "LGPL-3.0",
      "MIT",
      "MPL-2.0",
      "Unlicense"
    ]
  },
  {
    type: "list",
    name: "pkgTool",
    message: "Choose package tool you want to use.",
    default: "npm",
    choices: ["npm", "yarn"]
  },
  {
    type: "confirm",
    name: "shouldInstallDependencies",
    message:
      "Do you want to install dependencies immediately after module generated?",
    default: true
  }
];

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the exquisite ${chalk.red(
          "generator-npmmodule"
        )} generator!`
      )
    );

    return this.prompt(QUESTIONS).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath("babelrc"),
      this.destinationPath(".babelrc")
    );
    this.fs.copy(
      this.templatePath("editorconfig"),
      this.destinationPath(".editorconfig")
    );
    this.fs.copy(
      this.templatePath("gitignore"),
      this.destinationPath(".gitignore")
    );
    this.fs.copy(
      this.templatePath("npmignore"),
      this.destinationPath(".npmignore")
    );
  }

  install() {
    this.installDependencies();
  }
};
