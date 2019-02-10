"use strict";
const Generator = require("yeoman-generator");
const https = require("https");
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
  }
];

const LICENSE_TEMPLATE_URL =
  "https://raw.githubusercontent.com/github/choosealicense.com/gh-pages/_licenses/";

function fetchLicense(license, cb) {
  let licenseURL = `${LICENSE_TEMPLATE_URL}${license.toLowerCase()}.txt`;
  https.get(licenseURL, res => {
    let tpl = "";
    res.on("data", chunk => (tpl += chunk));
    res.on("end", () => cb(tpl));
  });
}

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
    this.fs.copyTpl(
      this.templatePath("README.md"),
      this.destinationPath(".docgen.hbs"),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath("npm-package.json"),
      this.destinationPath("package.json"),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath("index.js"),
      this.destinationPath("index.js"),
      this.props
    );

    let done = this.async();
    fetchLicense(this.props.license, tpl => {
      let content = tpl
        .replace(/-+[\d\D]*?-+\n\n/, "")
        .replace(/\[year\]/g, new Date().getFullYear())
        .replace(/\[fullname\]/g, this.props.fullName);
      this.fs.write(this.destinationPath("LICENSE"), content);
      done();
    });
  }

  install() {
    this.installDependencies({ bower: false, npm: true }).then(() => {
      console.log("Done!");
    });
  }
};
