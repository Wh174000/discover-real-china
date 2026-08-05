(() => {
  'use strict';

  const LOCALES = ['en', 'zh', 'es'];
  const STORAGE_KEY = 'drc-locale';
  const textNodes = new WeakMap();
  const attributes = new WeakMap();
  let currentLocale = 'en';
  let applying = false;
  let mutationTimer = 0;

  const TEXT = {
    'Reply': { zh: '语言', es: 'Idioma' },
    'Choose reply language': { zh: '选择语言', es: 'Elegir idioma' },
    'Home': { zh: '首页', es: 'Inicio' },
    'Beijing': { zh: '北京', es: 'Pekín' },
    'Shanghai': { zh: '上海', es: 'Shanghái' },
    'Western Sichuan': { zh: '川西', es: 'Sichuan occidental' },
    'Quanzhou': { zh: '泉州', es: 'Quanzhou' },
    'TCM Wellness': { zh: '中医文化之旅', es: 'Bienestar cultural' },
    'Take Home': { zh: '带回家的文化', es: 'Cultura para llevar' },
    'FAQ': { zh: '常见问题', es: 'Preguntas frecuentes' },
    'About': { zh: '关于我们', es: 'Sobre nosotros' },
    'Partners': { zh: '合作伙伴', es: 'Colaboradores' },
    'Back to shelf': { zh: '返回产品架', es: 'Volver al catálogo' },
    'Request checkout': { zh: '申请付款链接', es: 'Solicitar enlace de pago' },
    'Search': { zh: '搜索', es: 'Buscar' },
    'Menu': { zh: '菜单', es: 'Menú' },
    'Independent China, made workable': { zh: '让独立中国之旅变得可行', es: 'China independiente, bien resuelta' },
    'Independent China travel and culture to take home': { zh: '独立中国旅行与带回家的文化', es: 'Viajes independientes por China y cultura para llevar' },
    'Independent China Travel & Culture': { zh: '独立中国旅行与文化', es: 'Viajes independientes y cultura de China' },
    'Discover Real China / Take Home cultural products inquiry': { zh: '发现真实中国 / 带回家的文化产品咨询', es: 'Discover Real China / consulta de productos culturales' },
    'Discover Real China / Take Home product detail': { zh: '发现真实中国 / 带回家的文化产品详情', es: 'Discover Real China / detalle del producto' },
    'Discover Real China / non-medical cultural wellness journeys': { zh: '发现真实中国 / 非医疗文化健康之旅', es: 'Discover Real China / viajes culturales de bienestar no médico' },
    'Discover Real China / Beijing cultural travel inquiry': { zh: '发现真实中国 / 北京文化旅行咨询', es: 'Discover Real China / consulta de viaje cultural a Pekín' },
    'Discover Real China / Shanghai and Jiangnan cultural travel inquiry': { zh: '发现真实中国 / 上海与江南文化旅行咨询', es: 'Discover Real China / consulta cultural de Shanghái y Jiangnan' },
    'Discover Real China / Chengdu and Western Sichuan cultural travel inquiry': { zh: '发现真实中国 / 成都与川西文化旅行咨询', es: 'Discover Real China / consulta cultural de Chengdu y Sichuan occidental' },
    'Discover Real China / Quanzhou and Fujian Tulou cultural travel inquiry': { zh: '发现真实中国 / 泉州与福建土楼文化旅行咨询', es: 'Discover Real China / consulta cultural de Quanzhou y Tulou de Fujian' },
    'About Tsingpu / cultural retreat reference': { zh: '关于青普 / 文化旅居参考', es: 'Sobre Tsingpu / referencia de retiros culturales' },
    'A stay can become a deeper way to see China.': { zh: '一次停留，也可以成为理解中国的更深入口。', es: 'Una estancia puede convertirse en una forma más profunda de conocer China.' },
    'What guests can feel': { zh: '客人可以感受到什么', es: 'Lo que pueden sentir los huéspedes' },
    'A cultural-travel approach you can experience in real places.': { zh: '在真实地点感受文化旅行。', es: 'Una forma de viajar con cultura que puedes vivir en lugares reales.' },
    'Tsingpu brings together restored places, local mentors, food, craft, architecture, and thoughtful hospitality. For guests, that means more ways to understand the place they are visiting.': { zh: '青普把修复后的空间、当地文化导师、美食、手工艺、建筑与用心的接待结合在一起。对客人来说，这意味着有更多方式理解正在到访的地方。', es: 'Tsingpu reúne espacios restaurados, mentores locales, comida, artesanía, arquitectura y una hospitalidad cuidada. Para los huéspedes, eso ofrece más formas de comprender el lugar que visitan.' },
    'Cultural experiences': { zh: '文化体验', es: 'Experiencias culturales' },
    'Experiences across art, craft, seasonal living, food, and local culture.': { zh: '涵盖艺术、手工艺、节气生活、美食与当地文化的体验。', es: 'Experiencias de arte, artesanía, vida estacional, gastronomía y cultura local.' },
    'Cultural mentors': { zh: '文化导师', es: 'Mentores culturales' },
    'A broad network across art, literature, film, education, design, and local knowledge.': { zh: '覆盖艺术、文学、电影、教育、设计与地方知识的广泛网络。', es: 'Una amplia red de arte, literatura, cine, educación, diseño y conocimiento local.' },
    'Cultural products': { zh: '文化产品', es: 'Productos culturales' },
    'Objects and experience-led products that help guests keep a memory at home.': { zh: '让客人把旅途记忆带回家的文化物件与体验型产品。', es: 'Objetos y productos basados en experiencias para conservar el recuerdo en casa.' },
    'Cultural events': { zh: '文化活动', es: 'Eventos culturales' },
    'Public events, themed programs, and cultural activities across different places.': { zh: '在不同地点举办的公共活动、主题项目与文化体验。', es: 'Eventos públicos, programas temáticos y actividades culturales en distintos lugares.' },
    'Creative collaborations': { zh: '创意合作', es: 'Colaboraciones creativas' },
    'Collaborations across culture, art, music, film, food, technology, and lifestyle.': { zh: '覆盖文化、艺术、音乐、电影、美食、科技与生活方式的合作。', es: 'Colaboraciones en cultura, arte, música, cine, gastronomía, tecnología y estilo de vida.' },
    'Organizations served': { zh: '合作过的机构与品牌', es: 'Organizaciones y marcas' },
    'Experience design for recognized brands and organizations across luxury, auto, finance, internet, property, media, and culture.': { zh: '为奢侈品、汽车、金融、互联网、地产、媒体与文化领域的品牌和机构设计体验。', es: 'Diseño de experiencias para marcas y organizaciones de lujo, automoción, finanzas, internet, inmobiliario, medios y cultura.' },
    'Who we have worked with': { zh: '我们合作过的品牌与机构', es: 'Con quién hemos trabajado' },
    'Cultural work across many fields.': { zh: '跨越多个领域的文化实践。', es: 'Trabajo cultural en muchos ámbitos.' },
    'Luxury and lifestyle brands:': { zh: '奢侈品与生活方式品牌：', es: 'Marcas de lujo y estilo de vida:' },
    'Cultural experiences for high-end consumer, fashion, and hospitality brands.': { zh: '为高端消费、时尚与酒店品牌提供文化体验。', es: 'Experiencias culturales para marcas de consumo premium, moda y hospitalidad.' },
    'Automotive and mobility:': { zh: '汽车与出行：', es: 'Automoción y movilidad:' },
    'Cultural programs and guest experiences for Chinese and international automotive brands.': { zh: '为中国与国际汽车品牌设计文化项目与宾客体验。', es: 'Programas culturales y experiencias para huéspedes de marcas automovilísticas chinas e internacionales.' },
    'Finance, insurance, and property:': { zh: '金融、保险与地产：', es: 'Finanzas, seguros e inmobiliario:' },
    'Cultural experiences for teams, clients, and corporate gatherings.': { zh: '为团队、客户与企业活动设计文化体验。', es: 'Experiencias culturales para equipos, clientes y encuentros corporativos.' },
    'Media, technology, and culture:': { zh: '媒体、科技与文化：', es: 'Medios, tecnología y cultura:' },
    'Work that brings culture into content, events, and storytelling.': { zh: '让文化进入内容、活动与故事表达。', es: 'Trabajo que lleva la cultura al contenido, los eventos y las historias.' },
    'Recognition for selected properties': { zh: '部分行馆获得的认可', es: 'Reconocimientos de propiedades seleccionadas' },
    'A record of design-led hospitality.': { zh: '以设计为核心的旅居实践。', es: 'Una trayectoria de hospitalidad guiada por el diseño.' },
    '180+ awards and recognitions:': { zh: '180+项奖项与认可：', es: 'Más de 180 premios y reconocimientos:' },
    'Tsingpu properties and cultural projects have received recognition across design, hospitality, cultural travel, and destination development.': { zh: '青普行馆与文化项目曾在设计、旅居、文化旅行与目的地发展领域获得认可。', es: 'Las propiedades y proyectos culturales de Tsingpu han recibido reconocimientos en diseño, hospitalidad, viajes culturales y desarrollo de destinos.' },
    'Design Hotels:': { zh: 'Design Hotels：', es: 'Design Hotels:' },
    'selected Tsingpu properties have been recognized by Design Hotels.': { zh: '部分青普行馆获得 Design Hotels 的认可。', es: 'Algunas propiedades de Tsingpu han sido reconocidas por Design Hotels.' },
    'Boutique hotel rankings:': { zh: '精品酒店榜单：', es: 'Rankings de hoteles boutique:' },
    'Tsingpu properties have appeared in hotel brand rankings and boutique-hotel lists.': { zh: '青普行馆曾出现在酒店品牌榜单与精品酒店榜单中。', es: 'Las propiedades de Tsingpu han aparecido en rankings de marcas hoteleras y listas de hoteles boutique.' },
    'For guests:': { zh: '对客人来说：', es: 'Para los huéspedes:' },
    'thoughtful design helps architecture, local life, and hospitality become part of the destination.': { zh: '用心的设计让建筑、当地生活与接待本身成为目的地体验的一部分。', es: 'Un diseño cuidado hace que la arquitectura, la vida local y la hospitalidad formen parte del destino.' },
    'From a place to a deeper journey': { zh: '从一个地方走向更深的旅程', es: 'De un lugar a un viaje más profundo' },
    "Tsingpu's place-based hospitality offers one example of how a stay can connect local knowledge, everyday life, and a slower pace.": { zh: '青普以地点为基础的旅居方式，展示了住宿如何连接地方知识、日常生活与更从容的节奏。', es: 'La hospitalidad de Tsingpu conectada con el lugar muestra cómo una estancia puede unir el conocimiento local, la vida cotidiana y un ritmo más pausado.' },
    'About Tsingpu / cultural hospitality': { zh: '关于青普 / 文化旅居', es: 'Sobre Tsingpu / hospitalidad cultural' },
    'Founder': { zh: '创始人', es: 'Fundador' },
    'Founder / Chairman': { zh: '创始人 / 董事长', es: 'Fundador / Presidente' },
    'The founder behind Tsingpu.': { zh: '青普的创始人', es: 'El fundador de Tsingpu' },
    'Wang Gongquan founded Tsingpu. His work makes space for guests to encounter local architecture, food, craft, and everyday life through a more thoughtful stay.': { zh: '王功权创立了青普。通过更从容的旅居，客人可以接触当地建筑、美食、手工艺与日常生活。', es: 'Wang Gongquan fundó Tsingpu. Su trabajo permite a los huéspedes acercarse a la arquitectura local, la comida, la artesanía y la vida cotidiana a través de una estancia más consciente.' },
    'Wang Gongquan founded Tsingpu. His background in entrepreneurship and investment is reflected in a guest experience centered on distinctive places, local culture, and the details of everyday life.': { zh: '王功权创立了青普。他的创业与投资经历，也体现在这份旅居体验对特色地点、当地文化和日常生活细节的重视。', es: 'Wang Gongquan fundó Tsingpu. Su experiencia empresarial y de inversión se refleja en una experiencia para huéspedes centrada en lugares singulares, cultura local y los detalles de la vida cotidiana.' },

    'Reply language': { zh: '回复语言', es: 'Idioma de respuesta' },
    'Chinese': { zh: '中文', es: 'Chino' },
    'English': { zh: '英文', es: 'Inglés' },
    'Spanish': { zh: '西班牙文', es: 'Español' },
    'What do you need first?': { zh: '你最需要先安排什么？', es: '¿Qué necesitas primero?' },
    'Build a practical independent travel plan': { zh: '制定一份实用的自由行计划', es: 'Crear un plan práctico de viaje independiente' },
    'Fill a free half day or transit window': { zh: '安排半天空档或转机时间', es: 'Organizar una tarde libre o una escala' },
    'Arrange selected experiences for an existing trip': { zh: '为已有行程安排选定体验', es: 'Organizar experiencias para un viaje ya planificado' },
    'Plan a private journey from the beginning': { zh: '从头规划一次私人旅行', es: 'Planificar un viaje privado desde el inicio' },
    'Add a cultural product or gift to the plan': { zh: '在行程中加入文化产品或礼物', es: 'Añadir un producto cultural o regalo al plan' },
    'Photo or video-friendly route support': { zh: '适合拍照或视频记录的路线支持', es: 'Apoyo de ruta para fotos o vídeo' },
    'Travel trade or cultural collaboration inquiry': { zh: '旅行行业或文化合作咨询', es: 'Consulta de colaboración cultural o turística' },
    'Entry city in China': { zh: '入境城市', es: 'Ciudad de entrada a China' },
    'Main place or route': { zh: '主要地点或路线', es: 'Lugar o ruta principal' },
    'Please choose one': { zh: '请选择', es: 'Elige una opción' },
    'City gateways': { zh: '城市入口', es: 'Puertas de entrada' },
    'Experiences and routes': { zh: '体验与路线', es: 'Experiencias y rutas' },
    'Travel trade and collaborations': { zh: '旅行行业与文化合作', es: 'Colaboraciones turísticas y culturales' },
    'Beijing and Western Sichuan': { zh: '北京与川西', es: 'Pekín y Sichuan occidental' },
    'Chengdu and Western Sichuan': { zh: '成都与川西', es: 'Chengdu y Sichuan occidental' },
    'Quanzhou and Tulou': { zh: '泉州与土楼', es: 'Quanzhou y Tulou' },
    'Beijing Fragrance Bead Workshop': { zh: '北京合香珠体验', es: 'Taller de cuentas aromáticas de Pekín' },
    'Beijing Pankou Knot Workshop': { zh: '北京盘扣体验', es: 'Taller de nudos Pankou en Pekín' },
    'Shanghai Urban Wellness': { zh: '上海城市文化健康之旅', es: 'Bienestar cultural urbano en Shanghái' },
    'Liyao Village Reset': { zh: '里窑村慢生活体验', es: 'Pausa cultural en la aldea Liyao' },
    'Suzhou and Yangzhou Culture': { zh: '苏州与扬州文化', es: 'Cultura de Suzhou y Yangzhou' },
    'Glacier Hot Springs': { zh: '冰川与温泉', es: 'Glaciares y aguas termales' },
    'Garze Thangka Country': { zh: '甘孜唐卡之地', es: 'La tierra del Thangka en Garze' },
    'Tibetan Highlands Explorer': { zh: '藏地高原探索', es: 'Exploración de las tierras altas tibetanas' },
    'Get a free Chinese name card': { zh: '领取免费的中文名字卡', es: 'Recibir una tarjeta de nombre chino gratis' },
    'Add a cultural product or gift': { zh: '添加文化产品或礼物', es: 'Añadir un producto cultural o regalo' },
    'Ask about a DIY kit with video guide': { zh: '咨询含视频教程的材料包', es: 'Preguntar por un kit DIY con guía en vídeo' },
    'Available time in this city or route': { zh: '在这座城市或路线上有几天？', es: '¿Cuánto tiempo tienes en esta ciudad o ruta?' },
    'Not sure yet': { zh: '还不确定', es: 'Todavía no lo sé' },
    'Half day': { zh: '半天', es: 'Medio día' },
    'One day': { zh: '一天', es: 'Un día' },
    '2 to 3 days': { zh: '2至3天', es: 'De 2 a 3 días' },
    '4 to 6 days': { zh: '4至6天', es: 'De 4 a 6 días' },
    '7 to 9 days': { zh: '7至9天', es: 'De 7 a 9 días' },
    'Custom length': { zh: '自定义天数', es: 'Duración personalizada' },
    'Arrival date or target season': { zh: '到达日期或目标季节', es: 'Fecha de llegada o temporada' },
    'What would you like to add?': { zh: '你想加入哪些内容？', es: '¿Qué te gustaría añadir?' },
    'Please suggest the right combination': { zh: '请帮我推荐合理组合', es: 'Sugiere una combinación adecuada' },
    'Hotel + car + daily route order': { zh: '酒店 + 用车 + 每日路线顺序', es: 'Hotel + coche + orden diario de la ruta' },
    'Guide / interpreter / photographer': { zh: '导游 / 翻译 / 摄影师', es: 'Guía / intérprete / fotógrafo' },
    'Scenic tickets + cultural experience': { zh: '景区门票 + 文化体验', es: 'Entradas + experiencia cultural' },
    'Food, tea, shopping, and free time': { zh: '美食、茶、购物与自由时间', es: 'Comida, té, compras y tiempo libre' },
    'Free Chinese name card or Take Home starter': { zh: '免费中文名字卡或带回家入门礼', es: 'Tarjeta de nombre chino gratis o regalo inicial' },
    'Product gift or Take Home add-on': { zh: '文化产品礼物或带回家加购', es: 'Regalo cultural o complemento para llevar' },
    'Main interest': { zh: '主要兴趣', es: 'Interés principal' },
    'First-time China cultural route': { zh: '第一次中国文化旅行', es: 'Primera ruta cultural por China' },
    'Hotel, car, scenic spot, or experience help': { zh: '酒店、用车、景区或体验安排', es: 'Ayuda con hotel, coche, entradas o experiencias' },
    'Free half day or transit stop': { zh: '半天空档或中转停留', es: 'Tarde libre o escala' },
    'Culture and heritage': { zh: '文化与遗产', es: 'Cultura y patrimonio' },
    'Food and daily life': { zh: '美食与日常生活', es: 'Comida y vida cotidiana' },
    'Photography': { zh: '摄影', es: 'Fotografía' },
    'Craft workshops and Take Home products': { zh: '手工体验与带回家产品', es: 'Talleres artesanales y productos para llevar' },
    'Beijing fragrance bead or Pankou knot workshop': { zh: '北京合香珠或盘扣体验', es: 'Taller de cuentas aromáticas o nudos Pankou' },
    'Group size': { zh: '人数', es: 'Tamaño del grupo' },
    'What should we prepare for you?': { zh: '你希望我们为你准备什么？', es: '¿Qué quieres que preparemos para ti?' },
    'Send plan inquiry': { zh: '发送行程咨询', es: 'Enviar consulta de viaje' },
    'Shanghai & Jiangnan cultural wellness': { zh: '上海与江南文化健康体验', es: 'Bienestar cultural en Shanghái y Jiangnan' },
    'We review the order of the route first, then confirm hotels, cars, guides, scenic tickets, workshop capacity, product stock, and final pricing before payment.': { zh: '我们会先检查路线顺序，再在付款前确认酒店、用车、导游、门票、体验容量、产品库存和最终价格。', es: 'Primero revisamos el orden de la ruta y, antes del pago, confirmamos hoteles, vehículos, guías, entradas, plazas, existencias y precio final.' },
    'What should we prepare?': { zh: '你希望我们准备什么？', es: '¿Qué debemos preparar?' },
    'Product or kit': { zh: '产品或材料包', es: 'Producto o kit' },
    'Order type': { zh: '订单类型', es: 'Tipo de pedido' },
    'Free digital name card': { zh: '免费的数字中文名字卡', es: 'Tarjeta digital de nombre chino gratis' },
    'One shipped product': { zh: '一件寄送产品', es: 'Un producto enviado' },
    'Material kit with video guide': { zh: '含视频教程的材料包', es: 'Kit de materiales con guía en vídeo' },
    'Gift box': { zh: '礼盒', es: 'Caja regalo' },
    'Custom gift or bulk order': { zh: '定制礼物或批量订单', es: 'Regalo personalizado o pedido grande' },
    'Not sure, please suggest': { zh: '不确定，请推荐', es: 'No estoy seguro, sugiere una opción' },
    'Quantity': { zh: '数量', es: 'Cantidad' },
    'Shipping country or region': { zh: '收货国家或地区', es: 'País o región de envío' },
    'Future travel interest': { zh: '未来旅行兴趣', es: 'Interés de viaje futuro' },
    'Use case': { zh: '使用场景', es: 'Uso previsto' },
    'Personal': { zh: '个人使用', es: 'Uso personal' },
    'Gift': { zh: '送礼', es: 'Regalo' },
    'Family activity': { zh: '家庭活动', es: 'Actividad familiar' },
    'Private group': { zh: '私人团体', es: 'Grupo privado' },
    'Corporate cultural gift': { zh: '企业文化礼品', es: 'Regalo cultural corporativo' },
    'Email or preferred contact': { zh: '邮箱或首选联系方式', es: 'Correo o contacto preferido' },
    'Request name card or checkout': { zh: '申请名字卡或付款链接', es: 'Solicitar tarjeta de nombre o pago' },
    'Your English name': { zh: '你的英文名字', es: 'Tu nombre en inglés' },
    'Pronunciation or nickname': { zh: '发音或昵称', es: 'Pronunciación o apodo' },
    'China theme you like': { zh: '你喜欢的中国主题', es: 'Tema chino que te interesa' },
    'A few words about you': { zh: '简单介绍一下你自己', es: 'Unas palabras sobre ti' },
    'Request free name card': { zh: '申请免费名字卡', es: 'Solicitar tarjeta de nombre gratis' },
    'Product detail': { zh: '产品详情', es: 'Detalle del producto' },
    'Why it fits': { zh: '为什么适合你', es: 'Por qué encaja contigo' },
    'Checkout request': { zh: '付款链接申请', es: 'Solicitud de pago' },
    'Selected product': { zh: '已选产品', es: 'Producto seleccionado' },
    'Country or region': { zh: '国家或地区', es: 'País o región' },
    'Preferred timing': { zh: '希望时间', es: 'Momento preferido' },
    'Prepare checkout request': { zh: '准备付款申请', es: 'Preparar solicitud de pago' },
    'Preferred route': { zh: '首选路线', es: 'Ruta preferida' },
    'Travel window': { zh: '旅行时间', es: 'Periodo de viaje' },
    'Preferred pace': { zh: '旅行节奏', es: 'Ritmo preferido' },
    'Cultural interests': { zh: '文化兴趣', es: 'Intereses culturales' },
    'Continue to main inquiry': { zh: '继续填写主咨询表单', es: 'Continuar con la consulta principal' },
    'Get a free Chinese name': { zh: '免费起一个中文名', es: 'Obtén un nombre chino gratis' },
    'Shop starter shelf': { zh: '浏览入门产品', es: 'Explorar productos iniciales' },
    'Request checkout link': { zh: '申请付款链接', es: 'Solicitar enlace de pago' },
    'Free name card': { zh: '免费名字卡', es: 'Tarjeta de nombre gratis' },
    'Take Home Basket': { zh: '带回家购物车', es: 'Cesta de Cultura para llevar' },
    'Purchase ladder': { zh: '购买路径', es: 'Ruta de compra' },
    'Choose up to three cultural products. We will confirm stock, shipping, included video-guide access when relevant, and checkout before payment.': { zh: '最多选择三件文化产品。我们会在付款前确认库存、寄送、适用的视频教程和付款链接。', es: 'Elige hasta tres productos culturales. Confirmaremos existencias, envío, acceso a vídeo cuando corresponda y pago antes de cobrar.' },
    'Estimated product subtotal': { zh: '预计商品小计', es: 'Subtotal estimado' },
    'Planning a China trip later? Tell us about this purchase and we can discuss a related welcome benefit or experience upgrade with your travel plan.': { zh: '以后计划来中国旅行？告诉我们这次购买，我们可以结合你的行程讨论欢迎权益或体验升级。', es: '¿Planeas viajar a China más adelante? Cuéntanos esta compra y podremos hablar de un beneficio de bienvenida o una mejora de experiencia relacionada con tu viaje.' },
    'From $0': { zh: '起价 $0', es: 'Desde $0' },
    'Email': { zh: '邮箱', es: 'Correo electrónico' },
    'Partnership inquiry': { zh: '合作咨询', es: 'Consulta de colaboración' },
    'Beijing heritage': { zh: '北京文化遗产', es: 'Patrimonio de Pekín' },
    'Jiangnan slow living': { zh: '江南慢生活', es: 'Vida pausada en Jiangnan' },
    'Western Sichuan highland': { zh: '川西高原', es: 'Tierras altas de Sichuan occidental' },
    'Tea and seasonal culture': { zh: '茶与四时文化', es: 'Té y cultura estacional' },
    'Craft and handwork': { zh: '手工艺与手作', es: 'Artesanía y trabajo manual' },
    'Nature and mountains': { zh: '自然与山川', es: 'Naturaleza y montañas' },
    'Please suggest': { zh: '请帮我推荐', es: 'Sugiere una opción' },
    'Free Chinese Name Card': { zh: '免费中文名字卡', es: 'Tarjeta de nombre chino gratis' },
    'Beijing Royal Fragrance Plaque And Bracelet Box': { zh: '北京皇家香牌与手串礼盒', es: 'Caja de placa aromática real y pulsera de Pekín' },
    'Beijing Botanical Bead-Making Kit': { zh: '北京草木合香珠材料包', es: 'Kit de cuentas aromáticas botánicas de Pekín' },
    'Chinese Name + Seal Starter Kit': { zh: '中文名字与人名章入门套装', es: 'Kit inicial de nombre chino y sello personal' },
    'Take Home Starter Gift Box': { zh: '带回家的文化入门礼盒', es: 'Caja regalo cultural para empezar' },
    'Botanical Sachet Material Kit': { zh: '草木香囊材料包', es: 'Kit de saquito aromático botánico' },
    'Mother-of-Pearl Hairpin Gift Set': { zh: '螺钿发簪礼盒', es: 'Set regalo de horquilla con nácar' },
    'Beijing Pankou Knot Craft Kit': { zh: '北京盘扣手作材料包', es: 'Kit de nudos Pankou de Pekín' },
    'Western Sichuan Thangka Line And Pigment Kit': { zh: '川西唐卡线稿与矿物颜料材料包', es: 'Kit de líneas y pigmentos de Thangka de Sichuan occidental' },
    'Persimmon Travel Tea Set': { zh: '柿子祝福旅行茶具', es: 'Juego de té de viaje con bendición de caqui' },
    'Suzhou Embroidery Starter Kit': { zh: '苏州刺绣入门材料包', es: 'Kit inicial de bordado de Suzhou' },
    'Yangzhou Movable Type Starter Kit': { zh: '扬州活字印刷入门材料包', es: 'Kit inicial de tipos móviles de Yangzhou' },
    'Yangzhou Seal Carving Starter Kit': { zh: '扬州篆刻入门材料包', es: 'Kit inicial de tallado de sellos de Yangzhou' },
    'Fujian Tulou Architecture Model Kit': { zh: '福建土楼建筑模型材料包', es: 'Kit de maqueta arquitectónica de Tulou de Fujian' },
    'Royal Fragrance Plaque And Bracelet Box': { zh: '皇家香牌与手串礼盒', es: 'Caja de placa aromática real y pulsera' },
    'Botanical Bead-Making Kit': { zh: '草木合香珠材料包', es: 'Kit de cuentas aromáticas botánicas' },
    'Pankou Knot Craft Kit': { zh: '盘扣手作材料包', es: 'Kit de nudos Pankou' },
    'Thangka Line And Pigment Kit': { zh: '唐卡线稿与矿物颜料材料包', es: 'Kit de líneas y pigmentos de Thangka' },
    'Fujian Tulou': { zh: '福建土楼', es: 'Tulou de Fujian' },
    'Suzhou': { zh: '苏州', es: 'Suzhou' },
    'Yangzhou': { zh: '扬州', es: 'Yangzhou' },
    'TCM / Tibetan wellness': { zh: '中医文化与藏地健康之旅', es: 'Bienestar cultural TCM y tibetano' },
    'Not planning travel yet': { zh: '暂时还没有旅行计划', es: 'Todavía no estoy planificando el viaje' },
    'Free digital name card': { zh: '免费的数字中文名字卡', es: 'Tarjeta digital de nombre chino gratis' },
    'One shipped product': { zh: '一件寄送产品', es: 'Un producto enviado' },
    'Material kit with video guide': { zh: '含视频教程的材料包', es: 'Kit de materiales con guía en vídeo' },
    'Custom gift or bulk order': { zh: '定制礼物或批量订单', es: 'Regalo personalizado o pedido grande' },
    'Not sure, please suggest': { zh: '不确定，请帮我推荐', es: 'No estoy seguro, sugiere una opción' },
    'View gift box': { zh: '查看礼盒', es: 'Ver caja regalo' },
    'View name kit': { zh: '查看名字套装', es: 'Ver kit de nombre' },
    'View Thangka kit': { zh: '查看唐卡材料包', es: 'Ver kit de Thangka' },
    'View tea set': { zh: '查看茶具', es: 'Ver juego de té' },
    'Keep shopping': { zh: '继续选购', es: 'Seguir comprando' },
    'Remove': { zh: '移除', es: 'Quitar' },
    'The starter basket is limited to three products. Remove one item before adding another.': { zh: '入门购物车最多选择三件产品。请先移除一件再添加。', es: 'La cesta inicial permite tres productos. Quita uno antes de añadir otro.' },
    'Plan a wellness journey': { zh: '规划文化健康之旅', es: 'Planificar un viaje de bienestar cultural' },
    'Read FAQ first': { zh: '先了解常见问题', es: 'Leer las preguntas frecuentes' },
    'See Beijing experiences': { zh: '查看北京体验', es: 'Ver experiencias de Pekín' },
    'See Shanghai & Jiangnan': { zh: '查看上海与江南', es: 'Ver Shanghái y Jiangnan' },
    'See Chengdu & Western Sichuan': { zh: '查看成都与川西', es: 'Ver Chengdu y Sichuan occidental' },
    'View plateau rhythms': { zh: '查看高原路线', es: 'Ver ritmos de la meseta' },
    'Explore the Thangka route': { zh: '探索唐卡路线', es: 'Explorar la ruta Thangka' },
    'Open Take Home page': { zh: '打开带回家的文化', es: 'Abrir Cultura para llevar' },
    'Ask about products': { zh: '咨询产品', es: 'Preguntar por productos' },
    'Plan the journey': { zh: '规划这段旅程', es: 'Planificar el viaje' },
    'Start here': { zh: '从这里开始', es: 'Empieza aquí' },
    'What to expect': { zh: '你将获得什么体验', es: 'Qué puedes esperar' },
    'What to expect from the journey.': { zh: '了解这段旅程会带来什么。', es: 'Qué puedes esperar del viaje.' },
    'Culture, relaxation, and place come first.': { zh: '文化、放松与地点体验最重要。', es: 'La cultura, la calma y el lugar son lo primero.' },
    'Tea, incense, food, craft, hot springs, and a slower travel rhythm are part of the journey. Medical care is not.': { zh: '茶、香、美食、手工艺、温泉和更从容的旅行节奏，构成了这段旅程。这里不提供医疗护理。', es: 'El viaje incluye té, incienso, comida, artesanía, aguas termales y un ritmo más pausado. No es atención médica.' },
    'No medical outcomes': { zh: '不承诺医疗结果', es: 'Sin resultados médicos prometidos' },
    'Is this for you?': { zh: '这适合你吗？', es: '¿Es para ti?' },
    'Before you book': { zh: '预订前请了解', es: 'Antes de reservar' },
    'Choose your pace': { zh: '选择你的节奏', es: 'Elige tu ritmo' },
    'What you can experience along the way.': { zh: '旅途中你可以体验什么。', es: 'Qué puedes experimentar durante el viaje.' },
    'A cultural introduction to TCM': { zh: '从文化角度认识中医', es: 'Una introducción cultural a la medicina tradicional china' },
    'A place-based wellness break': { zh: '在真实地点放慢脚步', es: 'Una pausa de bienestar conectada con el lugar' },
    'What you will find:': { zh: '你会体验到：', es: 'Encontrarás:' },
    'What you will not find:': { zh: '你不会遇到：', es: 'No encontrarás:' },
    'On this journey:': { zh: '在这段旅程中：', es: 'En este viaje:' },
    'The difference:': { zh: '不同之处：', es: 'La diferencia:' },
    'For personal health questions:': { zh: '如有个人健康问题：', es: 'Para preguntas personales de salud:' },
    'Medical care:': { zh: '医疗护理：', es: 'Atención médica:' },
    'Personal health questions:': { zh: '个人健康问题：', es: 'Preguntas personales de salud:' },
    'Urgent or unstable health needs:': { zh: '紧急或不稳定的健康状况：', es: 'Necesidades de salud urgentes o inestables:' },
    'What we offer:': { zh: '我们提供的是：', es: 'Lo que ofrecemos:' },

    'Start Small': { zh: '从小处开始', es: 'Empieza pequeño' },
    'Free cultural doorway': { zh: '免费的文化入口', es: 'Una puerta cultural gratuita' },
    'First destination products': { zh: '第一批目的地产品', es: 'Primeros productos de destino' },
    'Share & Invite': { zh: '分享与邀请', es: 'Comparte e invita' },
    'Wellness Take Home': { zh: '带回家的文化健康', es: 'Bienestar cultural para llevar' },
    'Before and after travel': { zh: '旅行前与旅行后', es: 'Antes y después del viaje' },
    'Destination product shelf': { zh: '目的地产品架', es: 'Catálogo de productos de destino' },
    'Cultural meaning': { zh: '文化含义', es: 'Significado cultural' },
    'Name card / product checkout request': { zh: '名字卡 / 产品付款申请', es: 'Tarjeta de nombre / solicitud de pago' },
    'Begin with a Chinese name.': { zh: '从一个中文名字开始。', es: 'Empieza con un nombre chino.' },
    'Request a checkout link.': { zh: '申请付款链接。', es: 'Solicita un enlace de pago.' },
    'A cultural wellness journey, not a medical program.': { zh: '文化健康之旅，不是医疗项目。', es: 'Un viaje de bienestar cultural, no un programa médico.' },
    'Clear answers before you travel.': { zh: '出发前先了解清楚。', es: 'Respuestas claras antes de viajar.' },
    'Before you choose': { zh: '选择之前', es: 'Antes de elegir' },
    'Simple Comparisons': { zh: '简单对比', es: 'Comparaciones sencillas' },
    'Who it is for': { zh: '适合谁', es: 'Para quién es' },
    'Three lenses': { zh: '三种理解方式', es: 'Tres miradas' },
    'Signature journeys': { zh: '代表性路线', es: 'Viajes destacados' },
    'Experience menu': { zh: '体验菜单', es: 'Menú de experiencias' },
    'Places and moments': { zh: '地点与片段', es: 'Lugares y momentos' },
    'The guide is cultural, not clinical.': { zh: '这是文化向导，不是医疗向导。', es: 'La guía es cultural, no clínica.' },
    'Products and learning': { zh: '产品与学习', es: 'Productos y aprendizaje' },

    'Language switched to English. Forms and page controls are now in English.': { zh: '语言已切换为英文，页面控件和表单现在使用英文。', es: 'El idioma cambió a inglés. Los controles y formularios están en inglés.' },
    'Language switched to Chinese. Forms and page controls are now in Chinese.': { zh: '语言已切换为中文，页面控件和表单现在使用中文。', es: 'El idioma cambió a chino. Los controles y formularios están en chino.' },
    'Language switched to Spanish. Forms and page controls are now in Spanish.': { zh: '语言已切换为西班牙文，页面控件和表单现在使用西班牙文。', es: 'El idioma cambió a español. Los controles y formularios están en español.' },
    'Continue to inquiry': { zh: '继续填写咨询', es: 'Continuar con la consulta' },
    'Your language preference is saved across the site.': { zh: '你的语言选择已保存，进入其他页面也会继续生效。', es: 'Tu idioma se guarda y seguirá activo en las demás páginas.' },
    'Opening your email app with the inquiry details.': { zh: '正在打开邮箱，并带入咨询内容。', es: 'Abriendo tu aplicación de correo con los datos de la consulta.' },
    'Please email hello@discoverrealchina.com with your route, product, timing, and group size.': { zh: '请发送邮件至 hello@discoverrealchina.com，并写明路线、产品、时间和人数。', es: 'Escribe a hello@discoverrealchina.com con tu ruta, producto, fechas y tamaño del grupo.' },
    'Your basket is empty.': { zh: '购物车还是空的。', es: 'Tu cesta está vacía.' },
    'Clear basket': { zh: '清空购物车', es: 'Vaciar cesta' },
    'Checkout link unavailable until you add an item.': { zh: '添加商品后才能申请付款链接。', es: 'El enlace de pago estará disponible cuando añadas un producto.' },
    'Add to basket': { zh: '加入购物车', es: 'Añadir a la cesta' },
    'Open detail page': { zh: '打开详情页', es: 'Abrir detalle' },
    'View detail': { zh: '查看详情', es: 'Ver detalle' },

    'Start your China journey before you travel.': { zh: '还没出发，就先把中国文化带回家。', es: 'Empieza tu viaje por China antes de viajar.' },
    'Begin with one object, one story, or one kit.': { zh: '从一件物品、一个故事或一个材料包开始。', es: 'Empieza con un objeto, una historia o un kit.' },
    'Every box leads back to a real place.': { zh: '每个盒子都通向一个真实的地方。', es: 'Cada caja conduce a un lugar real.' },
    'Choose the culture you want to keep close.': { zh: '选择你想留在身边的中国文化。', es: 'Elige la cultura que quieres tener cerca.' },
    'Tell us what you want to start with.': { zh: '告诉我们你想从什么开始。', es: 'Cuéntanos con qué quieres empezar.' },
    'Tell us the pace and culture you want.': { zh: '告诉我们你想要的节奏与文化体验。', es: 'Cuéntanos qué ritmo y cultura buscas.' },
    'Start with the map': { zh: '从地图开始', es: 'Empieza con el mapa' },
    'Featured destinations': { zh: '目的地精选', es: 'Destinos destacados' },
    'Ways to begin': { zh: '开始方式', es: 'Formas de empezar' },
    'Recommended Ways to Begin': { zh: '推荐的开始方式', es: 'Formas recomendadas de empezar' },
    'Start with one clear day in Beijing.': { zh: '从北京清晰的一天开始。', es: 'Empieza con un día claro en Pekín.' },
    'This is a simple first step for guests who want to understand Beijing through everyday life, a local meal, and one hands-on cultural experience. We can extend it into the Great Wall and Ruiyun after we know your dates.': { zh: '这是理解北京的简单第一步：从日常生活、当地一餐和一项亲手参与的文化体验开始。知道你的日期后，我们还可以把行程延伸到长城和瑞云。', es: 'Este es un primer paso sencillo para conocer Pekín a través de la vida cotidiana, una comida local y una experiencia cultural práctica. Cuando sepamos tus fechas, podemos ampliarlo a la Gran Muralla y Ruiyun.' },
    'Recommended first step': { zh: '推荐的第一步', es: 'Primer paso recomendado' },
    '1 day': { zh: '1天', es: '1 día' },
    'Beijing One-Day Cultural Experience': { zh: '北京一日文化体验', es: 'Experiencia cultural de un día en Pekín' },
    'A practical first day for first-time visitors: walk through hutong life, share a local meal, and choose one clear workshop so Beijing feels personal rather than rushed.': { zh: '适合第一次来北京的客人：走进胡同日常，享用一顿当地餐食，再选择一项清晰的体验课，让北京变得亲切而不匆忙。', es: 'Un primer día práctico para quienes visitan Pekín por primera vez: caminar por la vida de los hutongs, compartir una comida local y elegir un taller claro para sentir la ciudad sin prisas.' },
    'Start / end': { zh: '开始 / 结束', es: 'Inicio / fin' },
    'Start in central Beijing; finish in central Beijing or continue onward by arrangement.': { zh: '从北京市区开始；在市区结束，或根据安排继续前往其他地点。', es: 'Comienza en el centro de Pekín; termina en la ciudad o continúa hacia otro lugar según la planificación.' },
    'For': { zh: '适合', es: 'Para' },
    'First-time visitors, short stays, and guests who want a clear cultural beginning.': { zh: '第一次来中国的客人、短暂停留的客人，以及希望有一个清晰文化入口的客人。', es: 'Visitantes primerizos, estancias cortas y huéspedes que buscan un comienzo cultural claro.' },
    'What it includes': { zh: '包含内容', es: 'Incluye' },
    'Hutong and everyday-life walk, one local meal, and a choice of fragrance bead making or a teacher-led Pankou knot workshop.': { zh: '胡同与日常生活漫步、一顿当地餐食，以及合香珠制作或老师带领的盘扣体验二选一。', es: 'Paseo por los hutongs y la vida cotidiana, una comida local y la elección entre elaborar cuentas aromáticas o participar en un taller Pankou con profesor.' },
    'Ask for current pricing. Date, group size, teacher availability, and vehicle needs are confirmed before payment.': { zh: '当前价格请咨询。日期、人数、老师档期和用车需求会在付款前确认。', es: 'Solicita el precio vigente. Confirmaremos fechas, tamaño del grupo, disponibilidad del profesor y transporte antes del pago.' },
    'Plan this journey': { zh: '规划这段旅程', es: 'Planificar este viaje' },
    'Current pricing by inquiry': { zh: '当前价格按咨询确认', es: 'Precio vigente bajo consulta' },
    '3 days / 2 nights': { zh: '3天2晚', es: '3 días / 2 noches' },
    'Airport to Ruiyun': { zh: '机场到瑞云', es: 'Del aeropuerto a Ruiyun' },
    'Featured first route': { zh: '首推入门路线', es: 'Ruta inicial destacada' },
    'Beijing Great Wall & Ruiyun First Journey': { zh: '北京长城与瑞云入门之旅', es: 'Primera ruta de la Gran Muralla y Ruiyun en Pekín' },
    'A clear first Beijing package for guests who want the route order decided in advance: arrive at the airport, settle into Ruiyun Winery, experience the Great Wall after dark when operating hours allow, then return to the same calm base before a city chapter and one hands-on craft experience.': { zh: '为希望提前确定行程顺序的客人设计的北京入门套餐：机场抵达后前往瑞云酒庄，开放时间和季节允许时体验夜长城，再回到同一处安静的基地，完成城市文化章节和一项亲手参与的手作体验。', es: 'Un paquete inicial de Pekín para quienes prefieren tener el orden decidido: llegada al aeropuerto, instalación en Ruiyun, visita nocturna a la Gran Muralla cuando el horario y la temporada lo permitan, y regreso a la misma base tranquila antes de conocer la ciudad y participar en una experiencia artesanal.' },
    'Day 1': { zh: '第1天', es: 'Día 1' },
    'Airport pickup → Ruiyun Winery check-in → evening Great Wall visit when the season, operating hours, and tickets allow → return to Ruiyun for dinner and overnight. If an evening visit is unavailable, we arrange the closest sunset or sunrise alternative.': { zh: '机场接机 → 入住瑞云酒庄 → 在季节、开放时间和门票允许时体验夜长城 → 返回瑞云用晚餐并住宿。如果夜间开放不适合当日安排，我们会改为最接近的日落或日出方案。', es: 'Recogida en el aeropuerto → llegada y check-in en Ruiyun → visita nocturna a la Gran Muralla cuando la temporada, el horario y las entradas lo permitan → regreso a Ruiyun para cenar y pasar la noche. Si no es posible visitarla de noche, organizaremos la alternativa más cercana al atardecer o al amanecer.' },
    'Day 2': { zh: '第2天', es: 'Día 2' },
    'Breakfast at Ruiyun → one city heritage chapter, such as the Forbidden City or Temple of Heaven, plus a hutong or local-meal stop → return to Ruiyun for a slower evening.': { zh: '瑞云早餐 → 选择一个城市文化章节，例如故宫或天坛，并加入胡同或当地餐食停留 → 返回瑞云，享受更从容的夜晚。', es: 'Desayuno en Ruiyun → un capítulo de patrimonio urbano, como la Ciudad Prohibida o el Templo del Cielo, junto con una parada en un hutong o una comida local → regreso a Ruiyun para una tarde más tranquila.' },
    'Day 3': { zh: '第3天', es: 'Día 3' },
    'Slow breakfast and vineyard rhythm → choose one teacher-led fragrance bead-making or Pankou knot workshop → transfer to the airport or your next Beijing stay.': { zh: '从容早餐与葡萄园慢行 → 合香珠制作或老师带领的盘扣体验二选一 → 前往机场或下一处北京住宿。', es: 'Desayuno tranquilo y paseo por el viñedo → elige entre un taller guiado de cuentas aromáticas o de nudos Pankou → traslado al aeropuerto o a tu siguiente alojamiento en Pekín.' },
    'Package includes': { zh: '套餐包含', es: 'El paquete incluye' },
    'Airport transfers, 2 nights at Ruiyun Winery, route planning, the selected Great Wall and city chapters, one craft workshop choice, and the meals and guide/interpreter support listed in the final quote.': { zh: '机场接送、瑞云酒庄2晚住宿、路线规划、选定的长城与城市文化章节、一项手作体验，以及最终报价中列明的餐食和导游/翻译支持。', es: 'Traslados de aeropuerto, 2 noches en Ruiyun, planificación de la ruta, los capítulos seleccionados de la Gran Muralla y la ciudad, un taller artesanal a elegir y las comidas y el apoyo de guía/intérprete indicados en el presupuesto final.' },
    'Reference price': { zh: '参考价格', es: 'Precio de referencia' },
    'US$1,500-1,800 per private group of 4. This is a planning reference; the final total is confirmed after dates, room category, vehicle, tickets, teacher, and meal availability are checked.': { zh: '4人私享团参考价：US$1,500-1,800。这是行程规划参考价；日期、房型、车辆、门票、老师和餐食资源确认后，才会确认最终合计价格。', es: 'Precio de referencia: US$1.500-1.800 por grupo privado de 4 personas. Es una referencia de planificación; el total final se confirma después de comprobar fechas, categoría de habitación, vehículo, entradas, profesor y disponibilidad de comidas.' },
    'Request dates and final quote': { zh: '提交日期并获取最终报价', es: 'Solicitar fechas y presupuesto final' },
    'Hailuogou Glacier & Hot Springs Weekend': { zh: '海螺沟冰川与温泉周末之旅', es: 'Fin de semana de glaciares y aguas termales en Hailuogou' },
    'A focused first Western Sichuan journey from Chengdu: one mountain road, two nights beside the glacier country, a hot-spring stay, and enough time to enjoy the landscape without forcing the whole plateau into one short trip.': { zh: '从成都出发的川西入门路线：一条清晰的山地路线、冰川地区两晚住宿、温泉体验，以及不把整个高原塞进短行程的从容时间。', es: 'Una primera ruta concentrada por Sichuan occidental desde Chengdu: una carretera de montaña, dos noches en la región glaciar, una estancia con aguas termales y tiempo suficiente para disfrutar del paisaje sin intentar abarcar toda la meseta.' },
    'Start in Chengdu; travel by private vehicle to Hailuogou; return to Chengdu on Day 3.': { zh: '从成都出发；乘坐私家车前往海螺沟；第3天返回成都。', es: 'Salida desde Chengdu; traslado privado a Hailuogou; regreso a Chengdu el día 3.' },
    'First-time Western Sichuan visitors, short-break travelers, and guests who want mountain scenery with a manageable pace.': { zh: '适合第一次到川西、短途度假，以及希望以适中节奏欣赏山地景观的客人。', es: 'Para quienes visitan Sichuan occidental por primera vez, viajeros de escapada corta y huéspedes que buscan paisaje de montaña a un ritmo manejable.' },
    'Chengdu pickup → drive toward Hailuogou → local lunch in Moxi → check in at Xiangyun Cliff Hot Spring Hotel → hot spring evening and Moxi old-town walk.': { zh: '成都接送 → 驱车前往海螺沟 → 磨西当地午餐 → 入住翔云悬崖温泉酒店 → 温泉夜晚与磨西古镇漫步。', es: 'Recogida en Chengdu → viaje hacia Hailuogou → almuerzo local en Moxi → check-in en Xiangyun Cliff Hot Spring Hotel → tarde de aguas termales y paseo por el casco antiguo de Moxi.' },
    'Hailuogou glacier and forest day, with the scenic cable-car and park transport arranged according to the weather and whether the scenic area is open → return for a hot-spring evening.': { zh: '海螺沟冰川与森林全天体验，缆车和景区交通根据天气与景区是否开放安排 → 返回酒店享受温泉夜晚。', es: 'Día completo entre glaciares y bosques de Hailuogou; el teleférico y el transporte del parque se organizan según el clima y si el área está abierta → regreso al hotel para una tarde de aguas termales.' },
    'Slow breakfast and hotel time → return to Chengdu after lunch, arriving around the late afternoon subject to road conditions.': { zh: '从容早餐与酒店时光 → 午餐后返回成都，抵达时间根据道路情况约在下午晚些时候。', es: 'Desayuno tranquilo y tiempo en el hotel → regreso a Chengdu después del almuerzo, con llegada a última hora de la tarde según las condiciones de la carretera.' },
    'Reference price: from CNY 2,680 per person. The final price depends on your dates, room type, vehicle, tickets, meals, and road conditions.': { zh: '参考价格：每人2,680元起。最终价格取决于日期、房型、车辆、门票、餐食和道路情况。', es: 'Precio de referencia: desde CNY 2.680 por persona. El precio final depende de tus fechas, el tipo de habitación, el vehículo, las entradas, las comidas y las condiciones de la carretera.' },
    'Private vehicle from Chengdu, 2 nights at Xiangyun Cliff Hot Spring Hotel, breakfast, listed meals, Hailuogou park tickets and cable-car/park transport when operating, hot-spring access, travel insurance, and a vehicle oxygen bottle.': { zh: '成都出发的私家车、翔云悬崖温泉酒店2晚、早餐、列明的餐食、海螺沟景区门票及运营时的缆车/景区交通、温泉使用、旅行保险和车载氧气瓶。', es: 'Vehículo privado desde Chengdu, 2 noches en Xiangyun Cliff Hot Spring Hotel, desayunos, comidas indicadas, entradas al parque de Hailuogou y teleférico/transporte del parque cuando estén operativos, acceso a aguas termales, seguro de viaje y una botella de oxígeno en el vehículo.' },
    'This is a Hailuogou route, not a three-day combination of Chengdu, Garze, Daocheng, and the whole Western Sichuan loop. Weather, road conditions, altitude pacing, hotel, vehicle, and guide availability are confirmed before payment.': { zh: '这是海螺沟路线，不是把成都、甘孜、稻城和整个川西环线塞进三天。天气、道路、海拔节奏、酒店、车辆和导游档期会在付款前确认。', es: 'Esta es una ruta de Hailuogou, no una combinación de Chengdu, Garze, Daocheng y todo el circuito de Sichuan occidental en tres días. El clima, las carreteras, el ritmo de altitud, el hotel, el vehículo y la disponibilidad del guía se confirman antes del pago.' },
    'Reference price from CNY 2,680 per person': { zh: '参考价格：每人2,680元起', es: 'Precio de referencia: desde CNY 2.680 por persona' },
    'Start with one city-to-village day.': { zh: '从城市到村落的一天开始。', es: 'Empieza con un día de ciudad a aldea.' },
    'This is the clearest first Shanghai product: begin with the city, then cross into Liyao Village for fields, water, handwork, tea, and a slower Jiangnan rhythm. Choose a one-day version or stay overnight.': { zh: '这是最清晰的上海入门产品：先从城市开始，再进入李窑村的田野、水系、手作、茶与更慢的江南节奏。可以选择一日版，也可以住一晚。', es: 'Este es el producto inicial más claro de Shanghái: empieza en la ciudad y después entra en Liyao, entre campos, agua, artesanía, té y un ritmo de Jiangnan más lento. Elige la versión de un día o quédate una noche.' },
    '1 day / 2 days 1 night': { zh: '1日 / 2天1晚', es: '1 día / 2 días y 1 noche' },
    'Shanghai + Liyao Village Reset': { zh: '上海 + 李窑村落慢行', es: 'Pausa entre Shanghái y la aldea de Liyao' },
    'A practical city-to-village introduction to Jiangnan: start in Shanghai, then move into Liyao\'s fields, water, renovated architecture, small studios, tea, and handwork. Add one quiet night when your schedule allows.': { zh: '一条从城市进入村落的江南入门路线：从上海开始，再走进李窑的田野、水系、改造建筑、小型工作室、茶与手作。如果时间允许，可以安静住一晚。', es: 'Una introducción práctica a Jiangnan de la ciudad a la aldea: empieza en Shanghái y entra en los campos, el agua, la arquitectura renovada, los pequeños estudios, el té y la artesanía de Liyao. Añade una noche tranquila si tu agenda lo permite.' },
    'Start at your Shanghai hotel or airport-friendly arrival point → travel to Liyao → return to Shanghai, or continue to Suzhou by arrangement.': { zh: '从上海酒店或方便机场衔接的抵达点出发 → 前往李窑 → 返回上海，或按安排继续前往苏州。', es: 'Salida desde tu hotel en Shanghái o un punto de llegada cómodo desde el aeropuerto → viaje a Liyao → regreso a Shanghái o continuación hacia Suzhou según lo acordado.' },
    'First-time Shanghai visitors, short-stay guests, and travelers who want to see the contrast between a global city and Jiangnan village life.': { zh: '适合第一次到上海、短暂停留，以及想感受国际都市与江南村落生活反差的客人。', es: 'Para quienes visitan Shanghái por primera vez, tienen una estancia corta y quieren descubrir el contraste entre una ciudad global y la vida de una aldea de Jiangnan.' },
    'Shanghai pickup → a short city introduction through tea, architecture, or old-street life → travel to Liyao → village walk through fields, water, renovated buildings, studios, and photography points.': { zh: '上海接送 → 通过茶、建筑或老街生活完成简短城市导入 → 前往李窑 → 漫步田野、水系、改造建筑、工作室与摄影点。', es: 'Recogida en Shanghái → breve introducción urbana a través del té, la arquitectura o la vida de las calles antiguas → viaje a Liyao → paseo por campos, agua, edificios renovados, estudios y puntos de fotografía.' },
    'Choose one scheduled tea, incense/sachet, or handwork experience, followed by a slow local meal and time to stay with the place rather than rush between sights.': { zh: '选择一项已排期的茶、香/香囊或手作体验，之后享用一顿从容的当地餐食，把时间留给地方本身，而不是匆忙赶景点。', es: 'Elige una experiencia programada de té, incienso/saquito aromático o artesanía, seguida de una comida local tranquila y tiempo para permanecer en el lugar sin correr entre visitas.' },
    'Quiet dinner → a slower morning in Liyao → breakfast and return to Shanghai, or continue toward Suzhou.': { zh: '安静晚餐 → 李窑更慢的清晨 → 早餐后返回上海，或继续前往苏州。', es: 'Cena tranquila → una mañana más lenta en Liyao → desayuno y regreso a Shanghái o continuación hacia Suzhou.' },
    'US$800-1,400 per private group of 2-4 for the 1-day / 2-day 1-night direction. Final pricing depends on dates, overnight choice, vehicle, teacher, meals, and venue availability.': { zh: '1日版 / 2天1晚方向，2-4人私享团参考价为US$800-1,400。最终价格取决于日期、是否过夜、车辆、老师、餐食和场地档期。', es: 'US$800-1.400 por grupo privado de 2 a 4 personas para la opción de 1 día o 2 días y 1 noche. El precio final depende de las fechas, la opción de noche, el vehículo, el profesor, las comidas y la disponibilidad del lugar.' },
    'Shanghai-Liyao transfers, private vehicle, Liyao village walk, one selected tea/incense/sachet or handwork chapter, and the overnight, meals, guide, and interpreter support listed in the final quote.': { zh: '上海与李窑之间的接送、私家车、李窑村落漫步、一项选定的茶/香/香囊或手作体验，以及最终报价中列明的住宿、餐食、导游和翻译支持。', es: 'Traslados entre Shanghái y Liyao, vehículo privado, paseo por la aldea, un capítulo elegido de té/incienso/saquito aromático o artesanía y el alojamiento, las comidas y el apoyo de guía e intérprete indicados en el presupuesto final.' },
    'The one-day version returns to Shanghai. The 2-day / 1-night version adds a quiet Liyao stay and a slower morning. Dates, venue, teacher, vehicle, and room availability are confirmed before payment.': { zh: '一日版返回上海；2天1晚版增加李窑安静住宿和更从容的清晨。日期、场地、老师、车辆和房间档期会在付款前确认。', es: 'La versión de un día regresa a Shanghái. La versión de 2 días y 1 noche añade una estancia tranquila en Liyao y una mañana más lenta. Las fechas, el lugar, el profesor, el vehículo y la habitación se confirman antes del pago.' },
    'Reference price US$800-1,400 per private group': { zh: '参考价格：2-4人私享团US$800-1,400', es: 'Precio de referencia: US$800-1.400 por grupo privado' },
    'Start with half a day in Shanghai.': { zh: '从上海半天开始。', es: 'Empieza con medio día en Shanghái.' },
    'This is a low-pressure first step for guests with a short stay, a transit window, or an interest in Jiangnan life before planning a longer route.': { zh: '适合短暂停留、转机时间有限，或想先了解江南生活、之后再计划长线旅行的客人。', es: 'Un primer paso sencillo para quienes tienen una estancia corta, una escala o interés por la vida de Jiangnan antes de planear una ruta más larga.' },
    'Half day': { zh: '半天', es: 'Medio día' },
    'Shanghai Half-Day Jiangnan Experience': { zh: '上海半日江南体验', es: 'Experiencia Jiangnan de medio día en Shanghái' },
    'Begin with Shanghai city life, then spend a focused half day with one Jiangnan chapter: tea, a garden, handwork, or a small local-life experience.': { zh: '从上海城市生活开始，再用半天专注感受一个江南章节：茶、园林、手工艺或一段当地生活体验。', es: 'Empieza con la vida urbana de Shanghái y dedica medio día a un capítulo de Jiangnan: té, jardines, artesanía o una pequeña experiencia de vida local.' },
    'Start at your Shanghai hotel or an agreed arrival point; finish in Shanghai.': { zh: '从上海酒店或约定的抵达地点开始；在上海结束。', es: 'Comienza en tu hotel de Shanghái o en un punto de llegada acordado; termina en Shanghái.' },
    'Transit guests, short stays, and visitors not yet ready to plan a full China journey.': { zh: '转机客、短暂停留的客人，以及还没有准备好规划完整中国之旅的客人。', es: 'Viajeros en tránsito, estancias cortas y visitantes que aún no están listos para planear un viaje completo por China.' },
    'Shanghai city context plus one focused Jiangnan choice: tea, garden, craft, or local life, subject to timing and availability.': { zh: '上海城市导入，加上一项明确的江南选择：茶、园林、手工艺或当地生活，具体以时间和档期为准。', es: 'Contexto urbano de Shanghái más una elección concreta de Jiangnan: té, jardín, artesanía o vida local, según tiempo y disponibilidad.' },
    'Ask for current pricing. We confirm the workable location, transport, guide, and experience before payment.': { zh: '当前价格请咨询。地点、交通、导游和体验内容会在付款前确认。', es: 'Solicita el precio vigente. Confirmaremos lugar, transporte, guía y experiencia antes del pago.' },
    'Start with one clear direction from Chengdu.': { zh: '从成都出发，先选择一个清晰方向。', es: 'Empieza desde Chengdu con una dirección clara.' },
    'Western Sichuan is a large region. This first route keeps the geography understandable: one mountain direction, a manageable pace, and time to check weather, roads, altitude, and availability before anything is confirmed.': { zh: '川西地域很大。这条入门路线只走一个山地方向，保持可理解的地理范围和从容节奏，并在确认前留出时间核对天气、道路、海拔和档期。', es: 'Sichuan occidental es una región extensa. Esta primera ruta mantiene la geografía clara: una sola dirección de montaña, un ritmo manejable y tiempo para revisar clima, carreteras, altitud y disponibilidad antes de confirmar.' },
    '3 days / 2 nights': { zh: '3天2晚', es: '3 días / 2 noches' },
    'Western Sichuan Three-Day Entry Route': { zh: '川西三日入门路线', es: 'Ruta de entrada de tres días por Sichuan occidental' },
    'Chengdu to the Hailuogou direction and back: mountain scenery, hot springs, slow walking, and a respectful introduction to Tibetan culture without trying to fit the whole plateau into three days.': { zh: '成都往返海螺沟方向：山地景观、温泉、慢行，以及一段尊重当地语境的藏族文化导入，不把整个高原塞进三天。', es: 'De Chengdu hacia Hailuogou y de vuelta: paisajes de montaña, aguas termales, caminatas pausadas y una introducción respetuosa a la cultura tibetana, sin intentar abarcar toda la meseta en tres días.' },
    'Start in Chengdu; travel in the Hailuogou direction; return to Chengdu.': { zh: '从成都开始，前往海螺沟方向，再返回成都。', es: 'Comienza en Chengdu, viaja hacia Hailuogou y regresa a Chengdu.' },
    'First-time Western Sichuan visitors who want a focused mountain introduction and a measured pace.': { zh: '第一次到川西、希望集中了解山地风景并保持从容节奏的客人。', es: 'Visitantes primerizos de Sichuan occidental que buscan una introducción concentrada a la montaña y un ritmo medido.' },
    'Mountain landscape, a hot-spring stay, slow walking, and one clear Tibetan culture or Thangka context chapter, subject to current availability.': { zh: '山地景观、温泉住宿、慢行，以及一段明确的藏族文化或唐卡背景介绍，具体以当前档期为准。', es: 'Paisaje de montaña, estancia con aguas termales, caminatas pausadas y un capítulo claro de contexto tibetano o Thangka, sujeto a disponibilidad.' },
    'Ask for current pricing. Weather, road conditions, altitude pacing, hotel, vehicle, and guide availability are checked before payment.': { zh: '当前价格请咨询。天气、道路状况、海拔节奏、酒店、车辆和导游档期会在付款前核对。', es: 'Solicita el precio vigente. Revisaremos clima, carreteras, ritmo de altitud, hotel, transporte y disponibilidad de guía antes del pago.' },
    'This is a focused Hailuogou-direction route, not a three-day combination of Chengdu, Garze, Daocheng, and the whole Western Sichuan loop.': { zh: '这是一条聚焦海螺沟方向的路线，不是三天内把成都、甘孜、稻城和整个川西环线拼在一起。', es: 'Es una ruta enfocada en la dirección de Hailuogou, no una combinación de Chengdu, Garze, Daocheng y todo el circuito de Sichuan occidental en tres días.' },
    'First route map': { zh: '第一条路线地图', es: 'Mapa de la primera ruta' },
    'A first look at Beijing': { zh: '先看一眼北京', es: 'Una primera mirada a Pekín' },
    'Before you choose': { zh: '选择之前', es: 'Antes de elegir' },
    'Places along the route': { zh: '路线上的真实地点', es: 'Lugares reales de la ruta' },
    'A first route, with room to wander': { zh: '第一条路线，也留有探索的空间', es: 'Una primera ruta, con espacio para descubrir' },

    'What is a TCM wellness journey in China?': { zh: '什么是中国文化健康之旅？', es: '¿Qué es un viaje de bienestar cultural en China?' },
    'What guests can actually do.': { zh: '客人可以实际体验什么。', es: 'Qué puedes hacer realmente.' },
    'Continue the ritual at home.': { zh: '把这段文化体验带回家。', es: 'Continúa el ritual en casa.' },
    'Begin with wellness. Travel deeper into real China.': { zh: '从文化健康开始，深入真实中国。', es: 'Empieza con bienestar y descubre la China real.' },
    'Non-medical cultural wellness journey': { zh: '非医疗文化健康之旅', es: 'Viaje cultural de bienestar no médico' },
    'No diagnosis': { zh: '不做诊断', es: 'Sin diagnóstico' },
    'No treatment': { zh: '不提供治疗', es: 'Sin tratamiento' },
    'No efficacy promises': { zh: '不承诺疗效', es: 'Sin promesas de eficacia' },

    'Choose experiences': { zh: '选择体验', es: 'Elige experiencias' },
    'How to build your trip': { zh: '如何构建你的旅行', es: 'Cómo construir tu viaje' },
    'Start with a route that already makes sense.': { zh: '从一条顺路的行程开始。', es: 'Empieza con una ruta que ya tiene sentido.' },
    'Add what you need': { zh: '加入你需要的内容', es: 'Añade lo que necesitas' },
    'Send your plan': { zh: '提交你的行程', es: 'Envía tu plan' },
    'Review it with us': { zh: '和我们一起确认', es: 'Revísalo con nosotros' },
    'What you will experience': { zh: '你将体验什么', es: 'Lo que vivirás' },
    'Jiangnan, made easy to enter': { zh: '从容进入江南', es: 'Jiangnan, fácil de descubrir' },
    'What the journey feels like': { zh: '这段旅程的感受', es: 'Cómo se siente el viaje' },
    'Plan your pace': { zh: '安排你的节奏', es: 'Planifica tu ritmo' },
    'What you will take away': { zh: '你会带走什么', es: 'Lo que te llevarás' },
    'What you may need': { zh: '你可能需要什么', es: 'Lo que puedes necesitar' },
    'Choose a starting rhythm, then make it your own.': { zh: '从合适的节奏开始，再做成自己的行程。', es: 'Empieza con un ritmo claro y hazlo tuyo.' },
    'Choose one experience': { zh: '选择一项体验', es: 'Elige una experiencia' },
    'Choose a route': { zh: '选择一条路线', es: 'Elige una ruta' },
    'Each place offers something different.': { zh: '每个地方都有不同的体验。', es: 'Cada lugar ofrece algo diferente.' },
    'Three ways to begin': { zh: '三种开始方式', es: 'Tres formas de empezar' },
    'Confirm and book': { zh: '确认并预订', es: 'Confirmar y reservar' },
    'Confirm before booking': { zh: '预订前确认', es: 'Confirmar antes de reservar' },
    'Ask 1:1': { zh: '一对一咨询', es: 'Consultar 1:1' },
    'Reference price: from CNY 2,680 per person. The final price depends on your dates, room type, vehicle, tickets, meals, and road conditions.': { zh: '参考价格：每人2,680元起。最终价格取决于日期、房型、车辆、门票、餐食和道路情况。', es: 'Precio de referencia: desde CNY 2.680 por persona. El precio final depende de tus fechas, el tipo de habitación, el vehículo, las entradas, las comidas y las condiciones de la carretera.' },

    'Beijing Experiences': { zh: '北京体验', es: 'Experiencias de Pekín' },
    'Shanghai & Jiangnan Experiences': { zh: '上海与江南体验', es: 'Experiencias de Shanghái y Jiangnan' },
    'Quanzhou Experiences': { zh: '泉州体验', es: 'Experiencias de Quanzhou' },
    'The first gateway.': { zh: '第一座入口城市。', es: 'La primera puerta de entrada.' },
    'The port of living heritage.': { zh: '一座仍在生活的遗产之城。', es: 'Un puerto de patrimonio vivo.' },
    'Land in Shanghai. Choose your Jiangnan.': { zh: '抵达上海，选择你的江南。', es: 'Aterriza en Shanghái. Elige tu Jiangnan.' },
    'Add Beijing to your plan': { zh: '将北京加入行程', es: 'Añadir Pekín a tu plan' },
    'Add Shanghai to your plan': { zh: '将上海加入行程', es: 'Añadir Shanghái a tu plan' },
    'Add Sichuan to your plan': { zh: '将川西加入行程', es: 'Añadir Sichuan occidental a tu plan' },
    'Add Quanzhou to your plan': { zh: '将泉州加入行程', es: 'Añadir Quanzhou a tu plan' },
    'Start your inquiry': { zh: '开始咨询', es: 'Iniciar la consulta' },
    'Ready to plan your next step?': { zh: '准备好规划下一步了吗？', es: '¿Listo para planificar el siguiente paso?' },
    'Trip plan': { zh: '行程规划', es: 'Plan de viaje' },
    'Trip plan flow': { zh: '行程规划流程', es: 'Proceso del plan de viaje' },
    'One Shanghai arrival, three ways into Jiangnan.': { zh: '从上海出发，三种方式进入江南。', es: 'Una llegada a Shanghái, tres formas de entrar en Jiangnan.' },
    'Your time can be as short as half a day or as long as five days. Choose one place to begin, or combine the three experiences; each offers a different way to experience Jiangnan.': { zh: '时间可以短至半天，也可以延长到五天。你可以从一个地方开始，也可以组合三种体验；每一种都能带你从不同角度感受江南。', es: 'Tu tiempo puede ser de medio día o de hasta cinco días. Elige un lugar para empezar o combina las tres experiencias; cada una ofrece una forma distinta de conocer Jiangnan.' },
    'Choose a Beijing rhythm first, add the experiences you care about, and send your trip plan. We confirm the final order, dates, cars, hotels, tickets, workshops, products, and price before payment.': { zh: '先选择适合你的北京节奏，再加入你在意的体验并提交行程。我们会在付款前确认最终顺序、日期、用车、酒店、门票、体验、产品和价格。', es: 'Elige primero el ritmo de Pekín que prefieras, añade las experiencias que te interesen y envía tu plan de viaje. Confirmaremos el orden final, las fechas, los vehículos, los hoteles, las entradas, los talleres, los productos y el precio antes del pago.' },
    'Tell us what you want to experience, and we will help shape the route, timing, and practical details for a free afternoon, city walk, Jiangnan village stay, cultural stop, or future visit.': { zh: '告诉我们你想体验什么，我们会帮你梳理半日空档、城市漫步、江南村落住宿、文化体验或未来旅行的路线、时间和实际细节。', es: 'Cuéntanos qué quieres vivir y te ayudaremos a organizar la ruta, los tiempos y los detalles prácticos de una tarde libre, un paseo urbano, una estancia en un pueblo de Jiangnan, una experiencia cultural o una visita futura.' },
    'Tell us what you want to experience, and we will help shape the route, timing, and practical details for food walks, craft studios, tea, Tulou extensions, or a future visit.': { zh: '告诉我们你想体验什么，我们会帮你梳理美食漫步、手作工作室、茶、土楼延伸路线或未来旅行的路线、时间和实际细节。', es: 'Cuéntanos qué quieres vivir y te ayudaremos a organizar la ruta, los tiempos y los detalles prácticos de paseos gastronómicos, talleres artesanales, té, extensiones a Tulou o una visita futura.' },
    'A hands-on Tulou model kit with wooden interlocking structure, hand-finished details, English story cards, and a Tulou journey idea to explore when you plan a visit.': { zh: '一套木质拼插、手工完成细节并配有英文故事卡的土楼模型，也可以在计划到访时进一步了解土楼旅行。', es: 'Un kit práctico de arquitectura Tulou con estructura de madera ensamblable, detalles acabados a mano, tarjetas de historia en inglés y una idea de viaje a Tulou para explorar cuando planifiques tu visita.' },
    'A cultural route idea for a future visit: Dongba culture, Snow Mountain villages, and slow local life.': { zh: '未来到访时可以了解的文化路线想法：东巴文化、雪山村落与慢节奏的当地生活。', es: 'Una idea de ruta cultural para una visita futura: cultura Dongba, pueblos de montaña y vida local sin prisa.' },
    'Optional seal-culture kit or carving session; we confirm the materials, teacher, and delivery details first.': { zh: '可选印章文化材料包或篆刻体验；我们会先确认材料、老师和寄送详情。', es: 'Puedes añadir un kit de cultura del sello o una experiencia de tallado; primero confirmamos materiales, profesor y entrega.' },
    'If you later confirm a China plan, the name and seal can become a welcome gift, photo prop, or part of a workshop.': { zh: '如果之后确认了中国行程，这份名字与印章可以成为欢迎礼物、拍照道具或体验课的一部分。', es: 'Si más adelante confirmas un viaje a China, el nombre y el sello pueden convertirse en un regalo de bienvenida, un accesorio para fotos o parte de un taller.' },
    'A Western Sichuan learning kit built around authorized Thangka image use, line-study practice, pigment stories, and the option to ask about a Garze studio visit.': { zh: '一套以授权唐卡图像、线稿练习和颜料故事为核心的川西学习材料包，也可以咨询甘孜工作室体验。', es: 'Un kit de aprendizaje de Sichuan occidental basado en imágenes Thangka autorizadas, estudio de líneas e historias de pigmentos, con la opción de consultar una visita a un estudio en Garze.' },
    'You can ask to add a Garze or Western Sichuan studio visit to your trip plan; we confirm the route and studio availability with you.': { zh: '你可以申请把甘孜或川西工作室体验加入行程；我们会与你确认路线和工作室档期。', es: 'Puedes pedir añadir una visita a un estudio de Garze o Sichuan occidental a tu plan de viaje; confirmaremos contigo la ruta y la disponibilidad del estudio.' },
    'A Shanghai and Jiangnan entry product built around a compact travel tea set, persimmon motif, tasting notes, and an optional in-person tea session by inquiry.': { zh: '一件从便携旅行茶具、柿子纹样和品茶说明开始的上海与江南入门产品，也可以单独咨询线下茶体验。', es: 'Un producto de entrada a Shanghái y Jiangnan con un juego de té de viaje compacto, motivo de caqui, notas de cata y una sesión de té presencial disponible por consulta.' },
    'You can ask to add a Shanghai tea session or Jiangnan water-town tea experience to a confirmed travel plan.': { zh: '你可以申请把上海茶体验或江南水乡茶体验加入已确认的旅行计划。', es: 'Puedes pedir añadir una sesión de té en Shanghái o una experiencia de té en un pueblo de agua de Jiangnan a un plan de viaje confirmado.' },
    'Tea contents, shipping, and any import requirements are confirmed before payment.': { zh: '茶品内容、寄送方式和可能涉及的入境要求会在付款前确认。', es: 'El contenido del té, el envío y cualquier requisito de importación se confirman antes del pago.' },
    'The video guide, ingredients, and shipping details are confirmed for each edition.': { zh: '每个版本的视频教程、材料和寄送详情都会单独确认。', es: 'La guía de vídeo, los materiales y los detalles de envío se confirman para cada edición.' },
    'Ask separately about a Beijing scent workshop when you plan a visit.': { zh: '计划到访北京时，可以单独咨询香气体验课。', es: 'Cuando planees visitar Pekín, puedes consultar por separado el taller de aromas.' },
    'Ask separately about a Jiangnan craft-studio experience.': { zh: '可以单独咨询江南工艺工作室体验。', es: 'Puedes consultar por separado una experiencia en un estudio artesanal de Jiangnan.' },
    'Seal stone, carving tools, ink paste, test paper, a name-seal story card, and a separate Yangzhou workshop available by inquiry.': { zh: '印石、篆刻工具、印泥、试印纸、人名章故事卡，以及可单独咨询的扬州体验课。', es: 'Piedra de sello, herramientas de tallado, pasta de tinta, papel de prueba, tarjeta sobre el sello personal y un taller de Yangzhou disponible por consulta.' },
    'First route map': { zh: '第一条路线地图', es: 'Mapa de la primera ruta' }
  };

  const PLACEHOLDERS = {
    'Search routes, products, FAQs': { zh: '搜索路线、产品和常见问题', es: 'Buscar rutas, productos y preguntas' },
    'Month, season, or target date': { zh: '月份、季节或目标日期', es: 'Mes, temporada o fecha' },
    'Example: 2 adults, family of 4, private group': { zh: '例如：2位成人、4人家庭、私人团体', es: 'Ejemplo: 2 adultos, familia de 4, grupo privado' },
    'Tell us your arrival city, dates, available time, hotel status, must-see places, pace, product interest, or anything already booked.': { zh: '告诉我们入境城市、日期、可用时间、酒店情况、想去的地方、节奏、产品兴趣，以及已经预订的内容。', es: 'Cuéntanos la ciudad de llegada, fechas, tiempo disponible, hotel, lugares imprescindibles, ritmo, productos y reservas ya hechas.' },
    'Example: 1, 3, 20 gift boxes': { zh: '例如：1件、3件、20个礼盒', es: 'Ejemplo: 1, 3 o 20 cajas regalo' },
    'Example: United States, UK, Singapore, not sure': { zh: '例如：美国、英国、新加坡、不确定', es: 'Ejemplo: Estados Unidos, Reino Unido, Singapur o no estoy seguro' },
    'Tell us the product, quantity, shipping timing, gift purpose, language version, or future travel idea if there is one.': { zh: '告诉我们产品、数量、寄送时间、送礼用途、语言版本，以及未来旅行想法。', es: 'Cuéntanos el producto, cantidad, momento de envío, uso como regalo, idioma y futura idea de viaje.' },
    'Example: Emma, James, Maya': { zh: '例如：Emma、James、Maya', es: 'Ejemplo: Emma, James o Maya' },
    'Optional': { zh: '选填', es: 'Opcional' },
    'Where should we send the name card?': { zh: '名字卡发送到哪里？', es: '¿Dónde enviamos la tarjeta de nombre?' },
    'Tell us a few personality words, favorite colors, places, crafts, or the feeling you want the name to carry.': { zh: '告诉我们几个性格关键词、喜欢的颜色、地方、手工艺，或你希望名字传达的感觉。', es: 'Cuéntanos algunas palabras sobre tu personalidad, colores, lugares, artesanías o la sensación que quieres transmitir.' },
    'Where should we ship or plan for?': { zh: '我们寄到哪里，或按哪里来规划？', es: '¿Dónde debemos enviar o planificar?' },
    'Example: this month, next month, not sure': { zh: '例如：本月、下月、不确定', es: 'Ejemplo: este mes, el próximo o no estoy seguro' },
    'Tell us the edition, quantity, shipping window, or future workshop interest for this product.': { zh: '告诉我们版本、数量、寄送时间，或你对未来体验课的兴趣。', es: 'Cuéntanos la edición, cantidad, periodo de envío o interés en un futuro taller.' },
    'Month or season': { zh: '月份或季节', es: 'Mes o temporada' },
    'Number of guests': { zh: '客人人数', es: 'Número de viajeros' },
    'Tea, incense, hot springs, food, Thangka, craft, photography, Take Home products...': { zh: '茶、香、温泉、美食、唐卡、手工、摄影、带回家产品……', es: 'Té, incienso, aguas termales, comida, Thangka, artesanía, fotografía y productos para llevar...' }
  };

  const TITLE_TRANSLATIONS = {
    'Take Home | Discover Real China': { zh: '带回家的文化 | 发现真实中国', es: 'Cultura para llevar | Discover Real China' },
    'Take Home Product | Discover Real China': { zh: '带回家的文化产品 | 发现真实中国', es: 'Producto cultural | Discover Real China' },
    'TCM Wellness | Discover Real China': { zh: '文化健康之旅 | 发现真实中国', es: 'Bienestar cultural | Discover Real China' },
    'Beijing | Discover Real China': { zh: '北京 | 发现真实中国', es: 'Pekín | Discover Real China' },
    'Shanghai | Discover Real China': { zh: '上海 | 发现真实中国', es: 'Shanghái | Discover Real China' },
    'Western Sichuan | Discover Real China': { zh: '川西 | 发现真实中国', es: 'Sichuan occidental | Discover Real China' },
    'Quanzhou | Discover Real China': { zh: '泉州 | 发现真实中国', es: 'Quanzhou | Discover Real China' },
    'About Tsingpu | Discover Real China': { zh: '关于青普 | 发现真实中国', es: 'Sobre Tsingpu | Discover Real China' }
  };

  Object.assign(TEXT, {
    'Places, people, and everyday culture make the journey memorable.': { zh: '地方、人和日常文化，让旅程真正值得记住。', es: 'Los lugares, las personas y la cultura cotidiana hacen memorable el viaje.' },
    'Tsingpu is a cultural-retreat brand known for bringing local architecture, landscape, food, craft, and everyday life into the guest experience. Discover Real China draws on this place-based way of traveling when it helps guests choose where to stay and what to experience.': { zh: '青普是一家以文化旅居为特色的品牌，将当地建筑、景观、美食、手工艺和日常生活带入宾客体验。发现真实中国会借鉴这种以地点为核心的旅行方式，帮助客人选择住在哪里、体验什么。', es: 'Tsingpu es una marca de retiros culturales que incorpora la arquitectura local, el paisaje, la comida, la artesanía y la vida cotidiana a la experiencia del huésped. Discover Real China toma esta forma de viajar conectada con el lugar para ayudarte a elegir dónde alojarte y qué vivir.' },
    'A good stay gives you more than a room: it gives you a way into the place around you.': { zh: '一次好的停留不只是一个房间，也是一扇进入当地生活的门。', es: 'Una buena estancia ofrece más que una habitación: abre una puerta al lugar que te rodea.' },
    'Places to stay, people to meet, and everyday life to notice.': { zh: '可以住下来的地方、可以认识的人，以及值得留意的日常生活。', es: 'Lugares donde alojarse, personas que conocer y vida cotidiana que observar.' },
    'Why guests choose this kind of stay': { zh: '客人为什么选择这样的停留', es: 'Por qué los huéspedes eligen este tipo de estancia' },
    'A place to stay can also be a place to begin.': { zh: '一个住宿的地方，也可以成为旅程的起点。', es: 'Un lugar donde alojarse también puede ser el comienzo del viaje.' },
    'Tsingpu cultural retreats are designed around the character of a place. Guests can slow down, meet local culture, and understand a destination through what they see, taste, make, and hear.': { zh: '青普文化旅居围绕地方本身的性格展开。客人可以放慢脚步，通过所见、所尝、所做与所听，接触当地文化，理解一座目的地。', es: 'Los retiros culturales de Tsingpu parten del carácter de cada lugar. Los huéspedes pueden bajar el ritmo, acercarse a la cultura local y comprender un destino a través de lo que ven, prueban, hacen y escuchan.' },
    'Places with character': { zh: '有地方性格的空间', es: 'Lugares con carácter' },
    'Stay in spaces shaped by local architecture, landscape, and daily life.': { zh: '住进由当地建筑、景观与日常生活共同塑造的空间。', es: 'Alójate en espacios formados por la arquitectura local, el paisaje y la vida cotidiana.' },
    'Local culture, close up': { zh: '近距离接触当地文化', es: 'La cultura local de cerca' },
    'Discover tea, craft, food, village life, and heritage with context.': { zh: '在背景与故事中了解茶、手工艺、美食、村落生活与文化遗产。', es: 'Descubre el té, la artesanía, la comida, la vida de los pueblos y el patrimonio con contexto.' },
    'People who can explain': { zh: '有人为你讲清楚', es: 'Personas que saben explicarlo' },
    'Cultural mentors help make unfamiliar places easier to understand.': { zh: '文化导师帮助你更容易理解陌生的地方。', es: 'Los mentores culturales ayudan a entender lugares desconocidos.' },
    'A gentler pace': { zh: '更从容的节奏', es: 'Un ritmo más tranquilo' },
    'Start with a short stay, then add the experiences that fit your time.': { zh: '可以从短暂停留开始，再加入适合你时间的体验。', es: 'Empieza con una estancia breve y añade las experiencias que encajen con tu tiempo.' },
    'The Tsingpu approach': { zh: '青普的旅居方式', es: 'La forma de viajar de Tsingpu' },
    'What this can add to your journey.': { zh: '它能为你的旅程带来什么。', es: 'Lo que puede aportar a tu viaje.' },
    'A Tsingpu stay can be a starting point for a deeper China experience: one that connects a distinctive place with local people, everyday culture, and thoughtful pacing.': { zh: '一次青普式停留，可以成为深入中国的起点：让有特色的地方、当地人、日常文化与从容节奏彼此连接。', es: 'Una estancia en Tsingpu puede ser el comienzo de una experiencia más profunda en China: uniendo un lugar singular, su gente, la cultura cotidiana y un ritmo pausado.' },
    'The idea': { zh: '这份理念', es: 'La idea' },
    'Since 2015': { zh: '自2015年起', es: 'Desde 2015' },
    'The name Tsingpu points to a return to what is original: the relationship between a place, the people who live there, and the rhythm of everyday life.': { zh: '青普这个名字，指向回到事物本来的样子：一个地方、生活于此的人，以及日常生活的节奏。', es: 'El nombre Tsingpu apunta a volver a lo esencial: la relación entre un lugar, las personas que lo habitan y el ritmo de la vida cotidiana.' },
    'For guests, that can mean a stay with more to notice: architecture, landscape, food, craft, local stories, and objects to take home.': { zh: '对客人来说，这意味着一次有更多细节可发现的停留：建筑、景观、美食、手工艺、当地故事，以及可以带回家的文化物件。', es: 'Para los huéspedes, significa una estancia con más detalles por descubrir: arquitectura, paisaje, comida, artesanía, historias locales y objetos para llevar a casa.' },
    'Cultural hospitality experience': { zh: '文化旅居体验', es: 'Experiencia de hospitalidad cultural' },
    'A wide range of art, food, craft, seasonal living, and local-culture experiences.': { zh: '涵盖艺术、美食、手工艺、节气生活与当地文化的丰富体验。', es: 'Una amplia variedad de experiencias de arte, comida, artesanía, vida estacional y cultura local.' },
    'Objects and kits': { zh: '文化物件与材料包', es: 'Objetos y kits' },
    'Cultural objects and materials that help guests keep the journey close at home.': { zh: '让客人在家中继续感受旅程的文化物件与材料。', es: 'Objetos y materiales culturales para mantener cerca el viaje al volver a casa.' },
    'Experience across industries': { zh: '跨领域的体验实践', es: 'Experiencia en distintos sectores' },
    'Cultural work beyond travel.': { zh: '文化体验不只发生在旅行中。', es: 'El trabajo cultural va más allá de los viajes.' },
    'Luxury and lifestyle:': { zh: '奢侈品与生活方式：', es: 'Lujo y estilo de vida:' },
    'Finance, property, media, and technology:': { zh: '金融、地产、媒体与科技：', es: 'Finanzas, inmobiliario, medios y tecnología:' },
    'Cultural programs for teams, clients, and corporate gatherings.': { zh: '为团队、客户与企业活动提供文化项目。', es: 'Programas culturales para equipos, clientes y encuentros corporativos.' },
    'Recognition': { zh: '获得的认可', es: 'Reconocimientos' },
    'Selected properties have earned design and hospitality attention.': { zh: '部分行馆获得设计与旅居领域的关注。', es: 'Algunas propiedades han recibido atención en diseño y hospitalidad.' },
    'Design-led stays:': { zh: '设计型旅居：', es: 'Estancias guiadas por el diseño:' },
    'selected Tsingpu properties have been recognized by Design Hotels.': { zh: '部分青普行馆获得 Design Hotels 的认可。', es: 'Algunas propiedades de Tsingpu han sido reconocidas por Design Hotels.' },
    'Hotel and design awards:': { zh: '酒店与设计奖项：', es: 'Premios de hotel y diseño:' },
    'Tsingpu properties and cultural projects have appeared in design, hospitality, and boutique-hotel awards and rankings.': { zh: '青普行馆与文化项目曾出现在设计、旅居和精品酒店相关的奖项与榜单中。', es: 'Las propiedades y proyectos culturales de Tsingpu han aparecido en premios y rankings de diseño, hospitalidad y hoteles boutique.' },
    'Why it matters:': { zh: '这对客人意味着：', es: 'Por qué importa:' },
    'thoughtful design makes architecture, local life, and hospitality part of the destination.': { zh: '用心的设计让建筑、当地生活与旅居本身成为目的地的一部分。', es: 'Un diseño cuidado hace que la arquitectura, la vida local y la hospitalidad formen parte del destino.' },
    'The founder': { zh: '创始人', es: 'El fundador' },
    'A founder focused on place and everyday life.': { zh: '一位关注地方与日常生活的创始人。', es: 'Un fundador centrado en el lugar y la vida cotidiana.' },
    'Wang Gongquan founded Tsingpu. His entrepreneurial and investment background is part of the story behind a hospitality approach that invites guests to notice distinctive places, local culture, and daily life.': { zh: '王功权创立了青普。他的创业与投资经历，构成了这套旅居方式的一部分：邀请客人留意有特色的地方、当地文化与日常生活。', es: 'Wang Gongquan fundó Tsingpu. Su experiencia empresarial y de inversión forma parte de una forma de hospitalidad que invita a descubrir lugares singulares, cultura local y vida cotidiana.' },
    'Wang Gongquan founded Tsingpu and helped develop its cultural-retreat approach, where the setting, the people, and the experience matter as much as the room.': { zh: '王功权创立了青普，并参与发展了这套文化旅居方式：在这里，环境、当地人和体验与房间本身同样重要。', es: 'Wang Gongquan fundó Tsingpu y contribuyó a desarrollar un enfoque de retiro cultural donde el entorno, las personas y la experiencia importan tanto como la habitación.' },
    'See it in real places': { zh: '在真实地点看见它', es: 'Verlo en lugares reales' },
    'The idea becomes clearer when you see the places.': { zh: '看到这些地方，理念会变得更清楚。', es: 'La idea se entiende mejor al ver los lugares.' },
    'Across Jiangnan and Fujian, the story changes with the setting: gardens and canals, village life, restored architecture, and food made for the place.': { zh: '在江南与福建，故事会随着地点改变：园林与水道、村落生活、修复后的建筑，以及属于当地的食物。', es: 'En Jiangnan y Fujian, la historia cambia con el entorno: jardines y canales, vida de pueblo, arquitectura restaurada y comida propia del lugar.' },
    'Suzhou / gardens, water, and a slower day': { zh: '苏州 / 园林、水与更从容的一天', es: 'Suzhou / jardines, agua y un día más pausado' },
    'Yangzhou / canal life, food, and local rhythm': { zh: '扬州 / 运河生活、美食与当地节奏', es: 'Yangzhou / vida del canal, comida y ritmo local' },
    'Fujian Tulou / shared courtyards and living history': { zh: '福建土楼 / 共享庭院与仍在延续的历史', es: 'Tulou de Fujian / patios compartidos e historia viva' },
    'Choose where to begin': { zh: '选择从哪里开始', es: 'Elige por dónde empezar' },
    'Start with one place. Let the journey grow from there.': { zh: '从一个地方开始，让旅程由此展开。', es: 'Empieza con un lugar y deja que el viaje crezca desde ahí.' },
    'From there, you can add a local meal, craft workshop, route extension, or Take Home object.': { zh: '从这里出发，你可以加入当地一餐、手工艺体验、路线延伸或带回家的文化物件。', es: 'A partir de ahí puedes añadir una comida local, un taller, una extensión de ruta o un objeto para llevar a casa.' },
    'A short stay can remain simple, or become the first step into a deeper China journey.': { zh: '短暂停留可以保持简单，也可以成为深入中国的第一步。', es: 'Una estancia breve puede ser sencilla o convertirse en el primer paso hacia un viaje más profundo por China.' },
    'A short beginning': { zh: '从短暂停留开始', es: 'Un comienzo breve' },
    'A deeper route': { zh: '走向更深的路线', es: 'Una ruta más profunda' },
    'Continue from Beijing, Shanghai, Chengdu, or Quanzhou into Western Sichuan, Jiangnan, Tulou, or Thangka culture.': { zh: '从北京、上海、成都或泉州继续前往川西、江南、土楼或唐卡文化之地。', es: 'Continúa desde Pekín, Shanghái, Chengdu o Quanzhou hacia Sichuan occidental, Jiangnan, los Tulou o la cultura Thangka.' },
    'Something to take home': { zh: '带一样文化回家', es: 'Algo para llevar a casa' },
    'Culture kits, videos, prints, and craft objects keep the experience with you.': { zh: '文化材料包、视频、版画与手工艺物件，让体验继续陪伴你。', es: 'Kits culturales, vídeos, láminas y objetos artesanales mantienen la experiencia contigo.' },
    'Tell us what interests you': { zh: '告诉我们你感兴趣的内容', es: 'Cuéntanos qué te interesa' },
    'We will help match the right place, pace, and cultural experience.': { zh: '我们会帮你匹配合适的地点、节奏与文化体验。', es: 'Te ayudaremos a encontrar el lugar, el ritmo y la experiencia cultural adecuados.' },
    'Before you book': { zh: '预订前请了解', es: 'Antes de reservar' },
    'We make the details clear before you decide.': { zh: '在你决定之前，我们先把细节说清楚。', es: 'Aclaramos los detalles antes de que decidas.' },
    'We confirm current availability, the exact place, experience details, included services, and final price before any booking or payment.': { zh: '在预订或付款前，我们会确认当前可用情况、具体地点、体验细节、包含的服务与最终价格。', es: 'Antes de reservar o pagar, confirmamos la disponibilidad actual, el lugar exacto, los detalles de la experiencia, los servicios incluidos y el precio final.' },
    'Tell us what you want': { zh: '告诉我们你的需求', es: 'Cuéntanos qué buscas' },
    'Choose a place, pace, and kind of stay.': { zh: '选择地点、节奏与停留方式。', es: 'Elige un lugar, un ritmo y el tipo de estancia.' },
    'Add food, craft, local life, or a Take Home object.': { zh: '加入美食、手工艺、当地生活或带回家的文化物件。', es: 'Añade comida, artesanía, vida local u objetos para llevar a casa.' },
    'Tell us what you have already arranged.': { zh: '告诉我们你已经安排好的部分。', es: 'Cuéntanos qué has organizado ya.' },
    'What we confirm': { zh: '我们会确认什么', es: 'Lo que confirmamos' },
    'Dates and availability.': { zh: '日期与可用情况。', es: 'Fechas y disponibilidad.' },
    'Route order and travel time.': { zh: '路线顺序与交通时间。', es: 'Orden de la ruta y tiempos de desplazamiento.' },
    'What is included and who provides it.': { zh: '包含哪些服务，以及由谁提供。', es: 'Qué incluye el servicio y quién lo proporciona.' },
    'Final price and payment details in writing.': { zh: '书面确认最终价格与付款细节。', es: 'Precio final y detalles de pago por escrito.' },
    'Begin with a place in China.': { zh: '从中国的一个地方开始。', es: 'Empieza por un lugar de China.' },
    'About Tsingpu Cultural Travel': { zh: '关于青普文化旅居', es: 'Sobre el viaje cultural de Tsingpu' },
    'Culture first': { zh: '文化优先', es: 'La cultura primero' },
    'Discover Real China helps overseas guests begin with a city, a stay, or a cultural experience. From there, you can add a local meal, craft workshop, route extension, or Take Home object.': { zh: '发现真实中国帮助海外客人从一座城市、一次停留或一项文化体验开始。从这里出发，你可以加入当地一餐、手工艺体验、路线延伸或带回家的文化物件。', es: 'Discover Real China ayuda a los huéspedes internacionales a comenzar con una ciudad, una estancia o una experiencia cultural. A partir de ahí puedes añadir una comida local, un taller, una extensión de ruta o un objeto para llevar a casa.' },
    'Explore a route, choose a cultural experience, or tell us what kind of stay you are looking for.': { zh: '探索一条路线、选择一项文化体验，或告诉我们你想要怎样的停留。', es: 'Explora una ruta, elige una experiencia cultural o cuéntanos qué tipo de estancia buscas.' },
    'Start inquiry': { zh: '开始咨询', es: 'Iniciar consulta' },
    'cultural experiences for high-end consumer, fashion, and hospitality brands.': { zh: '为高端消费、时尚与酒店品牌提供文化体验。', es: 'Experiencias culturales para marcas de consumo premium, moda y hospitalidad.' },
    'cultural programs and guest experiences for Chinese and international automotive brands.': { zh: '为中国与国际汽车品牌设计文化项目与宾客体验。', es: 'Programas culturales y experiencias para huéspedes de marcas automovilísticas chinas e internacionales.' },
    'cultural programs for teams, clients, and corporate gatherings.': { zh: '为团队、客户与企业活动提供文化项目。', es: 'Programas culturales para equipos, clientes y encuentros corporativos.' },
    'Nine first-line products': { zh: '九个首批产品', es: 'Nueve productos de la primera línea' },
    'Digital': { zh: '数字产品', es: 'Digital' },
    'Learn before travel': { zh: '出发前先学习', es: 'Aprende antes de viajar' },
    'Starter kit': { zh: '入门材料包', es: 'Kit inicial' },
    'Receive the doorway': { zh: '把文化入口带回家', es: 'Recibe tu puerta de entrada' },
    'Kit + class': { zh: '材料包 + 课程', es: 'Kit + clase' },
    'Use the guide': { zh: '跟着教程体验', es: 'Usa la guía' },
    'Private class': { zh: '私享课程', es: 'Clase privada' },
    'Learn with a teacher': { zh: '跟老师一起学习', es: 'Aprende con un profesor' },
    'Choose one of the nine first-line products: fragrance, name and seal, handwork, Thangka, tea, Yangzhou carving, or Tulou architecture.': { zh: '从九个首批产品中选择一件：香气、中文名字与印章、手工艺、唐卡、茶、扬州篆刻或土楼建筑。', es: 'Elige uno de los nueve productos iniciales: fragancia, nombre y sello, artesanía, Thangka, té, tallado de sellos de Yangzhou o arquitectura Tulou.' },
    'Choose a Chinese name card, seasonal culture card, or authorized Thangka digital and video pass for a small first purchase.': { zh: '选择中文名字卡、节气文化卡，或经过授权的唐卡数字与视频通行证，先从一笔轻量购买开始。', es: 'Elige una tarjeta de nombre chino, una tarjeta cultural estacional o un pase digital y de vídeo de Thangka autorizado para empezar con una compra sencilla.' },
    'When listed, a kit includes an English video guide. Private online and small-group classes are separate products with their own confirmation.': { zh: '商品明确标注时，材料包会包含英文视频教程。私享线上课和小班课是独立产品，需要单独确认。', es: 'Cuando se indique, el kit incluye una guía de vídeo en inglés. Las clases privadas y de grupos pequeños son productos separados que requieren confirmación.' },
    'Ask about a private online class, a small group, or a cultural gift class after the teacher, time zone, contents, and price are confirmed.': { zh: '老师、时区、课程内容和价格确认后，可以咨询私享线上课、小班课或文化礼品课。', es: 'Pregunta por una clase privada, un grupo pequeño o una clase cultural para regalos cuando se confirmen el profesor, la zona horaria, el contenido y el precio.' },
    'After a future journey is confirmed, a previous purchase may be reviewed as a welcome benefit, experience upgrade, or manual credit basis. It is not an automatic cash offset.': { zh: '未来旅行确认后，之前的购买可以作为欢迎权益、体验升级或人工抵扣依据进行审核，但不是自动现金抵扣。', es: 'Cuando se confirme un viaje futuro, una compra anterior puede revisarse como beneficio de bienvenida, mejora de experiencia o base de crédito manual. No es un descuento automático en efectivo.' },
    'Botanical Scent Sachet And Bead Kit': { zh: '草木香囊与合香珠材料包', es: 'Kit botánico de saquito aromático y cuentas' },
    'One practical starter kit combining fragrance-bead and sachet making, with scent materials, fabric, cord, cultural story cards, and an English video guide when included.': { zh: '一个把合香珠与香囊制作结合起来的实用入门包，包含香材、布料、绳线、文化故事卡，以及商品标注时提供的英文视频教程。', es: 'Un kit inicial práctico que combina cuentas aromáticas y saquitos, con materiales aromáticos, tela, cordón, tarjetas culturales y una guía de vídeo en inglés cuando se incluya.' },
    'Beijing and Jiangnan': { zh: '北京与江南', es: 'Pekín y Jiangnan' },
    'Scent materials, fabric, cord, story cards, and video when listed.': { zh: '香材、布料、绳线、故事卡，以及标注包含的视频教程。', es: 'Materiales aromáticos, tela, cordón, tarjetas y vídeo cuando se indique.' },
    'A practical object before a future Beijing or Jiangnan craft session.': { zh: '在未来北京或江南手作体验前，先从一个实用物件开始。', es: 'Un objeto práctico antes de una futura sesión artesanal en Pekín o Jiangnan.' },
    'A single starter kit for both fragrance beads and sachet handwork.': { zh: '一个材料包，同时学习合香珠与香囊手作。', es: 'Un solo kit inicial para aprender cuentas aromáticas y saquitos.' },
    'Cultural notes explain scent, color, seasonal living, and everyday use.': { zh: '文化说明解释香气、颜色、节气生活与日常使用。', es: 'Las notas culturales explican el aroma, el color, la vida estacional y el uso cotidiano.' },
    'Designed as a useful object and a guided cultural activity at home.': { zh: '既是有实际用途的物件，也是可以在家完成的文化体验。', es: 'Está pensado como un objeto útil y una actividad cultural guiada para hacer en casa.' },
    'The video guide, ingredients, and shipping route are confirmed for each edition.': { zh: '每个版本的教程、成分和寄送路线都会单独确认。', es: 'La guía, los ingredientes y la ruta de envío se confirman para cada edición.' },
    'Best for guests who want a low-friction hands-on cultural product.': { zh: '适合想从低门槛手作产品开始了解中国文化的客人。', es: 'Ideal para quienes quieren empezar con un producto cultural práctico y sencillo.' },
    'Good for personal use, gifting, or a future Beijing/Jiangnan experience.': { zh: '适合自用、送礼，也可以连接未来的北京或江南体验。', es: 'Adecuado para uso personal, regalos o una futura experiencia en Pekín o Jiangnan.' },
    'Pre-order while the ingredient list and destination shipping rules are checked.': { zh: '在确认成分清单和目的地寄送规则前，接受预售咨询。', es: 'Disponible como preventa mientras se comprueban los ingredientes y las reglas de envío.' },
    'This product is cultural craft learning, not medical or therapeutic care.': { zh: '这是文化手作学习产品，不是医疗或治疗服务。', es: 'Este producto es aprendizaje artesanal cultural, no atención médica ni terapéutica.' },
    'Thangka Digital And Video Pass': { zh: '唐卡数字与视频通行证', es: 'Pase digital y de vídeo de Thangka' },
    'Private Online Cultural Class': { zh: '私享线上文化课', es: 'Clase cultural privada en línea' },
    'Beijing / $99-$149': { zh: '北京 / $99-$149', es: 'Pekín / $99-$149' },
    'Beijing / $39-$89': { zh: '北京 / $39-$89', es: 'Pekín / $39-$89' },
    'Beijing + Jiangnan / $59-$119': { zh: '北京 + 江南 / $59-$119', es: 'Pekín + Jiangnan / $59-$119' },
    'Jiangnan / $69-$129': { zh: '江南 / $69-$129', es: 'Jiangnan / $69-$129' },
    'Beijing / $49-$119': { zh: '北京 / $49-$119', es: 'Pekín / $49-$119' },
    'Western Sichuan / $99-$169': { zh: '川西 / $99-$169', es: 'Sichuan occidental / $99-$169' },
    'Shanghai and Jiangnan / $89-$129': { zh: '上海与江南 / $89-$129', es: 'Shanghái y Jiangnan / $89-$129' },
    'Yangzhou / $59-$119': { zh: '扬州 / $59-$119', es: 'Yangzhou / $59-$119' },
    'Fujian Tulou / $79-$99 · Premium $129-$189': { zh: '福建土楼 / $79-$99 · 高配版 $129-$189', es: 'Tulou de Fujian / $79-$99 · Edición premium $129-$189' },
    'Royal Fragrance Plaque And Bracelet Box': { zh: '皇家香牌与手串礼盒', es: 'Caja de placa aromática real y pulsera' },
    'Chinese Name + Seal Starter Kit': { zh: '中文名字与人名章入门套装', es: 'Kit inicial de nombre chino y sello personal' },
    'Mother-of-Pearl Hairpin Gift Set': { zh: '螺钿发簪礼盒', es: 'Set regalo de horquilla con nácar' },
    'Pankou Knot Craft Kit': { zh: '盘扣手作材料包', es: 'Kit de nudos Pankou' },
    'Thangka Line And Pigment Kit': { zh: '唐卡线稿与矿物颜料材料包', es: 'Kit de líneas y pigmentos de Thangka' },
    'Persimmon Travel Tea Set': { zh: '柿子祝福旅行茶具', es: 'Juego de té de viaje con bendición de caqui' },
    'Yangzhou Seal Carving Starter Kit': { zh: '扬州篆刻入门材料包', es: 'Kit inicial de tallado de sellos de Yangzhou' },
    'Fujian Tulou Architecture Model Kit': { zh: '福建土楼建筑模型材料包', es: 'Kit de maqueta arquitectónica de Tulou de Fujian' },
    'Discover Real China fragrance plaque, fragrance bead bracelet, palace color cards, English story card, and a separate Ruiyun retreat available by inquiry.': { zh: '发现真实中国香牌、合香珠手串、皇家色卡、英文故事卡，以及可单独咨询的瑞云旅居体验。', es: 'Placa aromática, pulsera de cuentas, tarjetas de color palaciego, historia en inglés y un retiro Ruiyun disponible por consulta.' },
    'Chinese name story card, pronunciation note, calligraphy tag, gift labels, seal-culture explanation, and a gentle first step into writing and carving traditions.': { zh: '中文名字故事卡、发音说明、书法标签、礼物标签、印章文化说明，以及进入书写与篆刻传统的轻量一步。', es: 'Tarjeta con la historia del nombre chino, pronunciación, etiqueta caligráfica, etiquetas de regalo, explicación del sello y un primer paso amable hacia la escritura y el tallado.' },
    'One practical starter kit combining fragrance-bead and sachet making: fabric, cord, scent materials, story cards, and an English video guide when included.': { zh: '一个把合香珠与香囊制作结合起来的实用入门包：布料、绳线、香材、故事卡，以及标注包含时提供的英文视频教程。', es: 'Un kit inicial práctico que combina cuentas aromáticas y saquitos: tela, cordón, materiales aromáticos, tarjetas culturales y una guía de vídeo en inglés cuando se incluya.' },
    'A Beijing Take Home craft kit inspired by traditional Pankou garment closures, with an English motif card and a maker guide when included. The teacher-led Pankou workshop is a separate Beijing experience.': { zh: '一套以传统盘扣为灵感的北京带回家手作材料包，包含英文纹样卡；商品标注时提供制作指南。老师带领的盘扣体验课是独立的北京体验。', es: 'Un kit artesanal de Pekín inspirado en los cierres tradicionales Pankou, con tarjeta de motivos en inglés y guía de elaboración cuando se incluya. El taller Pankou con profesor es una experiencia separada.' },
    'Line-study sheets, pigment story cards, practice brush, video guide, and a separate Garze Thangka studio experience available by inquiry. Edition details are confirmed before payment.': { zh: '线稿练习纸、颜料故事卡、练习笔、视频教程，以及可单独咨询的甘孜唐卡工作室体验。版本详情会在付款前确认。', es: 'Hojas de estudio de líneas, tarjetas sobre pigmentos, pincel de práctica, guía de vídeo y una experiencia de estudio Thangka en Garze disponible por consulta. Los detalles de la edición se confirman antes del pago.' },
    'Compact tea set, persimmon motif, tea note cards, cultural serving guide, and a separate Shanghai or Jiangnan tea session available by inquiry.': { zh: '便携茶具、柿子纹样、茶品说明卡、文化冲泡指南，以及可单独咨询的上海或江南茶体验。', es: 'Juego de té compacto, motivo de caqui, tarjetas de cata, guía cultural para servir y una sesión de té en Shanghái o Jiangnan disponible por consulta.' },
    'Seal stone, carving tools, ink paste, test paper, and a name-seal story card for home practice.': { zh: '印石、篆刻工具、印泥、试印纸，以及用于居家练习的人名章故事卡。', es: 'Piedra de sello, herramientas de tallado, pasta de tinta, papel de prueba y tarjeta sobre la historia del sello personal para practicar en casa.' },
    'A hands-on architectural model kit inspired by Fujian Tulou family living: wooden interlocking structure, hand-finished details, English story cards, and a separate Tulou journey available to discuss by inquiry.': { zh: '一套以福建土楼家族生活为灵感的建筑模型材料包：木质拼插结构、手工完成的细节、英文故事卡，以及可单独咨询的土楼旅行。', es: 'Un kit práctico de arquitectura inspirado en la vida familiar de los Tulou de Fujian: estructura de madera encajable, detalles acabados a mano, tarjetas en inglés y un viaje a los Tulou que puede consultarse por separado.' },
    'DESTINATION': { zh: '目的地', es: 'DESTINO' },
    'PRICE': { zh: '价格', es: 'PRECIO' },
    'INCLUDED': { zh: '包含', es: 'INCLUIDO' },
    'NEXT STEP': { zh: '下一步', es: 'PRÓXIMO PASO' },
    'Destination': { zh: '目的地', es: 'Destino' },
    'Price': { zh: '价格', es: 'Precio' },
    'Included': { zh: '包含', es: 'Incluido' },
    'Next step': { zh: '下一步', es: 'Próximo paso' },
    'Product detail': { zh: '商品详情', es: 'Detalle del producto' },
    'See the object, the guide, and the route together.': { zh: '一起看看物件、教程与路线。', es: 'Mira juntos el objeto, la guía y la ruta.' },
    'See what the product includes, why it belongs to the destination, and what happens after you request checkout.': { zh: '了解商品包含什么、它与目的地有什么关系，以及申请付款链接后会发生什么。', es: 'Descubre qué incluye el producto, por qué pertenece al destino y qué ocurre después de solicitar el enlace de pago.' },
    'What you get': { zh: '你会收到什么', es: 'Qué recibes' },
    'WHY IT FITS': { zh: '为什么适合你', es: 'POR QUÉ ENCAJA' },
    'Why it fits': { zh: '为什么适合你', es: 'Por qué encaja' },
    'The product is the doorway.': { zh: '商品是进入文化的入口。', es: 'El producto es la puerta de entrada.' },
    'Checkout request': { zh: '付款链接申请', es: 'Solicitud de pago' },
    'Request a checkout link.': { zh: '申请付款链接。', es: 'Solicita un enlace de pago.' },
    'Tell us the item, quantity, country, and timing. We confirm stock, shipping, included video-guide access when relevant, and payment next step before sending the link.': { zh: '告诉我们商品、数量、国家或地区与时间。我们会先确认库存、运费、相关视频教程权限和付款下一步，再发送链接。', es: 'Indícanos el producto, la cantidad, el país y el momento. Confirmaremos existencias, envío, acceso al vídeo cuando corresponda y el siguiente paso de pago antes de enviar el enlace.' },
    'Request checkout link': { zh: '申请付款链接', es: 'Solicitar enlace de pago' },
    'Back to shelf': { zh: '返回产品架', es: 'Volver a la estantería' },
    'Prepare checkout request': { zh: '准备付款申请', es: 'Preparar solicitud de pago' },
    'Selected product': { zh: '已选商品', es: 'Producto seleccionado' },
    'Quantity': { zh: '数量', es: 'Cantidad' },
    'Country or region': { zh: '国家或地区', es: 'País o región' },
    'Preferred timing': { zh: '预计时间', es: 'Momento preferido' },
    'What should we prepare?': { zh: '你希望我们准备什么？', es: '¿Qué debemos preparar?' },
    'Planning a China trip later? Tell us about this purchase and we can discuss a related welcome benefit or experience upgrade with your travel plan.': { zh: '之后计划来中国旅行？告诉我们这次购买，我们可以结合你的旅行计划讨论相关欢迎权益或体验升级。', es: '¿Planeas viajar a China más adelante? Cuéntanos esta compra y podremos hablar de un beneficio de bienvenida o una mejora de experiencia relacionada con tu viaje.' }
    , 'Jiangnan': { zh: '江南', es: 'Jiangnan' }
    , 'Western Sichuan': { zh: '川西', es: 'Sichuan occidental' }
    , 'Shanghai and Jiangnan': { zh: '上海与江南', es: 'Shanghái y Jiangnan' }
    , 'Fujian Tulou': { zh: '福建土楼', es: 'Tulou de Fujian' }
    , 'A gentle first step into writing and carving traditions with a Chinese name story card, pronunciation note, calligraphy tag, gift labels, and seal-culture explanation.': { zh: '从中文名字故事卡、发音说明、书法标签、礼物标签和印章文化说明开始，温和地进入书写与篆刻传统。', es: 'Un primer paso amable hacia la escritura y el tallado, con historia del nombre chino, pronunciación, etiqueta caligráfica, etiquetas de regalo y explicación del sello.' }
    , 'A Beijing Take Home craft kit inspired by traditional Pankou garment closures: starter materials, an English motif card, and a maker guide when included. The teacher-led Pankou workshop is booked separately.': { zh: '一套以传统盘扣为灵感的北京带回家手作材料包：入门材料、英文纹样卡，以及商品标注时提供的制作指南。老师带领的盘扣体验课需要单独预约。', es: 'Un kit artesanal de Pekín inspirado en los cierres tradicionales Pankou: materiales iniciales, tarjeta de motivos en inglés y guía cuando se incluya. El taller Pankou con profesor se reserva por separado.' }
    , 'A compact tea set with persimmon motif, tea note cards, a cultural serving guide, and a Shanghai or Jiangnan tea-session idea for later inquiry.': { zh: '一套带有柿子纹样的便携茶具，包含茶品说明卡、文化冲泡指南，以及可进一步咨询的上海或江南茶体验灵感。', es: 'Un juego de té compacto con motivo de caqui, tarjetas de té, guía cultural para servir y una idea de sesión de té en Shanghái o Jiangnan para consultar después.' }
    , 'A thoughtful first step toward a Western Sichuan route.': { zh: '这是走向川西路线的认真第一步。', es: 'Un primer paso cuidado hacia una ruta por Sichuan occidental.' }
    , 'Wearable Pankou pieces, when available, are offered separately from the teacher-led workshop.': { zh: '如有可穿戴盘扣成品，会与老师带领的体验课分开提供。', es: 'Cuando estén disponibles, las piezas Pankou para llevar se ofrecen por separado del taller con profesor.' }
    , 'A practical Yangzhou gift that can sit alongside a future workshop inquiry.': { zh: '一件实用的扬州礼物，也可以连接未来的工作坊咨询。', es: 'Un regalo práctico de Yangzhou que puede acompañar una futura consulta sobre un taller.' }
    , 'The tea story is included as a small cultural companion to the architecture.': { zh: '茶文化故事作为建筑主题的小小文化陪伴被放入其中。', es: 'La historia del té acompaña como un pequeño elemento cultural al tema de la arquitectura.' }
    , 'Beijing and Jiangnan / $59-$119': { zh: '北京与江南 / $59-$119', es: 'Pekín y Jiangnan / $59-$119' }
    , 'Sachet materials': { zh: '香囊材料', es: 'Materiales para saquito' }
    , 'Fragrance detail': { zh: '香材细节', es: 'Detalle aromático' }
    , 'Scent materials': { zh: '香材', es: 'Materiales aromáticos' }
    , 'and video when listed': { zh: '以及标注包含的视频教程', es: 'y vídeo cuando se indique' }
    , 'A practical object before a future Beijing or Jiangnan craft session': { zh: '在未来北京或江南手作体验前，先从一个实用物件开始', es: 'Un objeto práctico antes de una futura sesión artesanal en Pekín o Jiangnan' }
    , 'Fragrance plaque, bracelet, color cards, story card.': { zh: '香牌、手串、色卡、故事卡。', es: 'Placa aromática, pulsera, tarjetas de color e historia.' }
    , 'Pair with a Beijing retreat inquiry if you later travel.': { zh: '之后旅行时，可以与北京旅居咨询一起规划。', es: 'Si viajas más adelante, puedes combinarlo con una consulta sobre un retiro en Pekín.' }
    , 'Fragrance plaque': { zh: '香牌', es: 'Placa aromática' }
    , 'Fragrance plaque and fragrance bead bracelet in one gift set.': { zh: '一套礼盒中包含香牌与合香珠手串。', es: 'Una caja regalo reúne la placa aromática y la pulsera de cuentas.' }
    , 'Palace color cards and a concise English culture story card.': { zh: '皇家色卡与简明的英文文化故事卡。', es: 'Tarjetas de color palaciego y una breve tarjeta cultural en inglés.' }
    , 'Suitable as the first Beijing product or a refined travel gift.': { zh: '适合作为第一件北京产品，也适合作为精致的旅行礼物。', es: 'Adecuado como primer producto de Pekín o como regalo de viaje refinado.' }
    , 'Best for a premium gift buyer who wants a first Beijing object.': { zh: '适合想从第一件北京文化物件开始的礼物购买者。', es: 'Ideal para quien busca un primer objeto cultural de Pekín como regalo premium.' }
    , 'Pre-order or ask about this edition while availability and packaging are confirmed.': { zh: '在确认库存与包装前，可先咨询或预订这个版本。', es: 'Consulta o reserva esta edición mientras se confirman la disponibilidad y el embalaje.' }
    , 'Works well as a gift box, a cultural object, or a retreat teaser.': { zh: '可以作为礼盒、文化物件，或旅居体验的先行入口。', es: 'Funciona como caja regalo, objeto cultural o adelanto de un retiro.' }
    , 'Travel services stay separate from the physical product.': { zh: '旅行服务与实物商品分开确认。', es: 'Los servicios de viaje se confirman por separado del producto físico.' }
    , 'Name card, pronunciation note, calligraphy tag, seal explanation.': { zh: '名字卡、发音说明、书法标签、印章说明。', es: 'Tarjeta de nombre, pronunciación, etiqueta caligráfica y explicación del sello.' }
    , 'A small entry kit for writing and seal culture.': { zh: '进入书写与印章文化的小型入门包。', es: 'Un pequeño kit de entrada a la escritura y la cultura del sello.' }
    , 'A clean first purchase for guests not ready for a larger kit.': { zh: '适合还不想购买大套装的客人作为第一次购买。', es: 'Una primera compra sencilla para quienes aún no quieren un kit grande.' }
    , 'Chinese name story card and pronunciation support.': { zh: '中文名字故事卡与发音辅助。', es: 'Tarjeta con la historia del nombre chino y apoyo de pronunciación.' }
    , 'Gift labels and a seal-culture explanation.': { zh: '礼物标签与印章文化说明。', es: 'Etiquetas de regalo y explicación de la cultura del sello.' }
    , 'Best for curious first-time visitors and gift buyers.': { zh: '适合好奇的初次访客与礼物购买者。', es: 'Ideal para visitantes primerizos curiosos y compradores de regalos.' }
    , 'Simple, low-barrier product meant to start the journey.': { zh: '简单、低门槛，用来开启旅程的产品。', es: 'Un producto sencillo y accesible para comenzar el viaje.' }
    , 'Works as a doorway into writing, naming, and seal traditions.': { zh: '从书写、起名与印章传统进入中国文化。', es: 'Una puerta de entrada a las tradiciones de escritura, nombres y sellos.' }
    , 'The larger carving session can be offered separately.': { zh: '更完整的篆刻体验可以单独咨询。', es: 'La sesión completa de tallado puede consultarse por separado.' }
    , 'Hairpin, motif card, gift packaging, styling note.': { zh: '发簪、纹样卡、礼盒包装、佩戴说明。', es: 'Horquilla, tarjeta de motivos, embalaje y nota de estilo.' }
    , 'Hairpin inspired by inlay and lacquer-like ornament.': { zh: '以螺钿与漆艺装饰为灵感的发簪。', es: 'Horquilla inspirada en la incrustación y la ornamentación tipo laca.' }
    , 'Gift packaging and a concise styling note.': { zh: '礼盒包装与简明的佩戴说明。', es: 'Embalaje de regalo y una breve nota de estilo.' }
    , 'Works well as a premium small-object gift.': { zh: '适合作为精致的小型文化礼物。', es: 'Funciona bien como regalo cultural de pequeño formato.' }
    , 'Best for buyers who want a decorative object with a story.': { zh: '适合想要一件有故事的装饰性文化物件的购买者。', es: 'Ideal para quienes buscan un objeto decorativo con historia.' }
    , 'Keep it refined and not overly decorative.': { zh: '保持精致，不做过度装饰。', es: 'Mantenerlo refinado y sin exceso decorativo.' }
    , 'Good as a polished gift set rather than a raw kit.': { zh: '更适合作为完成度高的礼盒，而不是散装材料包。', es: 'Mejor como set regalo acabado que como kit sin terminar.' }
    , 'Starter knot materials, motif card, and guide when listed.': { zh: '盘扣入门材料、纹样卡，以及标注包含时提供的指南。', es: 'Materiales iniciales para nudos, tarjeta de motivos y guía cuando se indique.' }
    , 'Join the teacher-led Beijing Pankou workshop as a separate booking.': { zh: '老师带领的北京盘扣体验课需要单独预约。', es: 'El taller Pankou de Pekín con profesor se reserva por separado.' }
    , 'Starter knot materials': { zh: '盘扣入门材料', es: 'Materiales iniciales para nudos' }
    , 'Join the teacher-led Beijing Pankou workshop as a separate booking': { zh: '单独预约老师带领的北京盘扣体验课', es: 'Reserva por separado el taller Pankou de Pekín con profesor' }
    , 'Starter knot materials for learning the basic construction.': { zh: '用于学习基本结构的盘扣入门材料。', es: 'Materiales iniciales para aprender la construcción básica.' }
    , 'An English motif card and maker guide when included.': { zh: '商品标注时提供英文纹样卡与制作指南。', es: 'Tarjeta de motivos en inglés y guía de elaboración cuando se incluya.' }
    , 'The teacher-led Pankou workshop is a separate Beijing experience.': { zh: '老师带领的盘扣体验课是独立的北京体验。', es: 'El taller Pankou con profesor es una experiencia separada en Pekín.' }
    , 'Finished wearable Pankou pieces are presented separately from the craft kit.': { zh: '可穿戴的盘扣成品与手作材料包分开呈现。', es: 'Las piezas Pankou para llevar se presentan por separado del kit artesanal.' }
    , 'Best for guests who want to learn a craft before or after travel.': { zh: '适合想在旅行前后学习一项手艺的客人。', es: 'Ideal para quienes quieren aprender una artesanía antes o después del viaje.' }
    , 'The kit and the teacher-led workshop are separate offers.': { zh: '材料包与老师带领的体验课是两个独立的产品。', es: 'El kit y el taller con profesor son ofertas separadas.' }
    , 'One of the two Beijing workshop directions beside fragrance bead making.': { zh: '这是北京两条体验课方向之一，另一条是合香珠制作。', es: 'Es una de las dos líneas de talleres de Pekín, junto a la elaboración de cuentas aromáticas.' }
    , 'Line sheets, pigment stories, brush, video guide.': { zh: '线稿纸、颜料故事卡、练习笔、视频教程。', es: 'Hojas de líneas, historias de pigmentos, pincel y guía de vídeo.' }
    , 'pigment stories': { zh: '颜料故事卡', es: 'Historias de pigmentos' }
    , 'Authorized line-study sheets and pigment story cards.': { zh: '经过授权的线稿练习纸与颜料故事卡。', es: 'Hojas autorizadas de estudio de líneas y tarjetas sobre pigmentos.' }
    , 'Practice brush and a video guide for at-home learning.': { zh: '用于居家学习的练习笔与视频教程。', es: 'Pincel de práctica y guía de vídeo para aprender en casa.' }
    , 'A premium kit, not just a digital image product.': { zh: '一套完整材料包，而不只是数字图像产品。', es: 'Un kit completo, no solo un producto de imagen digital.' }
    , 'Edition details, teacher guidance, and route conditions are confirmed before release.': { zh: '版本详情、老师指导与路线条件会在发布前确认。', es: 'Los detalles de la edición, la guía del profesor y las condiciones de la ruta se confirman antes de ofrecerla.' }
    , 'Best for travelers who want a serious craft and study object.': { zh: '适合想认真学习一项手艺并拥有学习物件的旅行者。', es: 'Ideal para viajeros que buscan un objeto serio de estudio y artesanía.' }
    , 'The images and teacher details are confirmed before this edition is offered.': { zh: '图片使用和老师信息会在这个版本提供前确认。', es: 'Las imágenes y los datos del profesor se confirman antes de ofrecer esta edición.' }
    , 'Tea set, note cards, serving guide, motif story.': { zh: '茶具、说明卡、冲泡指南、纹样故事。', es: 'Juego de té, tarjetas, guía para servir e historia del motivo.' }
    , 'serving guide': { zh: '冲泡指南', es: 'Guía para servir' }
    , 'Compact tea set with a clean persimmon motif.': { zh: '带有简洁柿子纹样的便携茶具。', es: 'Juego de té compacto con un motivo de caqui limpio.' }
    , 'Tea note cards and a short cultural serving guide.': { zh: '茶品说明卡与简短的文化冲泡指南。', es: 'Tarjetas de té y una breve guía cultural para servir.' }
    , 'Works as both a gift and a travel memory object.': { zh: '既可以作为礼物，也可以作为旅行记忆物件。', es: 'Funciona como regalo y como objeto de recuerdo del viaje.' }
    , 'Best for calm gift buyers and tea-oriented travelers.': { zh: '适合喜欢从容礼物与茶文化的旅行者。', es: 'Ideal para compradores de regalos serenos y viajeros interesados en el té.' }
    , 'Good as a compact route-linked object.': { zh: '适合作为连接路线的小型文化物件。', es: 'Un objeto compacto bien conectado con la ruta.' }
    , 'Seal stone, carving tools, ink paste, test paper.': { zh: '印石、篆刻工具、印泥、试印纸。', es: 'Piedra de sello, herramientas, pasta de tinta y papel de prueba.' }
    , 'A compact Yangzhou carving set for home practice.': { zh: '一套适合居家练习的扬州小型篆刻套装。', es: 'Un set compacto de tallado de Yangzhou para practicar en casa.' }
    , 'carving tools': { zh: '篆刻工具', es: 'Herramientas de tallado' }
    , 'Seal stone, carving tools, ink paste, and test paper.': { zh: '印石、篆刻工具、印泥与试印纸。', es: 'Piedra de sello, herramientas, pasta de tinta y papel de prueba.' }
    , 'Name-seal story card and English explanation card.': { zh: '人名章故事卡与英文说明卡。', es: 'Tarjeta sobre el sello personal y tarjeta explicativa en inglés.' }
    , 'Useful for home practice and as a gift object.': { zh: '适合居家练习，也适合作为文化礼物。', es: 'Útil para practicar en casa y como objeto de regalo.' }
    , 'Best for buyers who want a tactile name-seal kit.': { zh: '适合想亲手体验人名章材料包的购买者。', es: 'Ideal para quienes buscan un kit táctil de sello personal.' }
    , 'Keep the toolkit compact and practical.': { zh: '保持工具包小巧实用。', es: 'Mantener el kit compacto y práctico.' }
    , 'Good as a second Yangzhou product beside movable type.': { zh: '适合作为扬州文化礼物的实用补充。', es: 'Un complemento práctico para un regalo cultural de Yangzhou.' }
    , '$79-$99 · Premium $129-$189': { zh: '$79-$99 · 高配版 $129-$189', es: '$79-$99 · Edición premium $129-$189' }
    , 'Wooden structure, hand finish, story cards.': { zh: '木质结构、手工细节、故事卡。', es: 'Estructura de madera, acabado a mano y tarjetas culturales.' }
    , 'Wooden structure': { zh: '木质结构', es: 'Estructura de madera' }
    , 'Wooden interlocking structure inspired by Tulou architecture.': { zh: '以土楼建筑为灵感的木质拼插结构。', es: 'Estructura de madera encajable inspirada en la arquitectura Tulou.' }
    , 'Hand-finished details and English story cards.': { zh: '手工完成的细节与英文故事卡。', es: 'Detalles acabados a mano y tarjetas culturales en inglés.' }
    , 'Suitable for education, display, and family-oriented gifting.': { zh: '适合教育、展示与家庭送礼。', es: 'Adecuado para educación, exposición y regalos familiares.' }
    , 'Best for architecture lovers and family education buyers.': { zh: '适合建筑爱好者与重视家庭教育的购买者。', es: 'Ideal para amantes de la arquitectura y compradores interesados en la educación familiar.' }
    , 'Works as a premium model kit with a real story behind it.': { zh: '一套有真实文化故事支撑的高配模型材料包。', es: 'Un kit de modelo premium con una historia cultural real detrás.' }
    , 'pronunciation note': { zh: '发音说明', es: 'Nota de pronunciación' }
    , 'calligraphy tag': { zh: '书法标签', es: 'Etiqueta caligráfica' }
    , 'seal explanation': { zh: '印章说明', es: 'Explicación del sello' }
    , 'A small entry kit for writing and seal culture': { zh: '进入书写与印章文化的小型入门包', es: 'Un pequeño kit de entrada a la escritura y la cultura del sello' }
    , 'gift packaging': { zh: '礼盒包装', es: 'Embalaje de regalo' }
    , 'and guide when listed': { zh: '以及标注包含时提供的指南', es: 'y guía cuando se indique' }
    , 'A compact Yangzhou carving set for home practice': { zh: '一套适合居家练习的扬州小型篆刻套装', es: 'Un set compacto de tallado de Yangzhou para practicar en casa' }
    , 'Choose from the destination product shelf: fragrance, name and seal, handwork, Thangka, tea, Yangzhou carving and movable type, Suzhou embroidery, or Tulou architecture.': { zh: '从目的地产品货架中选择：香气、中文名字与人名章、手工艺、唐卡、茶、扬州篆刻与活字、苏州刺绣，或土楼建筑。', es: 'Elige de la estantería por destino: fragancia, nombre y sello, artesanía, Thangka, té, tallado y tipos móviles de Yangzhou, bordado de Suzhou o arquitectura Tulou.' }
    , 'Beijing / $59-$119': { zh: '北京 / $59-$119', es: 'Pekín / $59-$119' }
    , 'Suzhou / $59-$119': { zh: '苏州 / $59-$119', es: 'Suzhou / $59-$119' }
    , 'Yangzhou / $49-$98': { zh: '扬州 / $49-$98', es: 'Yangzhou / $49-$98' }
    , 'Wooden movable type blocks, brush card, ink tray, English story card, and a practical Yangzhou object; a separate workshop can be requested.': { zh: '木质活字模块、笔刷卡、墨盘、英文故事卡，以及一件实用的扬州文化物件；体验课可以单独咨询。', es: 'Bloques de tipos móviles de madera, tarjeta de pincel, bandeja de tinta, historia en inglés y un objeto práctico de Yangzhou; el taller puede solicitarse por separado.' }
    , 'Botanical materials, tools, video guide, note cards.': { zh: '草木材料、工具、视频教程、说明卡。', es: 'Materiales botánicos, herramientas, guía de vídeo y tarjetas.' }
    , 'Use it as a starter kit before a future Beijing scent workshop.': { zh: '在未来北京香气体验课前，先用它开始学习。', es: 'Úsalo como kit inicial antes de un futuro taller aromático en Pekín.' }
    , 'Botanical materials and making tools for bead making.': { zh: '用于制作合香珠的草木材料与手作工具。', es: 'Materiales botánicos y herramientas para elaborar cuentas.' }
    , 'Color notes and a short English video guide.': { zh: '颜色说明与简短的英文视频教程。', es: 'Notas de color y una breve guía de vídeo en inglés.' }
    , 'A small entry product that can lead into a stronger workshop.': { zh: '从一个小型入门产品开始，再进入更完整的体验课。', es: 'Un producto de entrada que puede llevar a un taller más completo.' }
    , 'Release only after ingredients and shipping rules are clear.': { zh: '确认材料成分与寄送规则后再正式提供。', es: 'Se ofrecerá cuando estén claros los ingredientes y las reglas de envío.' }
    , 'Best for travelers who want a hands-on starter object before travel.': { zh: '适合想在出发前先亲手体验一件文化物件的旅行者。', es: 'Ideal para viajeros que quieren un objeto práctico antes de viajar.' }
    , 'Good as a low-friction add-on to the Beijing fragrance story.': { zh: '适合作为北京香气故事的轻量补充。', es: 'Un complemento sencillo para la historia aromática de Pekín.' }
    , 'Pre-order only until the ingredient list and shipping routes are checked.': { zh: '确认成分清单与寄送路线前，仅接受预售咨询。', es: 'Solo preventa hasta comprobar los ingredientes y las rutas de envío.' }
    , 'In-person workshops are arranged separately after we discuss your travel plans.': { zh: '线下体验课会在讨论你的旅行计划后单独安排。', es: 'Los talleres presenciales se organizan por separado después de hablar sobre tu viaje.' }
    , 'Embroidery base, guide, motif card, video guide.': { zh: '刺绣底布、指南、纹样卡、视频教程。', es: 'Base de bordado, guía, tarjeta de motivos y vídeo.' }
    , 'Starter embroidery base with a beginner stitch guide.': { zh: '配有初学针法指南的刺绣入门底布。', es: 'Base de bordado inicial con guía de puntadas para principiantes.' }
    , 'Garden motif card and English video guide.': { zh: '园林纹样卡与英文视频教程。', es: 'Tarjeta de motivos de jardín y guía de vídeo en inglés.' }
    , 'A classic Suzhou entry object with a soft learning curve.': { zh: '一件经典的苏州入门物件，学习过程从容友好。', es: 'Un objeto clásico de entrada a Suzhou con una curva de aprendizaje amable.' }
    , 'Can support a later workshop inquiry.': { zh: '之后可以继续咨询相关体验课。', es: 'Más adelante puede abrir una consulta sobre el taller.' }
    , 'Best for travelers who like calm handwork and garden motifs.': { zh: '适合喜欢从容手作与园林纹样的旅行者。', es: 'Ideal para viajeros a quienes gustan las manualidades pausadas y los motivos de jardín.' }
    , 'Works as a gentle Suzhou entry product.': { zh: '适合作为进入苏州文化的温和入口。', es: 'Funciona como una entrada amable a la cultura de Suzhou.' }
    , 'Keep the design delicate and usable.': { zh: '保持设计精致，并且真正可以使用。', es: 'Mantener el diseño delicado y utilizable.' }
    , 'Wooden type blocks, brush card, ink tray, story card.': { zh: '木质活字模块、笔刷卡、墨盘、故事卡。', es: 'Bloques de tipos móviles, tarjeta de pincel, bandeja de tinta y tarjeta de historia.' }
    , 'A practical Yangzhou object with workshop potential.': { zh: '一件实用的扬州文化物件，也可以连接未来工作坊。', es: 'Un objeto práctico de Yangzhou con posibilidad de taller.' }
    , 'Wooden movable type blocks adapted into a practical kit.': { zh: '将木质活字模块转化为可以实际使用的材料包。', es: 'Bloques de tipos móviles de madera convertidos en un kit práctico.' }
    , 'Brush card and English story card for context.': { zh: '笔刷卡与英文故事卡，帮助理解文化背景。', es: 'Tarjeta de pincel e historia en inglés para entender el contexto.' }
    , 'Useful on a desk, as a study object, or as a gift.': { zh: '可以放在书桌上使用，也可以作为学习物件或礼物。', es: 'Útil en el escritorio, como objeto de estudio o como regalo.' }
    , 'Best for people who want a practical cultural object.': { zh: '适合想要一件实用文化物件的人。', es: 'Ideal para quienes buscan un objeto cultural práctico.' }
    , 'Keep the object useful, not just decorative.': { zh: '让物件真正有用，而不只是装饰。', es: 'Mantenerlo útil, no solo decorativo.' }
    , 'The workshop path can be sold separately.': { zh: '体验课路线可以单独咨询和购买。', es: 'La experiencia de taller puede consultarse y adquirirse por separado.' }
  });

  const MESSAGE_KEYS = {
    en: 'Language switched to English. Forms and page controls are now in English.',
    zh: 'Language switched to Chinese. Forms and page controls are now in Chinese.',
    es: 'Language switched to Spanish. Forms and page controls are now in Spanish.'
  };

  function translate(value, locale = currentLocale) {
    if (!value || locale === 'en') return value;
    const entry = TEXT[value];
    return entry && entry[locale] ? entry[locale] : value;
  }

  function localeFrom(value) {
    return LOCALES.includes(value) ? value : null;
  }

  function readLocale() {
    const fromUrl = localeFrom(new URLSearchParams(window.location.search).get('lang'));
    if (fromUrl) return fromUrl;
    try {
      const stored = localeFrom(window.localStorage.getItem(STORAGE_KEY));
      if (stored) return stored;
    } catch (_) {}
    return 'en';
  }

  function rememberText(node) {
    if (!textNodes.has(node)) textNodes.set(node, node.nodeValue);
    return textNodes.get(node);
  }

  function rememberAttribute(element, name) {
    let stored = attributes.get(element);
    if (!stored) {
      stored = {};
      attributes.set(element, stored);
    }
    if (!(name in stored)) stored[name] = element.getAttribute(name);
    return stored[name];
  }

  function walkText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(textNode => {
      const parent = textNode.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA'].includes(parent.tagName)) return;
      const original = rememberText(textNode);
      const trimmed = original.trim();
      if (!trimmed) return;
      const replacement = translate(trimmed);
      const start = original.indexOf(trimmed);
      const end = start + trimmed.length;
      const next = original.slice(0, start) + replacement + original.slice(end);
      if (textNode.nodeValue !== next) textNode.nodeValue = next;
    });
  }

  function ensureOptionValues() {
    document.querySelectorAll('select option').forEach(option => {
      if (!option.dataset.drcOriginalLabel) option.dataset.drcOriginalLabel = option.textContent.trim();
      if (!option.hasAttribute('value')) option.value = option.dataset.drcOriginalLabel;
    });
  }

  function translateAttributes() {
    document.querySelectorAll('input, textarea').forEach(element => {
      const original = rememberAttribute(element, 'placeholder');
      if (original && PLACEHOLDERS[original] && PLACEHOLDERS[original][currentLocale]) {
        element.setAttribute('placeholder', PLACEHOLDERS[original][currentLocale]);
      }
    });
    document.querySelectorAll('select optgroup').forEach(element => {
      const original = rememberAttribute(element, 'label');
      if (original) element.setAttribute('label', translate(original));
    });
    document.querySelectorAll('[aria-label]').forEach(element => {
      const original = rememberAttribute(element, 'aria-label');
      if (original) element.setAttribute('aria-label', translate(original));
    });
    document.querySelectorAll('[title]').forEach(element => {
      const original = rememberAttribute(element, 'title');
      if (original) element.setAttribute('title', translate(original));
    });
    document.querySelectorAll('img[alt]').forEach(element => {
      const original = rememberAttribute(element, 'alt');
      if (original) element.setAttribute('alt', translate(original));
    });
  }

  function updateTitle() {
    const original = document.body.dataset.drcOriginalTitle || document.title;
    document.body.dataset.drcOriginalTitle = original;
    const translated = TITLE_TRANSLATIONS[original];
    document.title = translated && translated[currentLocale] ? translated[currentLocale] : original;
  }

  function addSwitcherStyle() {
    if (document.getElementById('drc-language-style')) return;
    const style = document.createElement('style');
    style.id = 'drc-language-style';
    style.textContent = `
      .drc-language-switcher{display:flex;align-items:center;gap:4px;border:1px solid rgba(17,17,17,.16);background:rgba(255,255,255,.78);padding:4px;z-index:60}
      .drc-language-switcher span{padding:0 5px;color:#666c70;font-size:10px;letter-spacing:.12em;text-transform:uppercase}
      .drc-language-switcher button{border:0;background:transparent;color:#666c70;min-height:28px;padding:0 8px;font:inherit;font-size:11px;letter-spacing:.08em;cursor:pointer}
      .drc-language-switcher button[aria-pressed="true"]{background:#111;color:#fff}
      header.top>.drc-language-switcher{margin-left:14px;flex-shrink:0}
      header.header{position:relative}
      header.header>.drc-language-switcher{position:absolute;top:16px;right:18px}
      @media(max-width:900px){header.top{height:auto;min-height:76px;flex-wrap:wrap;padding:14px 0;gap:12px}header.top>.drc-language-switcher{margin-left:auto}header.header>.drc-language-switcher{position:static;margin:12px 0 0 auto}}
    `;
    document.head.appendChild(style);
  }

  function makeSwitcher(header) {
    let switcher = document.querySelector('.language-switcher');
    if (!switcher && header) {
      switcher = document.createElement('div');
      switcher.className = 'language-switcher drc-language-switcher';
      switcher.setAttribute('aria-label', 'Choose reply language');
      switcher.innerHTML = '<span>Reply</span><button type="button" data-lang="en" aria-label="English">EN</button><button type="button" data-lang="zh" aria-label="Chinese">中文</button><button type="button" data-lang="es" aria-label="Spanish">ES</button>';
      if (header.classList.contains('topbar') && header.querySelector('.header-tools')) {
        header.querySelector('.header-tools').prepend(switcher);
      } else {
        header.appendChild(switcher);
      }
    }
    if (!switcher) return;
    switcher.classList.add('drc-language-switcher');
    switcher.querySelectorAll('button[data-lang]').forEach(button => {
      if (button.dataset.drcBound === 'true') return;
      button.dataset.drcBound = 'true';
      button.addEventListener('click', () => setLocale(button.dataset.lang));
    });
  }

  function syncSwitchers() {
    document.querySelectorAll('.language-switcher, .drc-language-switcher').forEach(switcher => {
      switcher.setAttribute('aria-label', currentLocale === 'zh' ? '选择语言' : currentLocale === 'es' ? 'Elegir idioma' : 'Choose reply language');
      switcher.querySelectorAll('button[data-lang]').forEach(button => {
        const active = button.dataset.lang === currentLocale;
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
        button.setAttribute('aria-label', button.dataset.lang === 'zh' ? '中文' : button.dataset.lang === 'es' ? 'Español' : 'English');
      });
    });
  }

  function syncPreferredLanguage() {
    const select = document.getElementById('preferred-language');
    if (!select) return;
    const target = { en: 'English', zh: 'Chinese', es: 'Spanish' }[currentLocale];
    const option = [...select.options].find(item => item.dataset.drcOriginalLabel === target);
    if (option) select.value = option.value;
    if (select.dataset.drcBound === 'true') return;
    select.dataset.drcBound = 'true';
    select.addEventListener('change', () => {
      const original = select.selectedOptions[0] && select.selectedOptions[0].dataset.drcOriginalLabel;
      const next = original === 'Chinese' ? 'zh' : original === 'Spanish' ? 'es' : original === 'English' ? 'en' : null;
      if (next) setLocale(next);
    });
  }

  function showLanguageStatus() {
    const results = document.getElementById('site-search-results');
    if (!results) return;
    const continueText = translate('Continue to inquiry');
    const savedText = translate('Your language preference is saved across the site.');
    results.innerHTML = '<span>' + translate(MESSAGE_KEYS[currentLocale]) + '</span><a href="#inquiry"><strong>' + continueText + '</strong><span>' + savedText + '</span></a>';
    results.classList.add('is-open');
  }

  function setLocale(locale, options = {}) {
    if (!LOCALES.includes(locale)) return;
    currentLocale = locale;
    applying = true;
    document.documentElement.lang = locale;
    document.body.dataset.locale = locale;
    try { window.localStorage.setItem(STORAGE_KEY, locale); } catch (_) {}
    ensureOptionValues();
    walkText(document.body);
    translateAttributes();
    updateTitle();
    syncSwitchers();
    syncPreferredLanguage();
    applying = false;
    if (!options.silent) showLanguageStatus();
  }

  function init() {
    addSwitcherStyle();
    const header = document.querySelector('header.topbar, header.top, header.header');
    makeSwitcher(header);
    currentLocale = readLocale();
    setLocale(currentLocale, { silent: true });
    const observer = new MutationObserver(() => {
      if (applying) return;
      window.clearTimeout(mutationTimer);
      mutationTimer = window.setTimeout(() => setLocale(currentLocale, { silent: true }), 60);
    });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

  window.DRCI18n = {
    setLocale,
    getLocale: () => currentLocale,
    translate
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
