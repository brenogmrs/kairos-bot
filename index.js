require('dotenv').config()
const puppeteer = require('puppeteer');

async function init() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(process.env.KAIROS_URL);

    await login(page);

    await page.waitForNavigation()
    await page.waitForSelector('.toogleUserNameWrapper')
    
    await page.hover('.toogleUserNameWrapper');

    await sleep(300);

    await page.click('.pointer.DropDownHeaderElement:first-of-type');

    const randomId = page.url().split('/').pop();

    await page.goto(`https://www.dimepkairos.com.br/Dimep/PedidosJustificativas/Index/${randomId}`);
   
    await page.waitForNavigation();

    //await browser.close();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function login(page) {
    await page.type('#LogOnModel_UserName', process.env.USER_EMAIL);
    await page.type('#LogOnModel_Password', process.env.USER_PASSWORD);
    await page.click('#btnFormLogin')
}

init();