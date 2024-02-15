import { IMailer } from "../interfaces/IMailer";
import nodemailer from 'nodemailer'
const SMPT = process.env.SMTP_KEY;
export class Mailer implements IMailer{
    async SendEmail(to: string,data:any) {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: "zensync.bitdrag@gmail.com",
            pass: SMPT,
          },
        });
        let res = await transporter.sendMail({
          from: "ZenSync<zensync.bitdrag@gmail.com>",
          to: `${to}`,
          subject: "OTP for verification",
          html: data,
        });
            console.log(res)

        
        return true
    }
}