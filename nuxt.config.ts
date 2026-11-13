import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['nuxt-svgo'],
  svgo: {
    autoImportPath: './assets/icons/',
    dts: true,
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  app: {
    head: {
      title: 'Characters',
      titleTemplate: '%s · Rick and Morty',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'Browse Rick and Morty characters, episodes, and locations.' },
        { name: 'theme-color', content: '#1e1e1e' },
      ],
      // link: [
      //   { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      //   { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      //   { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
      //   {
      //     rel: 'stylesheet',
      //     href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Lilita+One&display=swap',
      //   },
      // ],
    },
  },
  typescript: {
    strict: true,
  },
})
