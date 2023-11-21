"use server"

import nodemailer from 'nodemailer';


export async function sendEmail(to: string, subject: string, html: string) {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to, // list of receivers
            subject, // Subject line
            html, // HTML body content
        });
    } catch (error) {
        console.log(error);
    }
}
