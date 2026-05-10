import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // Validasi sederhana
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
    }

    // Konfigurasi Transporter SMTP (Dinamis: Hostinger atau Mailpit)
    const transportConfig: any = {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465',
    };

    // Hanya tambahkan auth jika username & password diisi (Penting untuk Mailpit/Testing)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      transportConfig.auth = {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      };
    }

    const transporter = nodemailer.createTransport(transportConfig);

    // Konten Email untuk Anda (Admin)
    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER || 'noreply@portfolio.test'}>`, // Harus pakai email pengirim yang valid di SMTP
      to: process.env.ADMIN_RECEIVER_EMAIL, // Email tujuan (email pribadi Anda)
      replyTo: email, // Agar saat Anda klik reply, langsung ke email pengirim form
      subject: `New Contact Form: ${subject || 'No Subject'}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #ff6600;">New Inquiry from Portfolio</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  } catch (error: any) {
    console.error('Email Error:', error);
    return NextResponse.json({ error: 'Failed to send message', details: error.message }, { status: 500 });
  }
}
