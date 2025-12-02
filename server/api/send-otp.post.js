import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    try {
        const body = await readBody(event);
        const { email, otp } = body;

        if (!email || !otp) {
            return { success: false, message: "Missing email or OTP" };
        }

        const transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: Number(config.smtpPort),
            secure: true,
            auth: {
                user: config.smtpEmail,
                pass: config.smtpPass
            }
        });

        await transporter.sendMail({
            from: `"BAP Federation" <${config.smtpEmail}>`,
            to: email,
            subject: "Your Admin Login Code",
            text: `Your OTP code is: ${otp}`,
            html: `<h2>Your OTP: <b>${otp}</b></h2>`
        });

        return { success: true };

    } catch (err) {
        console.error("OTP SEND ERROR:", err);
        return { success: false, message: "Server error" };
    }
});
