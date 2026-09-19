import nodemailer from 'nodemailer';

export async function sendClientCredentials(email: string, companyName: string, pass: string) {
  // If SMTP is not configured, we just log it and return true (so it doesn't break)
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[MAIL MOCK] To: ${email}, Pass: ${pass}`);
    return true;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"EFConte Assessoria Contábil" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Bem-vindo à EFConte! Seus dados de acesso`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #D4AF37; padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">Bem-vindo, ${companyName}!</h1>
        </div>
        <div style="padding: 30px; background-color: #fafafa;">
          <p>Seu acesso ao <strong>Portal do Cliente EFConte</strong> foi criado com sucesso.</p>
          <p>Acesse o portal e acompanhe sua contabilidade de perto de forma segura e transparente.</p>
          
          <div style="background: #fff; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <p style="margin: 0 0 10px 0;"><strong>Link de acesso:</strong> <a href="${process.env.NEXTAUTH_URL || 'https://efconte-app.vercel.app'}/login">Acessar Portal</a></p>
            <p style="margin: 0 0 10px 0;"><strong>E-mail (Login):</strong> ${email}</p>
            <p style="margin: 0;"><strong>Senha Temporária:</strong> <span style="background: #eee; padding: 3px 8px; border-radius: 4px; letter-spacing: 2px;">${pass}</span></p>
          </div>
          
          <p style="font-size: 13px; color: #777;">Recomendamos que você altere sua senha no primeiro acesso através das configurações do seu perfil.</p>
        </div>
        <div style="background-color: #222; color: #aaa; text-align: center; padding: 15px; font-size: 12px;">
          &copy; ${new Date().getFullYear()} EFConte Assessoria Contábil
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  return true;
}
