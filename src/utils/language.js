const language = process.env.LANGUAGE;
const string = require('../common/strings');

exports.getMessage = (prefix, data) => {
  return string[`${language.toUpperCase()}_${prefix}`](data);
};
