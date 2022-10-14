#!/usr/bin/env node
import inquirer from 'inquirer';
import clear from 'clear';
import figlet from 'figlet';
import ora from 'ora';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import download from 'download-git-repo';
import shell from 'shelljs';
import cac from 'cac';

const log = (...args) => console.log(chalk.green(...args));
const cli = cac();
const urlMo = "direct:git@gitee.com:fjl2020/cli-template-mobile.git";
const urlPc = "direct:https://gitee.com/fjl2020/cli-template.git";
const urlAdmin = "direct:https://gitee.com/fjl2020/cli-template-admin.git";
const bindHander = {
  init() {
    clear();
    const logo = figlet.textSync("H e l l o  W o r l d", {
      font: "Epic",
      horizontalLayout: "ful",
      verticalLayout: "default",
      width: 280,
      whitespaceBreak: true,
    });

    const rainbow = chalkAnimation.rainbow(logo);
    setTimeout(() => {
      rainbow.stop(); // Animation stops
      query();
    }, 3000);
  },
};
function query() {
  inquirer
    .prompt([
      {
        type: "text",
        message: "输入文件夹名称",
        name: "dirname",
      },
      {
        type: "list",
        name: "prokind",
        message: "选择项目类型",
        choices: ["✔ 移动端项目", "✔ pc端项目", "✔ pc端后台管理"],
      },
      {
        type: "list",
        name: "routerkind",
        message: "选择路由mode类型",
        choices: ["✔ history", "✔ hash"],
      },
      {
        type: "list",
        name: "csskind",
        message: "选择css",
        choices: ["✔ less", "✔ stylus"],
      },
      {
        type: "list",
        name: "installkind",
        message: "选择安装工具",
        choices: ["✔ pnpm", "✔ yarn", "✔ npm"],
      },
    ])
    .then((answers) => {
      const _dirname = answers.dirname;

      if (_dirname) {
        const spinner = ora("🌶 loading");
        spinner.start();
        const _pwd = shell.pwd().stdout;
        const _projectPath = `${_pwd}/${_dirname}`;
        console.log(
          " ✨  Creating project in " + chalk.green(`${_pwd}/${_dirname}`)
        );

        shell.cd(_pwd);
        shell.rm("-rf", _projectPath);
        shell.mkdir(_dirname);
        const cloneUrl = answers.prokind.substr(2);
        console.log(cloneUrl);
        let url = "";
        if (cloneUrl === "移动端项目") {
          url = urlMo;
        } else if (cloneUrl === "pc端项目") {
          url = urlPc;
        } else {
          url = urlAdmin;
        }

        download(url, _projectPath, { clone: true }, (err) => {
          if (err) {
            console.log(chalk.bgRed("cli 启动失败"), err);
          } else {
            // sed 换
            // awk 对变量过滤
            shell.sed(
              "-i",
              "template1",
              _dirname,
              _projectPath + "/package.json"
            );

            const routermode = answers.routerkind.substr(2);
            shell.sed(
              "-i",
              "modeType",
              routermode,
              _projectPath + "/src/router/index.js"
            );
            console.log(routermode);

            const installkind = answers.installkind.substr(2);
            const css = answers.csskind.substr(2);
            shell.cd(_dirname);

            if (installkind === "yarn") {
              shell.exec(`${installkind} add ${css} ${css}-loader -D`);
              shell.exec(`${installkind}`);
            } else {
              shell.exec(`${installkind} install ${css} ${css}-loader -D`);
              shell.exec(`${installkind} install`);
            }

            spinner.stop();
            log(`
💐💐💐💐💐💐💐💐💐💐💐💐💐💐
安装完成：
🚀 To get Start 🚀
===========================
cd ${_dirname}
npm run dev
===========================
            `);
          }
        });
      }
    });
}
cli
  .command("<cmd>", "Remove a dir")
  .option("-r, --recursive", "Remove recursively")
  .action((cmd, options) => {
    console.log("p", cmd, options);
    const bandle = bindHander[cmd];
    if (bandle) {
      bandle();
    } else {
      console.log(
        chalk.yellow("抱歉 ") + chalk.red(cmd) + chalk.yellow(" 暂未实现")
      );
    }
  });

cli.parse();
