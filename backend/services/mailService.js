const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',

    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
})

exports.sendContactMail = async ({
    firstname,
    lastname,
    email,
    message
}) => {

    await transporter.sendMail({
        from: process.env.MAIL_USER,

        to: process.env.MAIL_USER,

        replyTo: email,

        subject:`Nouveau message WildPeak - ${firstname} ${lastname}`,

        text: `
        Nom : ${lastname}
        Prénom : ${firstname}
        E-mail : ${email}

        Message :
        ${message}
        `
    })
}