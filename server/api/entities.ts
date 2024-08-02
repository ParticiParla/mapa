import { EntityList } from "~/utils/types"

export default defineEventHandler(async (event) => {
  let response: EntityList = [
    {
      name: "Asociación Juvenil Sensei",
      objective: "Hacer actividades para la difusión de la cultura y ocio japones, conseguir que los jóvenes tengan opciones de ocio diferentes",
      activities: "Jornadas Otaku, actividades en eventos de cultura japonesa, proyecciones, torneos varios",
      howToParticipate: "Nuestras actividades están enfocadas al público juvenil pero abiertas a todas las edades, para ser socio se debe tener 14 años",
      schedule: "En todas nuestras actividades o en nuestra jornadas de puertas abiertas",
      location: "Parla, zona sur y Madrid (Eventos en IFEMA)",
      coordinates: null,
      contact: "senseijuvenil@gmail.com",
      observations: "Torneos de cartas, videojuegos, concurso de Ramen picante y mucho más."
    },
    {
      name: "ParlaCuida",
      objective: "Ayudar a los ciudadanos de Parla",
      activities: "Clases de español, clases de apoyo escolar, clases de costura...",
      howToParticipate: "Cualquier persona que quiera tanto de voluntario como de usuario",
      schedule: "Miércoles de 17 a 20 horas",
      location: "Travesía de Getafe s/n",
      coordinates: null,
      contact: "TELÉFONO: 688442887, Instagram: @parlacuida, Facebook: Asociación ParlaCuida, Twitter:@CuidaParla",
      observations: ""
    },
    {
      name: "CREP (Colectivo de Renovación Educativa de Parla)",
      objective: "Mejora de la educación pública en Parla",
      activities: "Realizamos encuentros con todos los miembros de la comunidad educativa, intentando aportar ideas para mejorar los problemas que detectamos en la educación pública",
      howToParticipate: "No es necesario ningún requisito.",
      schedule: "En cualquiera de nuestras reuniones mensuales",
      location: "Nos solemos reunir en MOMO",
      coordinates: 'momo',
      contact: "creparla2017@gmail.com",
      observations: ""
    },
    {
      name: "CREP (Colectivo de Renovación Educativa de Parla)",
      objective: "Creemos que nos define el interés por transformar la educación pública de Parla, por crear\nun espacio de reflexión y formación educativa y nos mueve el interés por construir una\nforma diferente de escuela desde la comunidad escolar. Somos conscientes de que para\ntransformar la sociedad necesitamos buscar formas innovadoras de resolver los\nparadigmas que se dan en la sociedad actual. Y para esto creemos imprescindible la\nrevisión/renovación de nuestra educación, pero también tenemos claro que hay\ndeterminados saberes que hay preservar, los que son producto de la experiencia basada en\nla práctica.",
      activities: "Realizamos encuentros mensuales en los que nos formamos y abordamos las propuestas que vamos planteando y compartimos informaciones sobre los temas que afectan a la educación pública en Parla.",
      howToParticipate: "No es necesario ningún requisito.",
      schedule: "En nuestra próxima reunión",
      location: "Nos reunimos en la Escuela de Educación Infantil MOMO (C. Carabanchel, S/N, 28981 Parla, Madrid)",
      coordinates: 'momo',
      contact: "creparla2017@gmail.com",
      observations: ""
    },
    {
      name: "Asociación Vecinal La Laguna",
      objective: "- Apoyo vecinal\n- Crecer en actividades y poder ofrecer más\n- Crear comunidad",
      activities: "Ayuda vecinal. Enlace entre el barrio y la administración local y autonómica. Gestión de incidencias en el barrio. Organización de actividades sociales, ocio-culturales, solidarias, para todo Parla. Colaboración entre entidades y asociaciones.",
      howToParticipate: "El contacto es a través de ir presencialmente a la oficina o bien mediante teléfono.\nPuede participar en las actividades todo el que quiera, dentro o fuera de Parla.",
      schedule: "Oficina: Miércoles de 18.00h a 20.00h",
      location: "C/ Lago Covadonga s/n Urbanización La Laguna",
      coordinates: [40.24842585764779, -3.776157027294531],
      contact: "asociacionvecinoslaguna@gmail.com / Tlf: 626957504- 637584379- 665400943 / Whatsapp: 637584379 / Instagram: asociacionvecinoslaguna / FB: Asociacionvecinoslaguna",
      observations: ""
    },
    {
      name: "AENMA - Asociación de enfermedades neurodegenerativas de Madrid",
      objective: "Mejora de la calidad de vida de las personas afectadas por enfermedades neurodegenerativas y sus familiares.",
      activities: "- Se presta un servicio de centro de día terapéutico centrado en la persona, con intervenciones personalizadas que engloban tratamientos de psicoestimulación, fisioterapia, logopedia, terapia ocupacional, psicomotricidad, etc.\n- Actividades dirigidas a las personas cuidadoras (formación, atención social, física, psicológica, actividades de respiro, ocio y tiempo libre, grupos de ayuda mutua).\n- Somos compañía que persigue paliar la soledad no deseada de personas afectadas y/o cuidadoras.\n- Acciones de sensibilización sobre las diferentes patologías que atendemos.",
      howToParticipate: "Tenemos un programa de voluntariado en el que la persona voluntaria tras un periodo de formación elige el proyecto en el que participar:\n- Apoyo a las personas afectadas en la realización de actividades del centro de día, paseos terapéuticos\n- Visitas al domicilio en el proyecto somos compañía\n- Apoyo en actividades puntuales: días mundiales, acompañamiento en salidas del centro, acciones de sensibilización, realización de bailes, recitales de poesía, etc.",
      schedule: "Con cita previa de lunes a viernes de 9:30 a 17:00 h",
      location: "C/ Jericó, 24",
      coordinates: [40.237174995061835, -3.777259892966207],
      contact: "www.aenma.ong  (atendemos vía WhatsApp desde la WEB)\naenma@aenma.ong\n91.698.92.37\nttps://www.facebook.com/AENMAong/\nhttps://twitter.com/AENMAong\nhttps://www.instagram.com/aenmaong/\nhttps://www.linkedin.com/in/aenma-ong-9157831a6/",
      observations: ""
    },
    {
      name: "Asociación Cultural Dendê",
      objective: "La diversión dentro de la cultura y deporte\nLa integración mediante el arte.\nOfrecer una alternativa a un ocio saludable",
      activities: "Actualmente hacemos una actividad de Teatro con otras actividades puntuales",
      howToParticipate: "Hacercarse a cultura los domingos a las 11:00 que es cuando nos reuniomos",
      schedule: "Domingos 11:00 a 13:30 en cultura o. A través de redes sociales instagram e facebook",
      location: "En Cultura c/ san anton n68",
      coordinates: [40.23843841264979, -3.7685166686879206],
      contact: "Asociacionculturaldende@gmail.com",
      observations: "Cultura Afrobrasileña"
    },
    {
      name: "Asociación Parlatea",
      objective: "Visibilidad del autismo y facilitar la inclusion de las personas de este colectivo",
      activities: "Charlas en colegios, taller de perros, taller hhss, taller de familias. Tambien asistimos a eventos solidarios para recaudar fondos para poder llevar a cabo nuestros objetivos",
      howToParticipate: "Cualquier persona que quiera unirse a nuestra causa.",
      schedule: "Jueves por la tarde o sabado por la mañana. Y cualquier otro dia con cita previa",
      location: "C/ Cebadero 2",
      coordinates: [40.24249926512679, -3.7762432790212195],
      contact: "",
      observations: ""
    },
    {
      name: "Kapikua Asociación de Parla",
      objective: "●\tOfrecer una opción de ocio y tiempo libre para los jóvenes con discapacidad que participan en nuestra asociación.\n●\tFomentar la inclusión, normalización y socialización de las personas con discapacidad.\n●\tFomentar las habilidades de autonomía personal y social mediante las actividades de ocio y tiempo libre.\n●\tFavorecer la interrelación de la asociación con otras asociaciones y personas de la comunidad con el propósito de realizar actividades comunes.",
      activities: "En Kapikua realizamos diferentes actividades de ocio como pueden ser visitas al cine, teatro, museos; fiestas; parques; salidas de fin de semana; etc., acercando el ocio a los jóvenes con discapacidad y fomentando la inclusión de estos a nivel social.",
      howToParticipate: "Para ser voluntario/a de Kapikua solo se necesitan ganas de participar y compromiso para realizar las actividades que se proponen.",
      schedule: "Escribir por correo o WhatsApp para concertar cita",
      location: "Calle Pablo Sorozábal, 10",
      coordinates: [40.229546275255686, -3.772424954502322],
      contact: "Correo: asociacionkapikua@gmail.com\nTeléfono: 603037992\nFacebook: A.Kapikua\nInstagram: asociacionkapikua\nX: @AKapikua\nTikTok: @a.kapikua",
      observations: ""
    },
    {
      name: "Mariposas para el Duelo",
      objective: "Acompañamiento y apoyo a las familias cuyos bebés fallecen en el seno materno o tras el nacimiento.\nFormación y apoyo a profesionales sanitarios que trabajan en el ámbito del duelo perinatal \nCampañas de sensibilización respecto al duelo perinatal y la violencia obstetrica",
      activities: "Semanalmente atendemos a familias en duelo perinatal e infantil para asesorarles de sus derechos en el ámbito hospitalario, legal y emocional.\nMensualmente realizamos grupos de apoyo al duelo y actividades relacionadas con el proceso.\nTrimestralmente se entregan cajas del recuerdo a diferentes hospitales de la CAM.\nDurante todo el año creamos campañas de visibilizacion a la muerte perinatal y colaboramos con otras entidades que nos derivan mujeres en duelo.",
      howToParticipate: "Los grupos de apoyo están abiertos a todas las personas en duelo, sin importar proceso, ideología o religión,  siendo totalmente gratuitos. El resto de actividades pueden realizarse siendo socios que han pagado su cuota anual o , n caso de tener algún coste de material, abonando a parte ese día. Becamos a las familias con bajos recursos.",
      schedule: "No tenemos local, asi que poniéndonos de acuerdo a traves del movil o el correo podemos conocernos cuando deseen, o en alguna de nuestras actividades mensuales.",
      location: "En Parla, solemos isar la sala 10 de la plaza de toros",
      coordinates: "toros",
      contact: "Mariposasparaelduelo@gmail.com\nTlf. 695343872\nInstagram: mariposas_para_el_duelo",
      observations: ""
    },
    {
      name: "Avv PARLA Este",
      objective: "Socialización",
      activities: "Talleres varios",
      howToParticipate: "Solo inscribirte",
      schedule: "Miércoles de 18 a 20",
      location: "Callé Libra5",
      coordinates: [40.22287363206696, -3.7629924242014168],
      contact: "Avvparlaeste@gmail.com",
      observations: ""
    },
    {
      name: "Asociación vecinal Villa de Parla",
      objective: "Mejorar Parla en todos los sentidos por ejemplo:\nEn la participación. \nEn la salud.\nEn bienestar animal .\nEn igualdad.\nEn transporte\nEn educación e infancia.",
      activities: "Estamos en espacios de mas asociaciones, haciendo acciones conjuntas, que se llama PARTICIPARLA, estamos en los consejos sectoriales, consejos territoriales y además, tenemos ludoteca inclusiva los martes y los jueves manualidades para todas las edades ect...",
      howToParticipate: "Acudir a la sala que tenemos en el edificio asociativo Vicente Alexandre o llamarnos por teléfono e incluso mandando un correo",
      schedule: "los martes y los jueves de 17:30 a 20.00 en verano y 19:00 en invierno",
      location: "Edificio Asociativo Vicente Alexandre junto ala escuela de idiomas.",
      coordinates: "vicente",
      contact: "Telefono  625461216 Toñy \nTelefono 687410403 Tere\nasociaciónvecinalvilladeparla@gmail.com\nAsociación Villa de Parla Facebook\nasociaciónvecinalvilladeparla instagram\nO pasate por nuestra sala",
      observations: "os esperamos"
    },
    {
      name: "A PIE DE CALLE",
      objective: "Crear un espacio de respeto, mejora de la vida y reivindicación de las condiciones de las personas sin hogar.",
      activities: ".- Apoyo en la vida diaria de las personas (empleo, vivienda, higiene, apoyo emocional...)\n.- Espacio de encuentro/café \n.- Coordinación con servicios sociales y vivienda\n.- Talleres de formación",
      howToParticipate: "Cualquier persona con interés, ganas, empatía y respeto por los demás es bienvenido/a a participar y colaborar.",
      schedule: "Los viernes de 16:30 a 20:00 nos encuentras",
      location: "Calle Alcorcón s/n. Planta 2; local 9. Edificio Momo.",
      coordinates: "momo",
      contact: "Teléfono (watshap): 626725526\nInstagram: parlaapiedecalle\nCorreo electrónico: parlaapiedecalle@gmail.com",
      observations: "En el mundo cabemos todos y todas con los mismos derechos. Hagámoslo posible!"
    },
    {
      name: "Asociación FotoParla",
      objective: "Colaborar con la difusión de la cultura entre nuestros conciudadanos y con el resto de asociaciones de la ciudad, desde el punto de vista de la fotografía. Además de compartir los conocimientos fotográficos que podamos tener, con todos nuestros asociados.",
      activities: "Dentro de nuestras posibilidades, colaboramos con el resto de asociaciones de la ciudad y con el Ayuntamiento, realizando fotos que muestren los distintos eventos a los que asistimos. También realizamos talleres y cursos para nuestros asociados, además de organizar salidas fotográficas con ellos.",
      howToParticipate: "Solo se necesita querer aprender y disfrutar de la fotografía, además, pueden ponerse en contacto con nosotros para pedir información y/o asociarse, desde el formulario que encontrarán en nuestra web: www.asociacionfotoparla.org",
      schedule: "Los viernes que no tenemos salida a exteriores, pueden localizarnos en nuestra sede entre las 17:30 y las 19:30 horas",
      location: "Local 46 del Centro Comercial “Merca2”, sito en la calle Pablo Casals, nº 25, de la localidad de Parla (MADRID)",
      coordinates: [40.23073746070984, -3.772240146910489],
      contact: "email: asociacion.fotoparla@gmail.com // web: www.asociacionfotoparla.org",
      observations: ""
    },
    {
      name: "Asociación Juvenil A por todo",
      objective: "Nuestro objetivo es mejorar las circunstancias que rodean a los jóvenes, promoviendo aquello que pueda favorecer a formar futuras personas libres, auténticas, solidarias, con iniciativa y creatividad y capaces de comprometerse libremente con aquello en lo que crean.",
      activities: "Desarrollamos diferentes actividades relacionadas con el ocio saludable y el tiempo libre, y promoviendo y apoyado la creación de grupos de jóvenes que tengan un proyecto en común\nque mejore las opciones culturales de nuestro Municipio.\n\nAdemás, creemos fielmente que la unión hace la fuerza y que uniendo esfuerzos se pueden lograr grandes objetivos comunes. Por ello, solemos colaborar con diferentes entidades para, juntos, llevar a cabo diferentes proyectos que contengan un carácter social dentro de su esencia.",
      howToParticipate: "Puede formar parte del equipo de trabajo, o actuar como colaborador puntual, toda persona que tenga intereses afines al ideario de la Asociación, que tenga motivación y que le guste trabajar como voluntaria dentro de un equipo diverso y juvenil, muy unido al movimiento de participación ciudadana de Parla.",
      schedule: "Sábado de 11:00-13:00h (en otro horario con cita previa)",
      location: "Espacio Asociativo Vicente Aleixandre C/ Ciudad Real (Esq. C/ Palencia) SN 28982 Parla (Madrid).",
      coordinates: "vicente",
      contact: "Correo electrónico: ajaportodo@hotmail.com\nInstagram: _ajaportodo_\nFacebook: Asociación Juvenil A por todo\nTeléfono: 629 96 91 46",
      observations: ""
    },
    {
      name: "Movimiento ATD Cuarto Mundo",
      objective: "Llevar a la práctica no dejar a nadie atrás.: - Garantizar el acceso a todos los derechos para todas las personas; Ir al encuentro de quienes todavía falta; construir un colectivo de compromiso activista y militante.",
      activities: "Bibliotecas de Calle, grupos juveniles e infantiles de ocio saludable y lucha contra las injusticias, Universidad Popular, Oficina Jurídica de Derechos Sociales, Investigación Social en Cruce de Saberes. (Participación en A pie de calle y en la PAH)",
      howToParticipate: "No hay requisitos más que la voluntad de contribuir. Participar en las animaciones, en la contabilidad, económicamente...",
      schedule: "A través de WhatsApp o correo electrónico se concierta una entrevista y a partir de ese diálogo se busca la acción que corresponda.",
      location: "En Momo (local compartido con A pie de calle - local 9). Sede en Carabanchel avenida de Oporto 36 bajo, Madrid.",
      coordinates: null,
      contact: "cuartomundo@gmail.com /// Fb-Tw-Ig",
      observations: "Se necesita el aporte de cada persona para mejorar la sociedad."
    }
  ]

  return response
})
