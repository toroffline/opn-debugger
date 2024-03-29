import puppeteer from "puppeteer";
import inquirer from "inquirer";
import fs from "fs";

let browser;
let page;
let envUrl;

const ENV = {
  uat: {
    url: "uat-portal.oneplanets.com",
  },
  beta: {
    url: "beta-portal.oneplanets.com",
  },
  local: {
    url: "localhost:3000",
  },
};

const cache = {
  path: "/Users/narkkarux.tri/Nui debug/opn/opn-debugger/src/js/automation/cache",
  fileName: {
    savedUsers: "users.txt",
    latestUserLoggedIn: "latestUser.txt",
  },
};

async function click(selector) {
  await page.waitForSelector(selector);
  await page.click(selector);
}

async function input(value, selector) {
  // console.log(`inputing: ${value}`);
  await page.waitForSelector(selector);
  await page.type(selector, value);
}

async function openOpnWeb(envUrl) {
  browser = await puppeteer.launch({
    // userDataDir: '/Users/narkkarux.tri/Library/Application Support/Google/Chrome/Default',
    args: ["--start-fullscreen"],
    headless: false,
    defaultViewport: false,
  });
  const pages = await browser.pages();
  page = pages[0];
  await page.goto(`http://${envUrl}/signin`);
}

function goToSignInPage() {
  const navBar =
    "#onePlanetContainerIndex > div.header-wrap > div > ul > li.sign-in > div > a";
  const dd =
    "#onePlanetContainerIndex > div.header-wrap > div > ul > li.sign-in > div > div > ul > li:nth-child(1) > a";
  click(navBar);
  click(dd);
}

async function signIn({ companyShortName, username, password }) {
  const FIELD = {
    companyShortName:
      "#bodyContainer > div.ac-body > div.access-form > div:nth-child(1) > input",
    username:
      "#bodyContainer > div.ac-body > div.access-form > div:nth-child(2) > input",
    password:
      "#bodyContainer > div.ac-body > div.access-form > div:nth-child(3) > input",
    btn: "#bodyContainer > div.ac-body > div.access-form > button",
  };
  await input(companyShortName, FIELD.companyShortName);
  await input(username, FIELD.username);
  await input(password, FIELD.password);
  click(FIELD.btn);
}

function getWhiteSpace(num) {
  let str = "";
  for (let i = 0; i < num; i++) {
    str += " ";
  }

  return str;
}

function getPadding(padding, str) {
  const remainPadding = padding - str.length;
  const paddingDiv = Math.trunc(remainPadding / 2);
  let front = getWhiteSpace(paddingDiv);
  const back = getWhiteSpace(padding - (front.length + str.length));

  return front + str + back;
}

function formatTable({ companyShortName, username, password }) {
  return `${companyShortName}\t|${getPadding(40, username)}|\t${password}`;
}

async function askEnv() {
  const choice = {
    type: "rawlist",
    name: "choice",
    message: "Enter user to sign in: ",
    choices: Object.keys(ENV).map((env) => ({
      name: env,
      value: env,
    })),
  };

  return await inquirer.prompt(choice).then(async ({ choice }) => choice);
}

function findLatestUserLoggedIn() {
  const path = cache.path;
  const fileName = cache.fileName.latestUserLoggedIn;
  const fullPath = `${path}/${fileName}`;

  if (fs.existsSync(fullPath)) {
    return JSON.parse(fs.readFileSync(fullPath));
  }

  return null;
}

async function askSignInAs() {
  const path = cache.path;
  const fileName = cache.fileName.savedUsers;
  const fullPath = `${path}/${fileName}`;
  let savedUsers = [];

  const CHOICE = { ADD_NEW: "addNew", DELETE: "delete" };
  let choices = [];

  // find latest logged in
  const latestUserLoggedIn = findLatestUserLoggedIn();

  if (fs.existsSync(fullPath)) {
    savedUsers = JSON.parse(fs.readFileSync(fullPath));
    if (savedUsers && savedUsers.length > 0) {
      console.table(savedUsers);
      savedUsers.forEach((user, _idx) => {
        if (
          latestUserLoggedIn &&
          latestUserLoggedIn.companyShortName === user.companyShortName &&
          latestUserLoggedIn.username === user.username &&
          latestUserLoggedIn.password === user.password
        ) {
          choices = [{ value: user, name: formatTable(user) }, ...choices];
        } else {
          choices.push({
            value: user,
            name: formatTable(user),
          });
        }
      });
      choices.push({
        value: CHOICE.DELETE,
        name: "Delete ",
      });
    }
  } else {
    console.log("info: No saved user.");
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  }

  choices.push({
    value: CHOICE.ADD_NEW,
    name: "Add new ",
  });

  const choice = {
    type: "rawlist",
    name: "choice",
    message: "Enter user to sign in: ",
    choices: choices,
  };
  return await inquirer.prompt(choice).then(async ({ choice }) => {
    if (choice === CHOICE.ADD_NEW) {
      return await inquirer
        .prompt([
          {
            name: "companyShortName",
            type: "input",
            message: "company short name: ",
          },
          {
            name: "username",
            type: "input",
            message: "username : ",
          },
          {
            name: "password",
            type: "input",
            message: "password : ",
          },
        ])
        .then((value) => {
          savedUsers.push(value);
          fs.writeFileSync(fullPath, JSON.stringify(savedUsers));
        });
    } else if (choice === CHOICE.DELETE) {
      return await inquirer
        .prompt([
          {
            type: "checkbox",
            name: "deletedUsers",
            message: "Select users to delete: ",
            choices: savedUsers.map((user, idx) => ({
              name: formatTable(user),
              value: idx,
            })),
          },
        ])
        .then(({ deletedUsers }) => {
          for (let _user of deletedUsers) {
            savedUsers.splice(deletedUsers, 1);
          }
          fs.writeFileSync(fullPath, JSON.stringify(savedUsers));
        });
    } else {
      return choice;
    }
  });
}

async function saveLatestUserLoggedIn(signInInfo, env) {
  const path = cache.path;
  const fileName = cache.fileName.latestUserLoggedIn;
  const fullPath = `${path}/${fileName}`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  fs.writeFileSync(fullPath, JSON.stringify({ ...signInInfo, env }));
}

async function run() {
  let manageUser = true;
  while (manageUser) {
    const env = await askEnv();
    const signInInfo = await askSignInAs();
    saveLatestUserLoggedIn(signInInfo, env);
    if (signInInfo) {
      manageUser = false;
      const envUrl = ENV[env].url;
      await openOpnWeb(envUrl);
      signIn(signInInfo);
    }
  }
}

run();
