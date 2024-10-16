import { EntityList } from "~/utils/types"

export default defineEventHandler(async (event) => {
	let response: EntityList = [
		{
			name: "ParlaCuida",
			objective: "En ParlaCuida ayudamos a la gente.",
			logoLink: "/entities-logos/Logo ParlaCuida.png",
			pdfLink: "https://drive.google.com/file/d/1ZgqlX7SzyvmoTIn0qIUmEY6otgyX25nG/view",
			coordinates: [40.24265054509736, -3.7712151892321573]
		},
		{
			name: "Asociación Juvenil A Por Todo",
			objective: "Ocio juvenil. Proyectos sociales. Participación ciudadana.",
			logoLink: "/entities-logos/Logo Aportodo.jpg",
			coordinates: "vicente",
			pdfLink: "https://drive.google.com/file/d/1VyuYPGiCNrOBQtBSfv9aLLZKw9jB36EJ/view"
		},
		{
			name: "Club Deportivo Archeosport",
			objective: "Esgrima Histórica. ¡Deporte, diversión e historia!. Para todo el mundo.",
			logoLink: "/entities-logos/Logo Archeosport.jpg",
			pdfLink: "https://drive.google.com/file/d/1S9Hn0PXSRd9efUd_pOKvepHi1vvJzZJN/view",
			coordinates: [40.244984612052306, -3.7707780155691855]
		},
		{
			name: "A.V. Villa De Parla",
			objective: "Al servicio de las necesidades de las Parleñas y los Parleños.",
			logoLink: "/entities-logos/Logo A.V. Villa de Parla negro trans (1).png",
			coordinates: "vicente",
			pdfLink: "https://drive.google.com/file/d/1CIiAPKNG-QRvHcs1oAFlGORlqodsZSvG/view"

		},
		{
			name: "Asociación Mariposas para el Duelo",
			objective: "Entidad de apoyo a las familias en duelo perinatal e infantil.",
			logoLink: "/entities-logos/Logo Mariposas.jpg",
			coordinates: "toros",
			pdfLink: "https://drive.google.com/file/d/1r3uWFsnvDZlYBk3tlc7IUy_d5zield1a/view"
		},
		{
			name: "Asociación Vecinal La Laguna",
			objective: "Ayuda vecinal - enlace entre vecinos de Parla y Administración Local.",
			logoLink: "/entities-logos/Logo La Laguna Negro.png",
			coordinates: [40.24842585764779, -3.776157027294531],
			pdfLink: "https://drive.google.com/file/d/1CkJ6Xxir-k9rvf-uOO6oefQhGOq-x4j1/view"

		},
		{
			name: "Dejando Huella",
			objective: "Somos su voz, por qué todos merecen una segunda oportunidad.",
			logoLink: "/entities-logos/Logo Dejando Huella.png",
			pdfLink: "https://drive.google.com/file/d/1BRgId7osVssAhAW7bNheh15IG0mygYU8/view",
			coordinates: [40.24469974120315, -3.774459777606231]
		},
		{
			name: "Asociación ParlaTea",
			objective: "Familias y amigos de personas con autismo.",
			coordinates: [40.24249926512679, -3.7762432790212195],
			logoLink: "/entities-logos/Logo ParlaTea.jpeg",
			pdfLink: "https://drive.google.com/file/d/1SrJC9FGqkpPIiCAMF8AvSSKE16uJcb4Q/view"
		},
		{
			name: "Asociación Cultural Dendê",
			objective: "El teatro.",
			coordinates: [40.23843841264979, -3.7685166686879206],
			logoLink: "/entities-logos/Logo AC Dende.jpeg",
			pdfLink: "https://drive.google.com/file/d/1lS0JmRKc78rP-aKGZmOlZC-_miWURx1M/view"

		},
		{
			name: "Oráculo del Sur",
			objective: "Desde 1996 haciendo el mundo más friki. Nos dedicamos a juegos de rol, mesa y wargames.",
			logoLink: "/entities-logos/Logo Oráculo.jpg",
			coordinates: "vicente",
			pdfLink: "https://drive.google.com/file/d/1Behe5CJSWA00JrXYe-aku4wyUiD2cRuc/view"
		},
		{
			name: "Asociación Vecinal Parla Este",
			objective: "Gran diversidad de cosas chulas que hay en tu barrio.",
			logoLink: "/entities-logos/Logo AV PARLA ESTE.jpg",
			coordinates: [40.22287363206696, -3.7629924242014168],
			pdfLink: "https://drive.google.com/file/d/1NP5Q-vt1voe_vxMrXjALSEq3UgwsVJQR/view"
		},
		{
			name: "Unión de AMPAS y familias de Parla",
			objective: "Familias.",
			logoLink: "/entities-logos/logo UNION AMPAS PARLA.png",
			pdfLink: "https://drive.google.com/file/d/1qSd19n_Uo-wDxxKTFYe_GAwEAKjIwwSW/view",
			coordinates: [40.23585007529751, -3.762283466172123]
		},
		{
			name: "A Pie De Calle",
			objective: "Colectivo para mejorar las condiciones de vida de las personas en situación de calle.",
			logoLink: "/entities-logos/Logo A pie de calle.PNG",
			coordinates: "momo",
			pdfLink: "https://drive.google.com/file/d/1UQWGd6BFWKRp1X4CZ-xDFp-TjiMw5U0z/view"
		},
		{
			name: "Asociación FotoParla",
			objective: "Somos la asociación que fotografía Parla, sus asociaciones y actividades.",
			coordinates: [40.23073746070984, -3.772240146910489],
			logoLink: "/entities-logos/Logo Fotoparla.jpeg",
			pdfLink: "https://drive.google.com/file/d/1_-h64SYai3FEZ7ZIImV5DagGNoPZfd2n/view"
		},
		{
			name: "La Pluma",
			objective: "Asociación LGBTI+ de Parla.",
			logoLink: "/entities-logos/Logo La Pluma.png",
			pdfLink: "https://drive.google.com/file/d/17-l8bzTKpkynCs8yPD1gOwmGBQjx3i9x/view",
			coordinates: [40.239959, -3.768151],
		},
		{
			name: "Promoción de la mujer La Paz",
			objective: "Dirigida a mujeres mayores de 50 años a fin de aumentar su sociabilidad y autoestima.",
			logoLink: "/entities-logos/Logo Promoción Mujer La Paz.png",
			pdfLink: "https://drive.google.com/file/d/1u7AKuMqiIgll91R3FRVdO19Sone6s291/view",
			coordinates: [40.238440349562886, -3.7685194147521366]
		},
		{
			name: "AENMA",
			objective: "Cuida tú cerebro y el cuidará de tí.",
			logoLink: "/entities-logos/Logo AENMA.jpg",
			coordinates: [40.237174995061835, -3.777259892966207],
			pdfLink: "https://drive.google.com/file/d/1hKiGI7ToAP6dTZCerHUqFjwnnF_Mbzmm/view"

		},
		{
			name: "Kapikua Asociación de Parla",
			objective: "Que aburrido sería que tod@s fuéramos iguales, por eso tod@s necesitamos nuestro propio ocio.",
			logoLink: "/entities-logos/Logo KAPIKUA.png",
			coordinates: [40.229546275255686, -3.772424954502322],
			pdfLink: "https://drive.google.com/file/d/19bQXLnyQPLUXnLvR7Jd3FsChpuyZupiH/view"
		},
		{
			name: "Acción Humanitaria Internacional",
			objective: "Apoyo y asesoramiento para migrantes y ciudadanos locales.",
			logoLink: "/entities-logos/Logo AHI.png",
			pdfLink: "https://drive.google.com/file/d/1sph1w4-P857maSEv4L6MDX1h011XFFdP/view",
			coordinates: [40.23637885943543, -3.786867456297262]
		},
		{
			name: "CREP (Colectivo de Renovación Educativa de Parla)",
			objective: "Intentamos hacer propuestas para mejorar la educación pública de Parla.",
			logoLink: "/entities-logos/Logo CREP.png",
			coordinates: 'momo',
			pdfLink: "https://drive.google.com/file/d/1mLwjXjAcWagGLZe0utIDLZMCNu9zNvl8/view"

		},
		{
			name: "ParticiParla",
			objective: "Red de apoyo mutuo con el objetivo de fortalecer la estructura de las entidades a través del trabajo colectivo.",
			logoLink: "/entities-logos/Logo ParticiParla.png",

		},
	]

	return response
})
// import { EntityList } from "~/utils/types"

// export default defineEventHandler(async (event) => {
//  let response: EntityList = [
// 		{
// 			name: "Asociación Juvenil Sensei",
// 			objective: "Hacer actividades para la difusión de la cultura y ocio japones, conseguir que los jóvenes tengan opciones de ocio diferentes",
// 			coordinates: null,
// 			contact: "senseijuvenil@gmail.com",
// 			pdfLink: "https://drive.google.com/file/d/1TTwrpyHfSXbjfvbRsu0iiqtIkG1nHAhx/view?usp=sharing"

// 		},
// 		{
// 			name: "ParlaCuida",
// 			objective: "Ayudar a los ciudadanos de Parla",
// 			coordinates: null,
// 			contact: "TELÉFONO: 688442887, Instagram: @parlacuida, Facebook: Asociación ParlaCuida, Twitter:@CuidaParla",
// 			pdfLink: "https://drive.google.com/file/d/1FQRDDuVQ1zPAAsY45x8z_dlrgswYs9-K/view?usp=sharing"
// 		},
// 		{
// 			name: "CREP (Colectivo de Renovación Educativa de Parla)",
// 			objective: "Mejora de la educación pública en Parla",
// 			coordinates: 'momo',
// 			contact: "creparla2017@gmail.com",
// 			pdfLink: "https://drive.google.com/file/d/1XPLDj6G-_OW5yD3iHo_wBuTPO5I5eXBm/view?usp=sharing"
// 		},
// 		{
// 			name: "Asociación Vecinal La Laguna",
// 			objective: "- Apoyo vecinal\n- Crecer en actividades y poder ofrecer más\n- Crear comunidad",
// 			coordinates: [40.24842585764779, -3.776157027294531],
// 			contact: "asociacionvecinoslaguna@gmail.com / Tlf: 626957504- 637584379- 665400943 / Whatsapp: 637584379 / Instagram: asociacionvecinoslaguna / FB: Asociacionvecinoslaguna",
// 			pdfLink: "https://drive.google.com/file/d/18mM_nPhZksmzk_eJmp3SFxT5XWSRVDsn/view?usp=sharing"
// 		},
// 		{
// 			name: "AENMA - Asociación de enfermedades neurodegenerativas de Madrid",
// 			objective: "Mejora de la calidad de vida de las personas afectadas por enfermedades neurodegenerativas y sus familiares.",
// 			coordinates: [40.237174995061835, -3.777259892966207],
// 			contact: "www.aenma.ong  (atendemos vía WhatsApp desde la WEB)\naenma@aenma.ong\n91.698.92.37\nttps://www.facebook.com/AENMAong/\nhttps://twitter.com/AENMAong\nhttps://www.instagram.com/aenmaong/\nhttps://www.linkedin.com/in/aenma-ong-9157831a6/",
// 			pdfLink: "https://drive.google.com/file/d/18WwL-6LThQyzPWvN_Npu36WOUW30NULF/view?usp=sharing"
// 		},
// 		{
// 			name: "Asociación Cultural Dendê",
// 			objective: "La diversión dentro de la cultura y deporte\nLa integración mediante el arte.\nOfrecer una alternativa a un ocio saludable",
// 			coordinates: [40.23843841264979, -3.7685166686879206],
// 			contact: "Asociacionculturaldende@gmail.com",

// 			pdfLink: "https://drive.google.com/file/d/1e91HEFgg6jrh0PzObwdcuuGzFMT3_DBC/view?usp=sharing"
// 		},
// 		{
// 			name: "Asociación Parlatea",
// 			objective: "Visibilidad del autismo y facilitar la inclusion de las personas de este colectivo",
// 			coordinates: [40.24249926512679, -3.7762432790212195],
// 			contact: "",
// 		},
// 		{
// 			name: "Kapikua Asociación de Parla",
// 			objective: "●\tOfrecer una opción de ocio y tiempo libre para los jóvenes con discapacidad que participan en nuestra asociación.\n●\tFomentar la inclusión, normalización y socialización de las personas con discapacidad.\n●\tFomentar las habilidades de autonomía personal y social mediante las actividades de ocio y tiempo libre.\n●\tFavorecer la interrelación de la asociación con otras asociaciones y personas de la comunidad con el propósito de realizar actividades comunes.",
// 			coordinates: [40.229546275255686, -3.772424954502322],
// 			contact: "Correo: asociacionkapikua@gmail.com\nTeléfono: 603037992\nFacebook: A.Kapikua\nInstagram: asociacionkapikua\nX: @AKapikua\nTikTok: @a.kapikua",
// 		},
// 		{
// 			name: "Mariposas para el Duelo",
// 			objective: "Acompañamiento y apoyo a las familias cuyos bebés fallecen en el seno materno o tras el nacimiento.\nFormación y apoyo a profesionales sanitarios que trabajan en el ámbito del duelo perinatal \nCampañas de sensibilización respecto al duelo perinatal y la violencia obstetrica",
// 			coordinates: "toros",
// 			contact: "Mariposasparaelduelo@gmail.com\nTlf. 695343872\nInstagram: mariposas_para_el_duelo",
// 			pdfLink: "https://drive.google.com/file/d/1QYUTkwJHVcYQI8BeYBDo3LEkyvwUT74a/view?usp=sharing"
// 		},
// 		{
// 			name: "Avv PARLA Este",
// 			objective: "Socialización",
// 			coordinates: [40.22287363206696, -3.7629924242014168],
// 			contact: "Avvparlaeste@gmail.com",
// 		},
// 		{
// 			name: "Asociación vecinal Villa de Parla",
// 			objective: "Mejorar Parla en todos los sentidos por ejemplo:\nEn la participación. \nEn la salud.\nEn bienestar animal .\nEn igualdad.\nEn transporte\nEn educación e infancia.",
// 			coordinates: "vicente",
// 			contact: "Telefono  625461216 Toñy \nTelefono 687410403 Tere\nasociaciónvecinalvilladeparla@gmail.com\nAsociación Villa de Parla Facebook\nasociaciónvecinalvilladeparla instagram\nO pasate por nuestra sala",
// 			pdfLink: "https://drive.google.com/file/d/14lOtDYwJLBL-501Yj7Yy3ffBIq7Ld38H/view?usp=sharing"
// 		},
// 		{
// 			name: "A PIE DE CALLE",
// 			objective: "Crear un espacio de respeto, mejora de la vida y reivindicación de las condiciones de las personas sin hogar.",
// 			coordinates: "momo",
// 			contact: "Teléfono (watshap): 626725526\nInstagram: parlaapiedecalle\nCorreo electrónico: parlaapiedecalle@gmail.com",
// 			pdfLink: "https://drive.google.com/file/d/1C16rxx0WcFr0dbZp3Ow6KkoBL9AI4Bd8/view?usp=sharing"
// 		},
// 		{
// 			name: "Asociación FotoParla",
// 			objective: "Colaborar con la difusión de la cultura entre nuestros conciudadanos y con el resto de asociaciones de la ciudad, desde el punto de vista de la fotografía. Además de compartir los conocimientos fotográficos que podamos tener, con todos nuestros asociados.",
// 			coordinates: [40.23073746070984, -3.772240146910489],
// 			contact: "email: asociacion.fotoparla@gmail.com // web: www.asociacionfotoparla.org",
// 		},
// 		{
// 			name: "Asociación Juvenil A por todo",
// 			objective: "Nuestro objetivo es mejorar las circunstancias que rodean a los jóvenes, promoviendo aquello que pueda favorecer a formar futuras personas libres, auténticas, solidarias, con iniciativa y creatividad y capaces de comprometerse libremente con aquello en lo que crean.",
// 			coordinates: "vicente",
// 			contact: "Correo electrónico: ajaportodo@hotmail.com\nInstagram: _ajaportodo_\nFacebook: Asociación Juvenil A por todo\nTeléfono: 629 96 91 46",
// 		},
// 		{
// 			name: "Movimiento ATD Cuarto Mundo",
// 			objective: "Llevar a la práctica no dejar a nadie atrás.: - Garantizar el acceso a todos los derechos para todas las personas; Ir al encuentro de quienes todavía falta; construir un colectivo de compromiso activista y militante.",
// 			coordinates: null,
// 			contact: "cuartomundo@gmail.com /// Fb-Tw-Ig",
// 		}
// 	]

// 	return response
// })
