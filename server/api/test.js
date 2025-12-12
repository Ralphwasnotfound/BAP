export default defineEventHandler(() => {
    const config = useRuntimeConfig()
    return {
        url: config.public.supabaseUrl,
        keyExists: !!config.public.supabaseAnonKey
    }
})
