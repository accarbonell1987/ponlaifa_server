const { Now } = require('./date');

const consoleLog = () => {
  console.log(`${Now()} : Log => ${msg}`);
};
const consoleError = (msg) => {
  console.error(`${Now()} : Error => ${msg}`);
};
const consoleInfo = (msg) => {
  console.info(`${Now()} : Info => ${msg}`);
};

module.exports = {
  consoleLog: consoleLog,
  consoleError: consoleError,
  consoleInfo: consoleInfo
};
