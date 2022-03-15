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

    await page.waitForSelector(`.floatLeft.DiaApontamento .LastSlot input`, {timeout: 3000});


    const currentDatePptr = new Date().toLocaleDateString('pt-BR').replaceAll('/', '_');

    await page.evaluate(_ => {
       
        const currentDate = new Date().toLocaleDateString('pt-BR').replaceAll('/', '_');

        $(`.floatLeft.DiaApontamento.${currentDate}`).addClass(`data-${currentDate}`);

    });

        
    await page.waitForSelector(
        `.data-${currentDatePptr} .LastSlot input`, 
        {
            timeout: 3000
        }
    );

    await page.$eval(`.data-${currentDatePptr} .TimeIN input`, el => el.value = '09:00');
    await page.click(`.data-${currentDatePptr} .emptySlot`),

    await page.keyboard.type('18:00');
    await page.click(`.data-${currentDatePptr} .emptySlot`);
    await page.keyboard.type('13:00');
    await page.click(`.data-${currentDatePptr} .emptySlot`);
    await page.keyboard.type('12:00'); 
    
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

    console.log(`horas para o dia ${new Date().toLocaleDateString('pt-BR')} lançadas com sucesso!`);
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