export default {
  input: "./bin/index.js",
  output: [
    {
      format: "cjs",
      file: "dist/index.cjs.js",
      banner: "#!/usr/bin/env node",
    },
    {
      format: "es",
      file: "dist/index.esm.js",
      banner: "#!/usr/bin/env node",
    },
  ],
  // external: [
  //   "download-git-repo",
  //   "cac",
  //   "chalk",
  //   "ora",
  //   "inquirer",
  //   "clear",
  //   "shelljs",
  //   "figlet",
  // ],
};
