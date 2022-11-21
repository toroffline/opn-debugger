import puppeteer from "puppeteer";
import inquirer from "inquirer";
import fs from "fs";

let browser;
let page;

async function click(selector) {
  await page.waitForSelector(selector, { visible: true });
  await page.click(selector);
}

async function input(value, selector) {
  // console.log(`inputing: ${value}`);
  await page.waitForSelector(selector, { visible: true });
  await page.type(selector, value);
}

async function openOpnWeb() {
  browser = await puppeteer.launch({
    // userDataDir: '/Users/narkkarux.tri/Library/Application Support/Google/Chrome/Default',
    defaultViewport: false,
    headless: false,
  });
  const pages = await browser.pages();
  page = pages[0];
  await page.goto("http://uat-portal.oneplanets.com");
}

function goToSignInPage() {
  const navBar =
    "#onePlanetContainerIndex > div.header-wrap > div > ul > li.sign-in > div > a";
  const dd =
    "#onePlanetContainerIndex > div.header-wrap > div > ul > li.sign-in > div > div > ul > li:nth-child(1) > a";
  click(navBar);
  click(dd);
}

async function signIn() {
  goToSignInPage();
  const FIELD = {
    companyShortName:
      "#bodyContainer > div.ac-body > div.access-form > div:nth-child(1) > input",
    username:
      "#bodyContainer > div.ac-body > div.access-form > div:nth-child(2) > input",
    password:
      "#bodyContainer > div.ac-body > div.access-form > div:nth-child(3) > input",
    btn: "#bodyContainer > div.ac-body > div.access-form > button",
  };
  await input("eiei", FIELD.companyShortName);
  await input("rp.req@mailinator.com", FIELD.username);
  await input("Password1", FIELD.password);
  click(FIELD.btn);
}

async function askSignInAs() {
  const savedUsersFilePath =
    "/Users/narkkarux.tri/Nui debug/opn/opn-debugger/src/js/automation/cache";
  const savedUsersFileName = "users.txt";
  const fullPath = `${savedUsersFilePath}/${savedUsersFileName}`;
  let savedUsers = [];

  const CHOICE = { ADD_NEW: 0 };
  const choices = [
    {
      value: CHOICE.ADD_NEW,
      name: "Add new ",
    },
  ];

  if (fs.existsSync(fullPath)) {
    savedUsers = JSON.parse(fs.readFileSync(fullPath));
    console.table(savedUsers);
    savedUsers.forEach((user) => {
      choices.unshift({
        value: user.username,
        name: `${user.companyShortName}-${user.username}-${user.password}`,
      });
    });
  } else {
    console.log("info: No saved user.");
    if (!fs.existsSync(savedUsersFilePath)) {
      fs.mkdirSync(savedUsersFilePath);
    }
  }

  const choice = {
    type: "rawlist",
    name: "choice",
    message: "Enter user to sign in: ",
    choices: choices,
  };
  await inquirer.prompt(choice).then(async ({ choice }) => {
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
          console.log("info: saved");
          fs.writeFileSync(fullPath, JSON.stringify(savedUsers));
        });
    }
  });
}

async function run() {
  // await askSignInAs();
  await openOpnWeb();
  // console.log('signIn..');
  // signIn();
  await page.evaluate(() => {
    function getPathTo(element) {
      if (element.id !== "") return `#${element.id}`;
      if (element === document.body) {
        return element.tagName;
      }

      var siblings = element.parentNode.childNodes;
      for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element) {
          let selectorPath =
            getPathTo(element.parentNode) +
            " > " +
            element.tagName.toLowerCase();
          if (element.className) {
            const nextSibling = siblings[i + 1];
            const prevSibling = siblings[i - 1];
            if (
              (prevSibling &&
                prevSibling.className &&
                prevSibling.className == element.className) ||
              (nextSibling &&
                nextSibling.className &&
                element.className == nextSibling.className)
            ) {
              selectorPath += `:nth-child(${i + 1})`;
            } else {
              selectorPath +=
                "." +
                element.className.replaceAll("open", "").replaceAll(" ", ".");
            }
          }

          return selectorPath;
        }
      }
    }

    function debounce(func, delay = 800) {
      let timerId;
      return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    }

    const actions = [];

    document.addEventListener("click", ({ target }) => {
      const action = getPathTo(target);
      actions.push({ type: "click", element: action });
      console.log(actions);
    });

    function userInput(event) {
      const { target } = event;
      const action = getPathTo(target);
      actions.push({ type: "input", element: action, value: target.value });
      console.log(actions);
    }

    document.addEventListener("input", debounce(userInput));
  });
}

run();
