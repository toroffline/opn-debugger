import puppeteer from "puppeteer";
import inquirer from "inquirer";
import fs from "fs";
import chalk from "chalk";

let browser;
let page;
const savedActionPath =
  "/Users/narkkarux.tri/Nui debug/opn/opn-debugger/src/js/automation/actions";

async function click(selector) {
  console.log(`[] ${chalk.blue("clicking")}: ${selector}`);
  await page.waitForSelector(selector);
  await page.click(selector);
}

async function input(value, selector) {
  console.log(
    `[] ${chalk.green("inputting")}: ${chalk.cyan(value)} → ${selector}`
  );
  await page.waitForSelector(selector);
  await page.type(selector, value);
}

async function openOpnWeb() {
  browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const pages = await browser.pages();
  page = pages[0];
  await page.goto("http://uat-portal.oneplanets.com");
}

async function askFileToRun() {
  const choices = [];
  if (fs.existsSync(savedActionPath)) {
    const files = fs.readdirSync(savedActionPath);
    files.forEach((file) => {
      choices.unshift({
        value: file,
        name: file,
      });
    });
  } else {
    console.log("info: no action yet");
  }

  const choice = {
    type: "rawlist",
    name: "choice",
    message: "Choose file to run: ",
    choices: choices,
  };

  const result = await inquirer.prompt(choice).then(async ({ choice }) => {
    return choice;
  });

  return result;
}

async function runAction(fileName) {
  const actions = JSON.parse(fs.readFileSync(`${savedActionPath}/${fileName}`));

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    if (action.type == "click") {
      const nextAction = actions[i + 1];
      if (
        nextAction &&
        nextAction.type == "input" &&
        nextAction.element == action.element
      ) {
        continue;
      }
      await click(action.element);
    } else if (action.type == "input") {
      await input(action.value, action.element);
    }
  }
}

async function main() {
  const fileName = await askFileToRun();
  await openOpnWeb();
  await runAction(fileName);
}

main();
