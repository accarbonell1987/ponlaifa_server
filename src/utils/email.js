const nodemailer = require('nodemailer');

const { consoleInfo, consoleError } = require('../utils/console');

const { EMAIL_TEMPLATE } = require('../templates/send_email');

const {
  CONFIRMUSER_CAPTION,
  CHANGEPASSWORDUSER_CAPTION,
  EMAIL_TITLE_ACCOUNTCHANGEPASSWORD,
  EMAIL_TITLE_ACCOUNTCREATION
} = require('../common/constants');

const sleep = async (ms) => await new Promise((resolve) => setTimeout(resolve, ms));

//send mail
exports.sendMail = async (to, subject, html) => {
  try {
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;

    const from = process.env.EMAIL_FROM;
    const port = EMAIL_PORT == undefined ? 465 : parseInt(EMAIL_PORT.toString());

    const transporter = nodemailer.createTransport({
      pool: true,
      host: EMAIL_HOST || '',
      port: port,
      secure: true,
      auth: {
        user: EMAIL_USER || '',
        pass: EMAIL_PASSWORD || ''
      }
    });

    //enviando el correo
    await transporter.sendMail({ from, to, subject, html });
    consoleInfo(`email sended: ${to}`);

    return true;
  } catch (error) {
    consoleError(`sendMail => ${error.message}`);
    throw Error(msgerror);
  }
};

exports.sendEmailValidateUser = async (fullName, toEmail, token) => {
  //! Para el envio de correo se hace el intento 10 veces, con un lapso de (5) segundos
  let sendEmailTry = 0;
  let sended = false;
  do {
    try {
      const url = `http://${process.env.FRONTEND_URL}/confirm-user/${token}`;

      //remplazar las cadenas a enviar en el correo
      const html = EMAIL_TEMPLATE.replace('{0}', `${fullName}, ${CONFIRMUSER_CAPTION}`)
        .replace('{1}', `Para validar su cuenta por favor haga click en el siguiente Hypervínculo:</p>`)
        .replace(
          '{2}',
          `<form action="${url}"><div style="text-align:center"><input type="submit" value="Validar" class="" style="border: 2px solid black; background-color: white; color: black; padding: 14px 28px; font-size: 16px; cursor: pointer; border-radius: 5px;"></div></form>`
        );
      // http://${process.env.FRONTEND_URL}/confirm-user/${token}
      //envio de correo
      sended = await this.sendMail(toEmail, EMAIL_TITLE_ACCOUNTCREATION, html);
    } catch (error) {
      sendEmailTry++;
      //esperar 5 seg
      await sleep(5000);
    }
  } while (sendEmailTry <= 10 && !sended);
  if (!sended) consoleInfo(`No se pudo enviar el correo electronico a la dirección ${toEmail}`);
};

exports.sendEmailChangePasswordRequest = async (fullName, toEmail, token) => {
  //! Para el envio de correo se hace el intento 10 veces, con un lapso de (5) segundos
  let sendEmailTry = 0;
  let sended = false;
  do {
    try {
      //remplazar las cadenas a enviar en el correo
      const html = EMAIL_TEMPLATE.replace('{0}', `${fullName}, ${CHANGEPASSWORDUSER_CAPTION}`)
        .replace(
          '{1}',
          `Para cambiar su contraseña por favor haga click en el siguiente Hypervínculo y a continuación escriba las nuevas credenciales:`
        )
        .replace(
          '{2}',
          `<form action="http://${process.env.FRONTEND_URL}/confirm-user/${token}"><div style="text-align:center"><input type="submit" value="Validar" class="" style="border: 2px solid black; background-color: white; color: black; padding: 14px 28px; font-size: 16px; cursor: pointer; border-radius: 5px;"></div></form>`
        );
      //envio de correo
      sended = await sendMail(toEmail, EMAIL_TITLE_ACCOUNTCHANGEPASSWORD, html);

      // eslint-disable-next-line no-console
      consoleInfo(`http://${process.env.FRONTEND_URL}/confirm-user/${token}`);
    } catch (error) {
      sendEmailTry++;
      //esperar 5 seg
      await sleep(5000);
    }
  } while (sendEmailTry <= 10 && !sended);
  if (!sended) consoleInfo(`No se pudo enviar el correo electronico a la dirección ${toEmail}`);
};
