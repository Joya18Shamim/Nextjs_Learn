import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    // configure mail for usage
    if (emailType === "VERIFY") {
      const updateUser = await User.findByIdAndUpdate(userId, {
        $set:{
        verifyToken: hashedToken,
        verifyTokenExpiry: (Date.now() + 3600000),
        }
        
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {

       $set:{ forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: (Date.now() + 3600000)},
      });
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "d535880ce81ca2",
        pass: "395f37fa9cc532",
      },
    });

    const mailOption = {
      from: "joya@shamim.ai", // sender address
      to: email, // list of receivers
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
      html: `<p>Click <a href="${process.env.DOMAIN}/
            verifyemail?token= ${hashedToken}">here</a>
            to 
            ${emailType==='VERIFY' ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser.
            <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
        </p>`, // html body
    };

    const mailResponse = await transport.sendMail(mailOption);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
