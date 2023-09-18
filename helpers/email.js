import "dotenv/config";
import nodemailer from "nodemailer";

const registerEmail = (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: data.email,
    subject: "UpTask - Confirma tu cuenta",
    text: "Confirma tu cuenta en UpTask",
    html: `
    <h1>Hola ${data.name}, por favor confirma tu cuenta en UpTask</h1>
    <h2>Gracias por registrarte en nuestro sitio</h2>
    <p>Tu cuenta esta casi lista, para finalizar la confirmacion de la misma, por favor haz click en el siguiente enlace:
      <a href="${process.env.CORS_WHITELIST}/confirmation/${data.token}">Confirmar mi cuenta</a>
    </p>
    <p>Si no puedes acceder al enlace, por favor copia y pega la siguiente direccion en tu navegador:</p>
    <p>${process.env.CORS_WHITELIST}/confirmation/${data.token}</p>
    <p>Si no has sido tu quien ha creado esta cuenta, por favor ignora este correo.</p>
    `,
  };

  // send email
  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

const forgotPasswordEmail = (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: data.email,
    subject: "UpTask - Restablece tu contraseña",
    text: "Restablece tu contraseña en UpTask",
    html: `
    <h1>Hola ${data.name}, has solicitado restablecer tu contraseña en UpTask</h1>
    <p>Sigue el siguiente enlace para generar una nueva contraseña:</p>
    <a href="${process.env.CORS_WHITELIST}/forgot-password/${data.token}">Restablecer contraseña</a>
    <p>Si no has sido tu quien ha solicitado restablecer tu contraseña, por favor comunica tu caso escribiendo al equipo de soporte a la casilla de email siguiente
      <a href="mailto:cuentas@uptask.com">Equipo de soporte</a>
    </p>
    `,
  };

  // send email
  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

export { registerEmail, forgotPasswordEmail };
