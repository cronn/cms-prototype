// inspired by joshua.io -> https://joschua.io/posts/2023/08/16/how-to-use-astro-assets-with-tina-cms/

// all .md files in this directory and subdirectories will be processed
const contentDirectory = ["/src/content"];

// Find and replace strings
const find = "(/src/images/";
const replace = "(../../../images/";

import { exec } from "child_process";
// execute bash command
exec(
  `find ${process.cwd()}${contentDirectory} -type f -name '*.md' -print0 | xargs -0 sed -i -e 's:${find}:${replace}:g'`,
  // Note: GNU sed that runs on Linux but not on mac (most servers use Linux)
  (error, stdout, stderr) => {
    // error handling
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    // success
    console.log(stdout);
    console.log("Successfully replaced markdown image paths");
  },
);
