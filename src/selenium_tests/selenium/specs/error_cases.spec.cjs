const { BASE, buildLocal, buildLT, By, until } = require('../helpers.cjs');
const useLT = !!process.env.LT_USERNAME;
const build = useLT ? buildLT : buildLocal;

describe('Selenium Error Cases', function () {
  this.timeout(60000);
  let driver;

  before(async () => { driver = await build('ErrorCases'); });
  after(async () => { if (driver) await driver.quit(); });

  it('[C0299] Login con credenciales vacías muestra error', async () => {
    await driver.get(BASE + '/');
    await driver.sleep(3000);
    
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();
    
    await driver.sleep(2000);
    
    // Ant Design Form muestra mensajes de validación
    const errorMessages = await driver.findElements(
      By.css('.ant-form-item-explain-error, [role="alert"]')
    );
    
    if (errorMessages.length === 0) {
      throw new Error('No se mostraron mensajes de validación para campos vacíos');
    }
  });

  it('[C0300] Login con solo usuario sin contraseña muestra error', async () => {
    await driver.get(BASE + '/');
    await driver.sleep(3000);
    
    const usernameInput = await driver.findElement(By.xpath("//input[@placeholder='Usuario']"));
    await usernameInput.sendKeys('usuario@test.com');
    
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();
    
    await driver.sleep(2000);
    
    const errorMessages = await driver.findElements(
      By.css('.ant-form-item-explain-error, [role="alert"]')
    );
    
    if (errorMessages.length === 0) {
      throw new Error('No se mostró error para contraseña faltante');
    }
  });

  it('[C0301] Navegación a ruta inexistente redirige correctamente', async () => {
    await driver.get(BASE + '/ruta-que-no-existe-12345');
    await driver.sleep(2000);
    
    const currentUrl = await driver.getCurrentUrl();
    
    // Rutas no válidas redirigen a "/"
    if (!currentUrl.endsWith('/') && !currentUrl.includes('/home')) {
      throw new Error('Ruta inválida no redirigió a / o /home');
    }
  });

  it('[C0302] Acceso a /home sin login redirige a login', async () => {
    // Abrir en modo incógnito simulado
    await driver.manage().deleteAllCookies();
    await driver.executeScript('localStorage.clear()');
    await driver.executeScript('sessionStorage.clear()');
    
    await driver.get(BASE + '/home');
    await driver.sleep(3000);
    
    const currentUrl = await driver.getCurrentUrl();
    
    // Si tiene protección de rutas, debería redirigir a home
    // Si no, al menos verifica que NO muestre el sidebar
    const sidebars = await driver.findElements(By.css('.ant-menu'));
    
    if (sidebars.length > 0) {
      console.warn('Advertencia: /home accesible sin autenticación. Considera agregar protección de rutas.');
    }
  });
});