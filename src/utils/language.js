const language = process.env.BACKEND_LANGUAGE;
const string = require('../common/strings');

exports.getMessage = (prefix, data) => {
  return string[`${language.toUpperCase()}_${prefix}`](data);
};
