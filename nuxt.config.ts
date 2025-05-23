// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	ssr: false,
	devtools: { enabled: false },
	modules: [
		'@unocss/nuxt',
		"@nuxtjs/leaflet",
		"@nuxt/image",
		"@nuxt/fonts",
		'@nuxt/ui'
	],
	image: {
		directus: {
			baseURL: 'https://api.participarla.es/assets'
		}
	},
	css: ['~/assets/css/main.css'],
	runtimeConfig: {
		directusUrl: process.env.DIRECTUS_URL, // Solo disponible en el servidor
		directusToken: process.env.DIRECTUS_STATIC_TOKEN, // Solo disponible en el servidor


		// public: {
		// 	directusUrl: process.env.DIRECTUS_URL
		// }
	},
})