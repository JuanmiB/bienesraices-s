import nodemailer from 'nodemailer'
export const sendRecoveryEmail = async (email, recoveryToken) => {
  // Crear un transporte usando SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // El servidor SMTP de tu proveedor de correo electrónico
    port: process.env.EMAIL_PORT, // El puerto SMTP, generalmente 587 o 465 para SMTP seguro
    auth: {
      user: process.env.EMAIL_USER, // Tu correo electrónico
      pass: process.env.EMAIL_PASS // Tu contraseña
    }
  })

  // Envia mail de confirmacion
  await transporter.sendMail({
    from: 'BienesRaices.com',
    to: email,
    subject: 'Recupera tu cuenta en BienesRaices.com',
    text: 'Recupera tu cuenta en BienesRaices.com',
    html: `
      <div class="container">
      <h1>Hola, ${email}</h1>
      <p>Parece ser que haz olvidado tu contraseńa y haz solicitado recuperarla</p>
      <p>Haz clic en el siguiente enlace para generar una nueva</p>
      <a href="${process.env.FRONTEND_URL}auth/reset-password/${recoveryToken}" class="btn">Confirmar Email</a>
      <p>Si no haz sido, puedes ignorar el este mensaje</p>
      <p>Saludos,<br>El equipo de Digimon Master Online</p>
  </div>
      `
  })
}
