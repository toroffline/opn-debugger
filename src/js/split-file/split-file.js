import inquirer from "inquirer";
import fs, { writeFileSync } from "fs";
import inquirerSelectDir from "inquirer-select-directory";
import inquirerFuzzyPath from "inquirer-fuzzy-path";
import untildify from "untildify";
import clear from "clear";
import chalk from "chalk";
import figlet from "figlet";

inquirer.registerPrompt("directory", inquirerSelectDir);
inquirer.registerPrompt("fuzzypath", inquirerFuzzyPath);
const lineHr =
  "===========================================================================";

function isExistPath(path) {
  return fs.existsSync(path);
}

function isExistFile(path, fileName) {
  const fullPath = `${path}/${fileName}`;
  return fs.existsSync(fullPath);
}

function askPathToDirectory() {
  const questions = [
    {
      name: "dirPath",
      type: "input",
      message: "Input directory path :",
    },
  ];

  return inquirer.prompt(questions);
}

const askDir = async () => {
  return await inquirer
    .prompt([
      {
        type: "rawlist",
        name: "choice",
        message: "Define directory by?",
        choices: [
          {
            value: "a",
            name: "manual (ex: /Users/xxx/DeployFile/) or (~/workspace/oneplanet/bathFiles/)",
          },
          {
            value: "b",
            name: "select from current directory",
          },
        ],
      },
    ])
    .then(async ({ choice }) => {
      if (choice === "a") {
        return await inquirer.prompt([
          {
            name: "dirPath",
            type: "input",
            message: "enter : ",
          },
        ]);
      }
      return await inquirer.prompt([
        {
          name: "dirPath",
          type: "directory",
          message: "please select from below ⇓",
          basePath: ".",
          excludePath: (nodePath) => nodePath.startsWith("node_modules"),
        },
      ]);
    });
};

const validateFileExtension = (fileName) => {
  const acceptExtension = ["txt"];
  try {
    const fileExtension = fileName.split(".")[1];
    return acceptExtension.includes(fileExtension);
  } catch (e) {
    console.error(e);
  }
};

const selectFilesToSplit = async (dirPath, files) => {
  const _files = files || [];
  await inquirer
    .prompt([
      {
        name: "file",
        type: "fuzzypath",
        message:
          "Select file for split(To exit, search for nothing then hit ENTER)",
        rootPath: dirPath,
        itemType: "file",
        excludePath: (nodePath) =>
          nodePath.startsWith("node_modules") || nodePath.startsWith("."),
      },
      {
        type: "confirm",
        name: "selectMoreFile",
        message: "Do you want to select more file?(just hit enter for more)",
        default: true,
      },
    ])
    .then(async ({ file, selectMoreFile }) => {
      if (validateFileExtension(file.split("/").at(-1))) {
        _files.push(file);
      } else {
        console.log(
          "[FAILED] Wrong extension, [.jsp, .class, .properties] only"
        );
      }
      if (selectMoreFile) {
        await selectFilesToSplit(dirPath, _files);
      }
      return;
    });

  return _files;
};

function askLineCountPerFile(defaultValue, fileName) {
  const questions = [
    {
      name: "lineCountPerFile",
      type: "input",
      default: defaultValue,
      message: `Input line count ${
        fileName ? "for " + chalk.cyanBright(fileName) : ""
      } : `,
    },
  ];

  return inquirer.prompt(questions);
}

function readFile(filePath) {
  const rawData = fs.readFileSync(filePath);
  const regex = /[^\r\n]+/g;
  let matches = rawData.toString().match(regex);

  return matches;
}

function writeFile(dirPath, fileName, texts, lineCountPerFile) {
  let chunkCount = 0;
  let startIdx = 0;
  let endIdx = lineCountPerFile;
  const postfix = "splitted";
  const newDir = `${dirPath}/${fileName}-${postfix}`;
  console.log(
    `📝 Writing to ${chalk.green(dirPath)}/${chalk.blue(
      fileName + "-" + postfix
    )}/`
  );
  if (!isExistPath(newDir)) {
    fs.mkdirSync(newDir);
  }
  const lastChunkIdx = Math.floor(texts.length / lineCountPerFile);
  while (chunkCount <= lastChunkIdx) {
    const insertionFileName = `${fileName}-[${startIdx},${endIdx}]-${chunkCount}.txt`;
    const filePath = `${newDir}/${insertionFileName}`;
    let insertions = texts.slice(startIdx, endIdx).join("\r\n");
    console.log(
      `${chunkCount === lastChunkIdx ? "└─" : "├─"} ${insertionFileName}`
    );
    fs.writeFileSync(filePath, insertions);
    chunkCount += 1;
    startIdx = lineCountPerFile * chunkCount;
    endIdx =
      startIdx + lineCountPerFile <= texts.length
        ? startIdx + lineCountPerFile
        : startIdx + (texts.length - startIdx);
  }
}

async function main() {
  // let correctPath = false;
  // let dirPath;
  let correctPath = true;
  let dirPath = `/Users/narkkarux.tri/Downloads/SAP_DATA`;

  while (!correctPath) {
    dirPath = untildify((await askDir()).dirPath);
    correctPath = isExistPath(dirPath);
    if (!correctPath) {
      console.log(`FAIL : [${dirPath}] is not exsit`);
    } else console.log(`[${dirPath}] is exist`);
  }

  const files = await selectFilesToSplit(dirPath);
  let _lineCountPerFile = 100;
  for (let filePath of files) {
    const rawData = readFile(filePath);
    const filePaths = filePath.split("/");
    const fileName = filePaths[filePaths.length - 1];
    const { lineCountPerFile } = await askLineCountPerFile(
      _lineCountPerFile,
      fileName
    );
    _lineCountPerFile = lineCountPerFile;
    writeFile(dirPath, fileName.split(".")[0], rawData, +lineCountPerFile);
  }
}

clear();
console.log(chalk.yellow(figlet.textSync("< Split File />", {})) + "by Zeus ");
console.log(chalk.red(lineHr));

main();
