import bcrypt from "bcryptjs";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
    try {
        const { email, otp } = await readBody(event);

        if (!email || !otp) {
            return { success: false, message: "Missing fields." };
        }

        const supabase = await serverSupabaseClient(event);

        // 1️⃣ Get OTP record
        const { data, error } = await supabase
            .from("otp_tokens")
            .select("*")
            .eq("email", email)
            .eq("used", false)
            .single();

        if (error || !data) {
            return { success: false, message: "No active OTP." };
        }

        // 2️⃣ Check expiration
        if (new Date() > new Date(data.expires_at)) {
            return { success: false, message: "OTP expired." };
        }

        // 3️⃣ Check attempts
        if (data.attempts >= data.max_attempts) {
            return { success: false, locked: true, message: "Too many attempts." };
        }

        // 4️⃣ Compare OTP
        const valid = await bcrypt.compare(otp, data.otp_hash);

        if (!valid) {
            await supabase
                .from("otp_tokens")
                .update({ attempts: data.attempts + 1 })
                .eq("id", data.id);

            return {
                success: false,
                attemptsLeft: data.max_attempts - (data.attempts + 1),
                message: "Incorrect OTP."
            };
        }

        // 5️⃣ Mark as used
        await supabase
            .from("otp_tokens")
            .update({ used: true })
            .eq("id", data.id);

        return { success: true };

    } catch (err) {
        console.error("VERIFY OTP ERROR:", err);
        return { success: false, message: "Internal server error." };
    }
});
