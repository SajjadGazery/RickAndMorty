import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    modules: ['nuxt-svgo', '@nuxt/fonts', '@nuxt/eslint'],
    svgo: {
        autoImportPath: './assets/icons/',
        dts: true,
    },
    routeRules: {
        '/api/characters': {cache: {maxAge: 600, swr: true}},
        '/api/characters/**': {cache: {maxAge: 3600, swr: true}},
    },
    runtimeConfig: {
        rickAndMortyApi: 'https://rickandmortyapi.com/api',
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
            htmlAttrs: {lang: 'en'},
            meta: [
                {name: 'description', content: 'Browse Rick and Morty characters, episodes, and locations.'},
                {name: 'theme-color', content: '#1e1e1e'},
            ],
            link: [
                {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
            ],
        },
    },
    typescript: {
        strict: true,
    },
})
