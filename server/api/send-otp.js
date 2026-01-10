import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { useRuntimeConfig } from '#imports'
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig();
        const supabase = await serverSupabaseClient(event);

        const { email } = await readBody(event);
        if (!email) {
            return { success: false, message: "Missing email." };
        }

        // Generate OTP
        const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(rawOtp, 10);

        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

        // Remove old OTPs
        await supabase.from("otp_tokens").delete().eq("email", email);

        // Insert new OTP
        const { error } = await supabase.from("otp_tokens").insert({
            email,
            otp_hash: otpHash,
            expires_at: expiresAt,
            attempts: 0,
            max_attempts: 3,
            used: false,
        });

        if (error) {
            console.error(error);
            return { success: false, message: "OTP creation failed." };
        }

        // Send email
        const transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: Number(config.smtpPort),
            secure: false,
            auth: {
                user: config.smtpEmail,
                pass: config.smtpPass,
            },
            tls: {
                rejectUnauthorized: false
            }
        });


        await transporter.sendMail({
            from: `"BAP Federation" <${config.smtpEmail}>`,
            to: email,
            subject: "Your Admin Login Code",
            html: `<h2>Your OTP</h2><h1>${rawOtp}</h1><p>Expires in 5 minutes</p>`,
        });

        return { success: true };

    } catch (err) {
        console.error("SEND OTP ERROR:", err);
        return { success: false, message: "Internal server error." };
    }
});



