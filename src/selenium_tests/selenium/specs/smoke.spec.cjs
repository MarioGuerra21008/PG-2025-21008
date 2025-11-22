const { BASE, buildLocal, buildLT, doLogin, By, until } = require('../helpers.cjs');
const useLT = !!process.env.LT_USERNAME;
const build = useLT ? buildLT : buildLocal;

describe('Selenium Smoke', function () {
  this.timeout(60000);
  let driver;

  before(async () => { driver = await build('Smoke'); });
  after(async () => { if (driver) await driver.quit(); });

  it('[C0294] carga home (login)', async () => {
    await driver.get(BASE + '/');
    await driver.sleep(2000);
  });

  it('[C0295] tiene botón Entrar (por tipo submit)', async () => {
    await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 15000);
  });

  it('[C0296] tiene logo', async () => {
    const logos = await driver.findElements(By.css('img'));
    if (logos.length === 0) throw new Error('No hay imágenes/logo');
  });

  it('[C0297] puede hacer login y carga /home', async () => {
    await doLogin(driver);
    const url = await driver.getCurrentUrl();
    if (!url.includes('/home')) throw new Error('No redirigió a /home');
  });

  it('[C0298] sidebar visible en /home', async () => {
    await driver.findElement(By.css('.ant-menu'));
  });
});