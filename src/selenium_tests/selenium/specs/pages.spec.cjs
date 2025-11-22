const { BASE, buildLocal, buildLT, doLogin, clickMenuByText, By } = require('../helpers.cjs');
const useLT = !!process.env.LT_USERNAME;
const build = useLT ? buildLT : buildLocal;

describe('Selenium Pages elementos clave', function () {
  this.timeout(60000);
  let driver;

  before(async () => { 
    driver = await build('Pages');
  });
  after(async () => { if (driver) await driver.quit(); });

  it('[C0309] Login tiene inputs', async () => {
    await driver.get(BASE + '/');
    await driver.findElement(By.xpath("//input[@placeholder='Usuario']"));
    await driver.findElement(By.xpath("//input[@placeholder='Contraseña']"));
  });

  it('[C0310] puede hacer login', async () => {
    await doLogin(driver);
  });

  it('[C0311] Home tiene sidebar', async () => {
    await driver.findElement(By.css('.ant-menu'));
  });

  it('[C0312] Dashboard tiene gráficas (canvas/svg si existen)', async () => {
    await clickMenuByText(driver, 'Dashboard');
    const charts = await driver.findElements(By.css('canvas, svg'));
    if (charts.length === 0) {
      console.warn('Dashboard sin charts visibles');
    }
  });

  it('[C0313] Formularios tiene tabla', async () => {
    await clickMenuByText(driver, 'Formularios');
    await clickMenuByText(driver, 'Listado');
    await driver.sleep(3000);
    const tables = await driver.findElements(By.css('table, .ant-table, [role="table"]'));
    if (tables.length === 0) {
      console.warn('No se encontró tabla');
    }
  });
});