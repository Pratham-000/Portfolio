const nodemailer = require('nodemailer')

exports.sendEmail = async ({name , email , message}) => 
{
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth: {
            user : process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });


    const mailOptions = {
        from : email, 
        to : process.env.RECEIVER_EMAIL,
        subject: `New Contact Form Submission from ${name}`,
        html : `
      <h3>New Message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `

    };
    await transporter.sendMail(mailOptions)
}
