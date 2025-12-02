export default defineNuxtConfig({
  css: ["~/assets/css/tailwind.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  runtimeConfig: {

    smtpEmail: process.env.SMTP_EMAIL,
    smtpPass: process.env.SMTP_PASS,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,

    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    }
  },

  app: {
    head: {
      title: "BAP Federation",
      meta: [
        { name: "description", content: "Official website of BAP Federation" }
      ],
      link: [
        // Favicon support
        { rel: "icon", type: "image/png", href: "/BAP.png" }
      ]
    }
  }
});
