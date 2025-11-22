const Mocha = require('mocha');
const path = require('path');
const fs = require('fs');

// Establecer flag antes de cargar cualquier cosa
process.env.FORCE_LOCAL = 'true';

// Forzar modo local ignorando variables de LT
delete process.env.LT_USERNAME;
delete process.env.LT_ACCESS_KEY;

const projectRoot = path.resolve(__dirname, '..', '..');
const reportsDir  = path.join(projectRoot, 'reports');
fs.mkdirSync(reportsDir, { recursive: true });
const junitFile = path.join(reportsDir, 'junit-selenium.xml');

const mocha = new Mocha({
  timeout: 60000,
  reporter: 'mocha-junit-reporter',
  reporterOptions: {
    mochaFile: junitFile,
    testsuitesTitle: 'Selenium',
    useFullSuiteTitle: true
  }
});

[
  'smoke.spec.cjs',
  'error_cases.spec.cjs',
  'navigation.spec.cjs',
  'pages.spec.cjs',
  'extras.spec.cjs',
].forEach(f => mocha.addFile(path.join(__dirname, 'specs', f)));

mocha.run(failures => { process.exitCode = failures ? 1 : 0; });
