export default defineNuxtConfig({
  css: ["~/assets/css/tailwind.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  runtimeConfig: {
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
