require('dotenv').config();

const Mocha = require('mocha');
const path = require('path');

if (!process.env.LT_USERNAME || !process.env.LT_ACCESS_KEY) {
  console.error('Faltan LT_USERNAME / LT_ACCESS_KEY');
  console.log('LT_USERNAME:', process.env.LT_USERNAME);
  console.log('LT_ACCESS_KEY:', process.env.LT_ACCESS_KEY ? '***' : 'undefined');
  process.exit(1);
}

const mocha = new Mocha({ timeout: 60000 });
[
  'smoke.spec.cjs',
  'error_cases.spec.cjs',
  'navigation.spec.cjs',
  'pages.spec.cjs',
  'extras.spec.cjs',
].forEach(f => mocha.addFile(path.join(__dirname, 'specs', f)));

mocha.run(failures => process.exitCode = failures ? 1 : 0);