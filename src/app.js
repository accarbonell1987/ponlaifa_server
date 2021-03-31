const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();

var dotenv = require('dotenv');
//cargando las variables de entorno
dotenv.config();

const { consoleInfo, consoleError } = require('./utils/console');
const sequelize = require('./models/sequelize');

const { loader } = require('./utils/init');

//configurando express
app.set('port', process.env.SERVER_PORT || 4000);
app.set('json spaces', 2);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(fileUpload());

const router = require('./routes/router');
app.use('/api', router);

const startServer = async () => {
  const response = await sequelize.sequelizeAutentication();
  if (response) {
    await loader();
  }
};

app.listen(app.get('port'), () => {
  try {
    const server = process.env.SERVER_ADDRESS || 'localhost';
    consoleInfo(`Server Started at: http://${server}:${app.get('port')} ☕`);
    startServer();
  } catch (error) {
    consoleError(error);
  }
});
