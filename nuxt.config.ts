import { defineNuxtConfig } from 'nuxt/config'

console.log(
  'SUPABASE ENV:',
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
)

export default defineNuxtConfig({

  modules: [
    '@nuxtjs/supabase'
    , '@nuxtjs/tailwindcss'
  ],

  supabase: {
    redirect: false
  },

  runtimeConfig: {
    public: {
      supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_PUBLISHABLE_KEY
      },
    },

    smtpEmail: process.env.SMTP_EMAIL,
    smtpPass: process.env.SMTP_PASS,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT
  },
  app: {
    head: {
      title: 'BAP Federation',
      meta: [
        { name: 'description', content: 'Official website of BAP Federation' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/img/BAP-2.png' }
      ]
    }
  }
})
