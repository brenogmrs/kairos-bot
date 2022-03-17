require('dotenv').config()
const puppeteer = require('puppeteer');

async function init() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(process.env.KAIROS_URL);

    await login(page);

    await page.waitForNavigation()
    await page.waitForSelector('.toogleUserNameWrapper')
    
    await page.hover('.toogleUserNameWrapper');

    await sleep(2000);

    await page.waitForSelector(`.pointer.DropDownHeaderElement:first-of-type`);

    await page.click('.pointer.DropDownHeaderElement:first-of-type');

    const randomId = page.url().split('/').pop();

    await page.goto(`https://www.dimepkairos.com.br/Dimep/PedidosJustificativas/Index/${randomId}`);

    await page.waitForSelector(`.floatLeft.DiaApontamento .LastSlot input`);

    const currentDatePptr = new Date().toLocaleDateString('pt-BR').replaceAll('/', '_');

    await page.evaluate((currentDatePptr) => {

        $(`.floatLeft.DiaApontamento.${currentDatePptr}`).addClass(`data-${currentDatePptr}`);

    }, currentDatePptr);

        
    await page.waitForSelector(
        `.data-${currentDatePptr} .LastSlot input`, 
        {
            timeout: 3000
        }
    );

    const timeInOutWork = adjustMinutes(Math.floor(Math.random() * 59));
    let timeInOutLunch = adjustMinutes(Math.floor(Math.random() * 59));
    
    await page.evaluate((timeInOutWork, currentDatePptr) => {

        $(`.data-${currentDatePptr} .TimeIN input`).val(`09:${timeInOutWork}`);

    }, timeInOutWork, currentDatePptr);

    await page.click(`.data-${currentDatePptr} .emptySlot`),
    await page.keyboard.type(`18:${timeInOutWork}`);
    await page.click(`.data-${currentDatePptr} .emptySlot`);

    if(timeInOutWork === timeInOutLunch) {
        timeInOutLunch = adjustMinutes(Math.floor(Math.random() * 59));
    }

    await page.keyboard.type(`13:${timeInOutLunch}`);
    await page.click(`.data-${currentDatePptr} .emptySlot`);
    await page.keyboard.type(`12:${timeInOutLunch}`); 
    
    await page.click('#ButtonSalvarApontamentos');
    await page.waitForSelector(
        `#JustificativaSelect`, 
        {
            timeout: 3000
        }
    );
    await page.select('#JustificativaSelect','Home Office - Contingência');
    await page.click('input[value="Aplicar a Todos"]','Home Office - Contingência');
    await page.click('#SaveHorarios');

    console.log(`horas para o dia ${new Date().toLocaleDateString('pt-BR')} lançadas em Home Office - Contingência com sucesso!`);

    console.log(`
        09:${timeInOutWork} \n
        12:${timeInOutLunch} \n
        13:${timeInOutLunch} \n
        18:${timeInOutWork}
    `)

    await browser.close();
}

function adjustMinutes(min) {
    return min < 10 ? `0${min}`: `${min}`
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