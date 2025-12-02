export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, otp } = body;
    const { $supabase } = useNuxtApp();

    const { data } = await $supabase
        .from("admin_otp")
        .select("*")
        .eq("email", email)
        .single();

    if (!data) return { success: false, message: "No OTP found" };
    if (data.otp_code !== otp) return { success: false, message: "Wrong OTP" };
    if (new Date() > new Date(data.expires_at))
        return { success: false, message: "OTP expired" };

    return { success: true };
});
