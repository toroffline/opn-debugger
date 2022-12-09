import puppeteer from "puppeteer";
import inquirer from "inquirer";
import fs from "fs";

let browser;
let page;

const username = "narkkarux.tri";
const password = "CTAwifi21";

const repo = {
  opApi: `http://192.168.19.11:8080/view/Oneplanet/job/ptvn-op-api/job/master/`,
  webPortal: `http://192.168.19.11:8080/view/Oneplanet/job/ptvn-oneplanet-web-portal/job/master/`,
};

async function click(selector) {
  console.log(`clicking: ${selector}`);
  await page.waitForSelector(selector);
  await page.click(selector);
}

async function input(value, selector) {
  await page.waitForSelector(selector);
  await page.type(selector, value);
}

async function openJenkinsWeb() {
  browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const pages = await browser.pages();
  page = pages[0];
  await page.goto(repo.opApi);
  click(`#page-header > div.login.page-header__hyperlinks > a`);
  await input(username, `#j_username`);
  await input(password, `body > div > div > form > div:nth-child(2) > input`);
  click(`body > div > div > form > div.submit > button`);
}

async function notiWhenReadyToDeploy() {
  const deployBlock = `#pipeline-box > div > div > table > tbody.tobsTable-body > tr.job.PAUSED_PENDING_INPUT > td.stage-cell.stage-cell-7.PAUSED_PENDING_INPUT > div > div > div.progress`;
  await page.waitForSelector(deployBlock, { timeout: 0 });

  const nextStep = ``;
  click(nextStep);
}

async function main() {
  await openJenkinsWeb();
  notiWhenReadyToDeploy();
}

main();
