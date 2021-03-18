const { Sequelize } = require('sequelize');

const { consoleError, consoleInfo } = require('../utils/console');

const connection = process.env.DB_CONNECTION || 'postgres';
const database = process.env.DB_DATABASE || 'ponlaifawatube';
const host = process.env.DB_HOST || 'localhost';
const user = process.env.DB_USERNAME || 'postgres';
const password = process.env.DB_PASSWORD || 'root';
const port = process.env.DB_PORT || 5432;

const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: connection,
  logging: false,
  pool: { idle: 30000, min: 20, max: 30 },
  dialectOptions: {
    // useUTC: false, // for reading from database
    dateStrings: true,
    typeCast: function (field, next) {
      // for reading from database
      if (field.type === 'DATETIME') {
        return field.string();
      }
      return next();
    }
  },
  timezone: '-04:00' // for writing to database
});

exports.context = sequelize;

exports.sequelizeAutentication = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    consoleInfo('Connection has been established successfully.');

    return true;
  } catch (error) {
    consoleError('Unable to connect to the database: ' + error);
    return false;
  }
};

exports.syncCompleteModel = async () => {
  try {
    await sequelize.sync();
    consoleInfo('All models were synchronized successfully.');
  } catch (error) {
    consoleError('All models can not be synchronized: ' + error);
  }
};
