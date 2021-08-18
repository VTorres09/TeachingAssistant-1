import * as nodemailer from "nodemailer";
import config from '../configs/configs';

class Mail {

    constructor(
        public to?: string,
        public subject?: string,
        public message?: string) { }


    sendMail() {

        let mailOptions = {
            from: "vtm@cin.ufpe.br",
            to: this.to,
            subject: this.subject,
            html: this.message
        };

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: config.host,
            port: config.port,
            secure: false,
            auth: {
                user: config.user,
                pass: config.password
            },
        });


        console.log(mailOptions);

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
                return error;
            } else {
                console.log("E-mail enviado com sucesso!")
                return "E-mail enviado com sucesso!";
            }
        });
    }


}

export default new Mail;