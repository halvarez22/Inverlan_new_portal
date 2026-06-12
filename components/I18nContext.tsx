import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'es' | 'en' | 'zh';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

export const translations: Translations = {
  // Header & Navigation
  'nav.home': { es: 'Inicio', en: 'Home', zh: '首页' },
  'nav.properties': { es: 'Propiedades', en: 'Properties', zh: '物业' },
  'nav.about': { es: 'Nosotros', en: 'About Us', zh: '关于我们' },
  'nav.services': { es: 'Servicios', en: 'Services', zh: '服务' },
  'nav.contact': { es: 'Contacto', en: 'Contact', zh: '联系' },
  'nav.login': { es: 'Ingresar', en: 'Login', zh: '登录' },
  'nav.portal': { es: 'Portal', en: 'Portal', zh: '门户' },
  'nav.logout': { es: 'Salir', en: 'Logout', zh: '登出' },
  'nav.dashboard': { es: 'Panel', en: 'Dashboard', zh: '仪表板' },
  
  // Hero Section
  'hero.title': { es: 'Tu mejor inversión está aquí', en: 'Your best investment is here', zh: '您最好的投资就在这里' },
  'hero.subtitle': { es: 'Describe la propiedad de tus sueños y la encontraremos para ti.', en: 'Describe your dream property and we will find it for you.', zh: '描述您梦想中的房产，我们将为您找到它。' },
  'hero.search_placeholder': { es: 'Ej: Casa con alberca en Querétaro', en: 'Ex: House with pool in Queretaro', zh: '例如：奎雷塔罗带泳池的房子' },
  'hero.search_button': { es: 'Buscar', en: 'Search', zh: '搜索' },

  // Scrolling Banner
  'banner.text': { es: '¿Deseas vender, comprar o rentar? Nosotros nos encargamos', en: 'Do you want to sell, buy or rent? We take care of it', zh: '您想出售、购买还是租赁？我们来负责' },
  'banner.cta': { es: 'Contáctanos', en: 'Contact Us', zh: '联系我们' },

  // Property Listings
  'listings.title': { es: 'Propiedades Destacadas', en: 'Featured Properties', zh: '精选房产' },
  'listings.filter_all': { es: 'Todos', en: 'All', zh: '全部' },
  'listings.price': { es: 'Precio', en: 'Price', zh: '价格' },
  'listings.location': { es: 'Ubicación', en: 'Location', zh: '位置' },
  'listings.view_details': { es: 'Ver Detalles', en: 'View Details', zh: '查看详情' },
  'listings.no_results': { es: 'No se encontraron propiedades con estos filtros.', en: 'No properties found with these filters.', zh: '未找到符合这些筛选条件的房产。' },
  'listings.beds': { es: 'hab.', en: 'beds', zh: '卧室' },
  'listings.baths': { es: 'baños', en: 'baths', zh: '浴室' },
  'listings.for_sale': { es: 'Venta', en: 'For Sale', zh: '出售' },
  'listings.for_rent': { es: 'Renta', en: 'For Rent', zh: '出租' },
  'listings.for_development': { es: 'Desarrollo', en: 'Development', zh: '开发' },
  'listings.for_temporary_rent': { es: 'Renta Temporal', en: 'Temporary Rent', zh: '短期租赁' },
  
  'listings.filter_title': { es: 'Filtrar Propiedades', en: 'Filter Properties', zh: '筛选房产' },
  'listings.filter_operation_type': { es: 'Tipo de Operación', en: 'Operation Type', zh: '操作类型' },
  'listings.filter_type': { es: 'Tipo de Propiedad', en: 'Property Type', zh: '房产类型' },
  'listings.filter_type_placeholder': { es: 'Ej: Casa', en: 'Ex: House', zh: '例如：房子' },
  'listings.filter_location': { es: 'Ubicación', en: 'Location', zh: '位置' },
  'listings.filter_location_placeholder': { es: 'Ej: Querétaro', en: 'Ex: Queretaro', zh: '例如：奎雷塔罗' },
  'listings.filter_price_range': { es: 'Rango de Precios', en: 'Price Range', zh: '价格范围' },
  'listings.filter_bedrooms': { es: 'Habitaciones', en: 'Bedrooms', zh: '卧室' },
  'listings.filter_bathrooms': { es: 'Baños', en: 'Bathrooms', zh: '浴室' },
  'listings.filter_parking': { es: 'Estacionamiento', en: 'Parking', zh: '停车位' },
  'listings.filter_area': { es: 'Superficie (m²)', en: 'Area (m²)', zh: '面积 (平方米)' },
  'listings.filter_amenities': { es: 'Amenidades', en: 'Amenities', zh: '设施' },
  'listings.filter_min': { es: 'Mín.', en: 'Min.', zh: '最小' },
  'listings.filter_clear': { es: 'Limpiar Filtros', en: 'Clear Filters', zh: '清除筛选' },
  'listings.found_count': { es: 'propiedades encontradas', en: 'properties found', zh: '找到的房产' },
  'listings.view_grid': { es: 'Grid', en: 'Grid', zh: '网格' },
  'listings.view_map': { es: 'Mapa', en: 'Map', zh: '地图' },
  
  // Property Detail
  'detail.back': { es: 'Volver al listado', en: 'Back to listings', zh: '返回列表' },
  'detail.description': { es: 'Descripción', en: 'Description', zh: '描述' },
  'detail.features': { es: 'Características', en: 'Features', zh: '特征' },
  'detail.location': { es: 'Ubicación', en: 'Location', zh: '位置' },
  'detail.contact_agent': { es: 'Contactar Agente', en: 'Contact Agent', zh: '联系代理人' },
  'detail.schedule_visit': { es: 'Agendar Visita', en: 'Schedule Visit', zh: '预约参观' },
  'detail.amenities': { es: 'Amenidades', en: 'Amenities', zh: '设施' },
  'detail.area': { es: 'Superficie', en: 'Area', zh: '面积' },
  'detail.type': { es: 'Tipo', en: 'Type', zh: '类型' },
  'detail.videos': { es: 'Videos de la Propiedad', en: 'Property Videos', zh: '房产视频' },
  'detail.virtual_tour': { es: 'Recorridos Virtuales 360°', en: '360° Virtual Tours', zh: '360° 虚拟导览' },
  'detail.tour': { es: 'Recorrido', en: 'Tour', zh: '导览' },
  'detail.watch_youtube': { es: 'Ver en YouTube', en: 'Watch on YouTube', zh: '在 YouTube 上查看' },
  'detail.view_tour': { es: 'Ver Recorrido 360°', en: 'View 360° Tour', zh: '查看 360° 导览' },
  'detail.view_tour_on_external_site': { es: 'Ver recorrido en sitio externo', en: 'View tour on external site', zh: '在外部网站上查看导览' },
  'detail.interested': { es: '¿Interesado?', en: 'Interested?', zh: '感兴趣吗？' },
  'detail.interested_text': { es: 'Contacta a un asesor para agendar una visita o recibir más información.', en: 'Contact an advisor to schedule a visit or receive more information.', zh: '联系顾问预约参观或获取更多信息。' },
  'detail.request_info': { es: 'Solicitar Información', en: 'Request Information', zh: '索取信息' },
  'detail.download_datasheet': { es: 'Descargar Ficha Informativa', en: 'Download Property Sheet', zh: '下载房产信息表' },
  'detail.download_datasheet_info': { es: 'Exportar como PDF para imprimir o enviar', en: 'Export as PDF to print or send', zh: '导出为 PDF 以打印或发送' },

  // Amenities
  'amenity.pool': { es: 'Alberca', en: 'Pool', zh: '泳池' },
  'amenity.garden': { es: 'Jardín', en: 'Garden', zh: '花园' },
  'amenity.garage': { es: 'Garage', en: 'Garage', zh: '车库' },
  'amenity.security': { es: 'Seguridad', en: 'Security', zh: '安保' },
  'amenity.balcony': { es: 'Balcón', en: 'Balcony', zh: '阳台' },
  'amenity.terrace': { es: 'Terraza', en: 'Terrace', zh: '露台' },
  'amenity.air_conditioning': { es: 'Aire Acondicionado', en: 'Air Conditioning', zh: '空调' },
  'amenity.heating': { es: 'Calefacción', en: 'Heating', zh: '暖气' },
  'amenity.gym': { es: 'Gimnasio', en: 'Gym', zh: '健身房' },
  'amenity.elevator': { es: 'Elevador', en: 'Elevator', zh: '电梯' },
  'amenity.parking': { es: 'Estacionamiento', en: 'Parking', zh: '停车位' },
  'amenity.furnished': { es: 'Amueblado', en: 'Furnished', zh: '带家具' },
  'amenity.wifi': { es: 'WiFi', en: 'WiFi', zh: '无线网络' },
  'amenity.tv': { es: 'TV', en: 'TV', zh: '电视' },
  'amenity.laundry': { es: 'Lavandería', en: 'Laundry', zh: '洗衣设施' },
  'amenity.kitchen': { es: 'Cocina', en: 'Kitchen', zh: '厨房' },
  'amenity.closet': { es: 'Closet', en: 'Closet', zh: '衣柜' },
  'amenity.central_location': { es: 'Ubicación Central', en: 'Central Location', zh: '中心位置' },
  'amenity.near_school': { es: 'Cerca de Escuela', en: 'Near School', zh: '靠近学校' },
  'amenity.near_park': { es: 'Cerca de Parque', en: 'Near Park', zh: '靠近公园' },
  'amenity.near_shopping': { es: 'Cerca de Tiendas', en: 'Near Shopping', zh: '靠近商场' },

  // About Page
  'about.title': { es: 'Sobre Nosotros', en: 'About Us', zh: '关于我们' },
  'about.subtitle': { 
    es: 'En Inverland, entendemos que encontrar el lugar perfecto para llamar hogar es un paso crucial en la vida de cada persona.', 
    en: 'At Inverland, we understand that finding the perfect place to call home is a crucial step in every person\'s life.', 
    zh: '在 Inverland，我们深知寻找一个完美的家是每个人生命中至关重要的一步。' 
  },
  'about.mission': { es: 'Nuestra Misión', en: 'Our Mission', zh: '我们的使命' },
  'about.mission_text': { 
    es: 'Nuestra misión es proporcionar a nuestros clientes un servicio personalizado y de alta calidad, centrado en la protección y gestión ética de su patrimonio de manera profesional y transparente.', 
    en: 'Our mission is to provide our clients with a personalized and high-quality service, focused on the protection and ethical management of their assets in a professional and transparent manner.', 
    zh: '我们的使命是为客户提供个性化、高质量的服务，专注于以专业、透明的方式保护和道德管理他们的资产。' 
  },
  'about.commitment': { es: 'Compromiso Total', en: 'Total Commitment', zh: '全面承诺' },
  'about.commitment_sub': { es: 'Con cada cliente y proyecto', en: 'With every client and project', zh: '对每一位客户和每一个项目' },
  'about.values_title': { es: 'Nuestros Valores', en: 'Our Values', zh: '我们的价值观' },
  'about.values_subtitle': { es: 'Los principios que guían cada una de nuestras acciones y decisiones', en: 'The principles that guide each of our actions and decisions', zh: '指导我们每一个行动和决策的原则' },
  'about.v1_title': { es: 'Honestidad y Transparencia', en: 'Honesty and Transparency', zh: '诚实与透明' },
  'about.v1_desc': { 
    es: 'Nuestro personal está capacitado para actuar de manera profesional, leal y ética en todas sus interacciones con las personas, asegurando la transparencia en cada transacción.', 
    en: 'Our staff is trained to act in a professional, loyal and ethical manner in all their interactions with people, ensuring transparency in every transaction.', 
    zh: '我们的员工经过培训，在与人的所有互动中都以专业、忠诚和道德的方式行事，确保每笔交易的透明度。' 
  },
  'about.v2_title': { es: 'Colaboración', en: 'Collaboration', zh: '协作' },
  'about.v2_desc': { 
    es: 'Fomentamos la colaboración activa entre todos los miembros de nuestro equipo, trabajando juntos para alcanzar un objetivo común que se traduzca en una experiencia mejorada para nuestros clientes.', 
    en: 'We encourage active collaboration between all members of our team, working together to reach a common goal that translates into an improved experience for our clients.', 
    zh: '我们鼓励团队所有成员之间的积极协作，共同努力实现一个共同目标，从而为我们的客户带来更好的体验。' 
  },
  'about.v3_title': { es: 'Servicio', en: 'Service', zh: '服务' },
  'about.v3_desc': { 
    es: 'La satisfacción de nuestros clientes es nuestra máxima prioridad en cada trámite y proceso inmobiliario. La confianza que depositan en nosotros es nuestro mayor logro.', 
    en: 'The satisfaction of our clients is our highest priority in every real estate procedure and process. The trust they place in us is our greatest achievement.', 
    zh: '客户的满意是我们每一个房地产程序和过程中的最高优先级。他们对我们的信任是我们最大的成就。' 
  },
  'about.stats_title': { es: 'Nuestro Impacto', en: 'Our Impact', zh: '我们的影响' },
  'about.stats_subtitle': { es: 'Transformando el panorama inmobiliario de México', en: 'Transforming the real estate landscape of Mexico', zh: '改变墨西哥的房地产格局' },
  'about.stat1_label': { es: 'Propiedades Gestionadas', en: 'Properties Managed', zh: '管理的房产' },
  'about.stat2_label': { es: 'Clientes Satisfechos', en: 'Satisfied Clients', zh: '满意的客户' },
  'about.stat3_label': { es: 'Años de Experiencia', en: 'Years of Experience', zh: '多年经验' },
  'about.stat4_label': { es: 'Agentes Especializados', en: 'Specialized Agents', zh: '专业经纪人' },
  'about.cta_title': { es: '¿Listo para encontrar tu hogar ideal?', en: 'Ready to find your ideal home?', zh: '准备好寻找您理想的家了吗？' },
  'about.cta_subtitle': { es: 'Permítenos ayudarte a encontrar la propiedad perfecta que se adapte a tus necesidades y sueños.', en: 'Let us help you find the perfect property that fits your needs and dreams.', zh: '让我们帮助您找到适合您需求和梦想的完美房产。' },
  'about.cta_btn1': { es: 'Ver Propiedades', en: 'View Properties', zh: '查看房产' },
  'about.cta_btn2': { es: 'Contactar Ahora', en: 'Contact Now', zh: '立即联系' },
  
  // Contact Page
  'contact.title': { es: 'Contáctanos', en: 'Contact Us', zh: '联系我们' },
  'contact.subtitle': { es: 'Estamos aquí para ayudarte a encontrar tu próxima inversión inmobiliaria.', en: 'We are here to help you find your next real estate investment.', zh: '我们在这里帮助您找到您的下一个房地产投资。' },
  'contact.info_title': { es: 'Información de Contacto', en: 'Contact Information', zh: '联系信息' },
  'contact.info_subtitle': { es: 'Nuestro equipo está listo para brindarte el mejor servicio inmobiliario. Contáctanos por cualquiera de estos medios.', en: 'Our team is ready to provide you with the best real estate service. Contact us through any of these means.', zh: '我们的团队随时准备为您提供最好的房地产服务。通过以下任何方式联系我们。' },
  'contact.form_title': { es: 'Envíanos un Mensaje', en: 'Send us a Message', zh: '给我们发送消息' },
  'contact.name': { es: 'Nombre Completo', en: 'Full Name', zh: '姓名' },
  'contact.name_placeholder': { es: 'Tu nombre completo', en: 'Your full name', zh: '您的全名' },
  'contact.email': { es: 'Correo Electrónico', en: 'Email', zh: '电子邮件' },
  'contact.email_placeholder': { es: 'tu@email.com', en: 'your@email.com', zh: '您的邮箱' },
  'contact.phone': { es: 'Teléfono', en: 'Phone', zh: '电话' },
  'contact.phone_placeholder': { es: 'Tu número de teléfono', en: 'Your phone number', zh: '您的电话' },
  'contact.subject': { es: 'Asunto', en: 'Subject', zh: '主题' },
  'contact.subject_placeholder': { es: 'Selecciona un asunto', en: 'Select a subject', zh: '选择主题' },
  'contact.subject_option1': { es: 'Compra de Propiedad', en: 'Property Purchase', zh: '购买房产' },
  'contact.subject_option2': { es: 'Venta de Propiedad', en: 'Property Sale', zh: '出售房产' },
  'contact.subject_option3': { es: 'Renta de Propiedad', en: 'Property Rental', zh: '租房' },
  'contact.subject_option4': { es: 'Inversión Inmobiliaria', en: 'Real Estate Investment', zh: '房地产投资' },
  'contact.subject_option5': { es: 'Consulta General', en: 'General Inquiry', zh: '一般咨询' },
  'contact.subject_option6': { es: 'Otro', en: 'Other', zh: '其他' },
  'contact.message': { es: 'Mensaje', en: 'Message', zh: '消息' },
  'contact.message_placeholder': { es: 'Cuéntanos cómo podemos ayudarte...', en: 'Tell us how we can help you...', zh: '告诉我们我们能如何帮您...' },
  'contact.send': { es: 'Enviar Mensaje', en: 'Send Message', zh: '发送消息' },
  'contact.sending': { es: 'Enviando...', en: 'Sending...', zh: '发送中...' },
  'contact.success': { es: '¡Gracias por contactarnos! Te responderemos pronto.', en: 'Thank you for contacting us! We will reply soon.', zh: '感谢您联系我们！我们将尽快回复。' },
  'contact.error': { es: 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.', en: 'There was an error sending the message. Please try again.', zh: '发送消息时出错。请重试。' },
  'contact.address': { es: 'Dirección', en: 'Address', zh: '地址' },
  'contact.cta_title': { es: '¿Prefieres llamarnos?', en: 'Prefer to call us?', zh: '更喜欢打电话？' },
  'contact.cta_btn': { es: 'Llamar Ahora', en: 'Call Now', zh: '立即致电' },
  'contact.whatsapp': { es: 'WhatsApp', en: 'WhatsApp', zh: 'WhatsApp' },
  'contact.map_title': { es: 'Encuéntranos', en: 'Find Us', zh: '找到我们' },
  'contact.cta_ready': { es: '¿Listo para dar el siguiente paso?', en: 'Ready to take the next step?', zh: '准备好迈出下一步了吗？' },
  'contact.cta_desc': { es: 'Nuestro equipo de expertos está aquí para ayudarte. Completa el formulario y nos pondremos en contacto contigo a la brevedad para asesorarte en tu próxima inversión.', en: 'Our team of experts is here to help you. Complete the form and we will contact you shortly to advise you on your next investment.', zh: '我们的专家团队随时为您提供帮助。填写表格，我们将很快与您联系，为您的下一次投资提供建议。' },
  'contact.our_location': { es: 'Nuestra Ubicación', en: 'Our Location', zh: '我们的位置' },
  'contact.visit_us': { es: 'Visítanos en nuestras oficinas en León, Guanajuato', en: 'Visit us at our offices in Leon, Guanajuato', zh: '欢迎访问我们在瓜纳华托州莱昂的办公室' },
  'contact.ready_to_find': { es: '¿Listo para encontrar tu próxima propiedad?', en: 'Ready to find your next property?', zh: '准备好寻找您的下一处房产了吗？' },
  'contact.team_here': { es: 'Nuestro equipo de expertos está aquí para ayudarte en cada paso del proceso.', en: 'Our team of experts is here to help you every step of the way.', zh: '我们的专家团队在此过程中的每一步为您提供帮助。' },
  
  // Servicios Page
  'services.title': { es: 'Nuestros Servicios', en: 'Our Services', zh: '我们的服务' },
  'services.subtitle': { es: 'En Inverland no solo vendemos propiedades, te acompañamos en todo el proceso con servicios especializados que garantizan tu tranquilidad y éxito.', en: 'At Inverland we don\'t just sell properties, we accompany you throughout the process with specialized services that guarantee your peace of mind and success.', zh: '在 Inverland，我们不仅仅是出售房产，我们在整个过程中为您提供专业服务，确保您的安心和成功。' },
  'services.what_means': { es: '¿Qué significa para ti?', en: 'What does it mean for you?', zh: '这对您意味着什么？' },
  'services.key_benefit': { es: 'Beneficio Clave', en: 'Key Benefit', zh: '核心优势' },
  'services.s1_title': { es: 'Acompañamiento Personalizado', en: 'Personalized Accompaniment', zh: '个性化陪同' },
  'services.s1_desc': { es: 'Un experto de Inverland te guía en cada paso, desde la búsqueda hasta la firma.', en: 'An Inverland expert guides you in every step, from searching to signing.', zh: 'Inverland 专家将指导您完成从搜索到签署的每一步。' },
  'services.s1_benefit': { es: 'Ahorro de Tiempo y Esfuerzo.', en: 'Time and Effort Saving.', zh: '节省时间和精力。' },
  'services.s2_title': { es: 'Certeza Legal (Blindaje)', en: 'Legal Certainty (Shielding)', zh: '法律确定性（屏蔽）' },
  'services.s2_desc': { es: 'Revisamos a detalle la documentación legal, gravámenes y permisos. Operamos con un "Due Diligence" exhaustivo de estándar internacional.', en: 'We review in detail the legal documentation, liens and permits. We operate with an exhaustive "Due Diligence" of international standard.', zh: '我们详细审查法律文件、留置权和许可证。我们按照国际标准的详尽“尽职调查”运作。' },
  'services.s2_benefit': { es: 'Máxima Seguridad Jurídica. Evitas fraudes y problemas a futuro.', en: 'Maximum Legal Security. You avoid fraud and future problems.', zh: '最大的法律保障。您避免了欺诈和未来的问题。' },
  'services.s3_title': { es: 'Gestión Notarial Eficiente', en: 'Efficient Notarial Management', zh: '高效的公证管理' },
  'services.s3_desc': { es: 'Coordinamos y preparamos todos los documentos para la firma ante Notario, asegurando un proceso rápido y sin contratiempos.', en: 'We coordinate and prepare all documents for the signature before a Notary, ensuring a fast and smooth process.', zh: '我们协调并准备所有文件以便在公证人面前签署，确保过程快速顺利。' },
  'services.s3_benefit': { es: 'Rapidez y Transparencia.', en: 'Speed and Transparency.', zh: '快速透明。' },
  'services.s4_title': { es: 'Asesoría Fiscal Básica', en: 'Basic Tax Advisory', zh: '基础税务咨询' },
  'services.s4_desc': { es: 'Te orientamos sobre los impuestos y gastos de escrituración asociados a tu operación de compra o venta.', en: 'We guide you on the taxes and deed expenses associated with your purchase or sale operation.', zh: '我们指导您了解与您的购买或出售操作相关的税收和契据费用。' },
  'services.s4_benefit': { es: 'Claridad en tus Costos. Sabes exactamente lo que pagarás.', en: 'Clarity in your Costs. You know exactly what you will pay.', zh: '成本清晰。您确切知道将支付多少。' },
  'services.s5_title': { es: 'Representación y Gestión', en: 'Representation and Management', zh: '代理与管理' },
  'services.s5_desc': { es: 'Si no puedes estar presente, podemos representarte legalmente para avanzar en los trámites con un poder notarial.', en: 'If you cannot be present, we can legally represent you to advance the procedures with a power of attorney.', zh: '如果您无法亲自到场，我们可以依法代表您通过委托书推进程序。' },
  'services.s5_benefit': { es: 'Flexibilidad Total (Ideal para mexicanos en el extranjero).', en: 'Total Flexibility (Ideal for Mexicans abroad).', zh: '全方位灵活性（非常适合身在国外的墨西哥人）。' },
  'services.cta_title': { es: '¿Listo para experimentar nuestros servicios?', en: 'Ready to experience our services?', zh: '准备好体验我们的服务了吗？' },
  'services.cta_subtitle': { es: 'Contáctanos y descubre cómo podemos hacer que tu experiencia inmobiliaria sea excepcional.', en: 'Contact us and discover how we can make your real estate experience exceptional.', zh: '联系我们，了解我们如何让您的房地产体验变得非凡。' },
  'services.cta_btn1': { es: 'Ver Propiedades', en: 'View Properties', zh: '查看房产' },
  'services.cta_btn2': { es: 'Contactar Ahora', en: 'Contact Now', zh: '立即联系' },
  
  // Login
  'login.title': { es: 'Iniciar Sesión', en: 'Login', zh: '登录' },
  'login.username': { es: 'Usuario o correo', en: 'Username or email', zh: '用户名或邮箱' },
  'login.password': { es: 'Contraseña', en: 'Password', zh: '密码' },
  'login.button': { es: 'Entrar', en: 'Login', zh: '登录' },
  'login.forgot': { es: '¿Olvidaste tu contraseña?', en: 'Forgot password?', zh: '忘记密码？' },
  'login.error': { es: 'Credenciales inválidas o usuario sin correo asociado.', en: 'Invalid credentials or user without associated email.', zh: '凭据无效或用户未关联邮箱。' },
  
  // Footer
  'footer.rights': { es: '© 2026 Inverland Portal. Todos los derechos reservados.', en: '© 2026 Inverland Portal. All rights reserved.', zh: '© 2026 Inverland Portal. 版权所有。' },
  'footer.contact_info': { es: 'Información de Contacto', en: 'Contact Information', zh: '联系信息' },
  'footer.quick_links': { es: 'Enlaces Rápidos', en: 'Quick Links', zh: '快速链接' },
  'footer.legal': { es: 'Legal', en: 'Legal', zh: '法律' },
  'footer.privacy': { es: 'Aviso de Privacidad', en: 'Privacy Notice', zh: '隐私声明' },
  'footer.terms': { es: 'Términos y Condiciones', en: 'Terms and Conditions', zh: '条款和条件' },
  
  // Property Types
  'type.Casa': { es: 'Casa', en: 'House', zh: '房子' },
  'type.Departamento': { es: 'Departamento', en: 'Apartment', zh: '公寓' },
  'type.Terreno': { es: 'Terreno', en: 'Land', zh: '土地' },
  'type.Oficina': { es: 'Oficina', en: 'Office', zh: '办公室' },
  'type.Local Comercial': { es: 'Local Comercial', en: 'Commercial Local', zh: '商业店面' },
  'type.Bodega Industrial': { es: 'Bodega Industrial', en: 'Industrial Warehouse', zh: '工业仓库' },
  'type.Loft': { es: 'Loft', en: 'Loft', zh: '阁楼' },
  'type.Villa': { es: 'Villa', en: 'Villa', zh: '别墅' },
  'type.Hacienda': { es: 'Hacienda', en: 'Hacienda', zh: '庄园' },

  // Amenities
  'amenity.Alberca': { es: 'Alberca', en: 'Pool', zh: '泳池' },
  'amenity.Jardín': { es: 'Jardín', en: 'Garden', zh: '花园' },
  'amenity.Vista al mar': { es: 'Vista al mar', en: 'Ocean View', zh: '海景' },
  'amenity.Gimnasio': { es: 'Gimnasio', en: 'Gym', zh: '健身房' },
  'amenity.Seguridad 24 horas': { es: 'Seguridad 24 horas', en: '24/7 Security', zh: '24小时安保' },
  'amenity.Terraza': { es: 'Terraza', en: 'Terrace', zh: '露台' },
  'amenity.Estacionamiento techado': { es: 'Estacionamiento techado', en: 'Covered Parking', zh: '室内停车' },
  'amenity.Roof garden': { es: 'Roof garden', en: 'Roof garden', zh: '屋顶花园' },
  'amenity.Salón de usos múltiples': { es: 'Salón de usos múltiples', en: 'Multi-purpose Room', zh: '多功能厅' },
  'amenity.Elevador': { es: 'Elevador', en: 'Elevator', zh: '电梯' },
  'amenity.Cuarto de servicio': { es: 'Cuarto de servicio', en: 'Service Room', zh: '佣人房' },
  'amenity.Fraccionamiento privado': { es: 'Fraccionamiento privado', en: 'Private Gated Community', zh: '私人社区' },
  'amenity.Balcón': { es: 'Balcón', en: 'Balcony', zh: '阳台' },
  'amenity.Vista al agua': { es: 'Vista al agua', en: 'Water View', zh: '水景' },
  'amenity.Capilla': { es: 'Capilla', en: 'Chapel', zh: '小教堂' },
  'chatbot.title': { es: 'Asistente Virtual', en: 'Virtual Assistant', zh: '虚拟助手' },
  'chatbot.welcome': { es: '¡Hola! Soy tu asistente virtual de Inverland. ¿En qué puedo ayudarte hoy?', en: 'Hello! I am your Inverland virtual assistant. How can I help you today?', zh: '你好！我是您的 Inverland 虚拟助手。今天我能帮您什么？' },
  'chatbot.placeholder': { es: 'Escribe un mensaje...', en: 'Type a message...', zh: '输入消息...' },
  'chatbot.error': { es: 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.', en: 'Sorry, I couldn\'t process your message. Please try again.', zh: '抱歉，我无法处理您的消息。请重试。' },
  'chatbot.system_instruction': { 
    es: 'Eres un asistente virtual de Inverland Portal. Tu objetivo es ayudar a los usuarios a encontrar propiedades y responder dudas inmobiliarias en México.', 
    en: 'You are an Inverland Portal virtual assistant. Your goal is to help users find properties and answer real estate questions in Mexico.', 
    zh: '您是 Inverland Portal 虚拟助手。您的目标是帮助用户寻找房产并回答墨西哥的房地产问题。' 
  },
  'datasheet.title': { es: 'FICHA INFORMATIVA', en: 'PROPERTY SHEET', zh: '房产信息表' },
  'datasheet.scan_for_details': { es: 'Escanea para más detalles', en: 'Scan for more details', zh: '扫码查看详情' },
  'datasheet.contact': { es: 'CONTACTO INVERLAND', en: 'INVERLAND CONTACT', zh: '联系 INVERLAND' },
  'datasheet.footer_tagline': { es: 'Inverland Portal | Bienes Raíces', en: 'Inverland Portal | Real Estate', zh: 'Inverland 门户 | 房地产' },
  'datasheet.legal_notice': { 
    es: '* Precios y disponibilidad sujetos a cambios sin previo aviso. Esta ficha es informativa y no representa un contrato vinculante.', 
    en: '* Prices and availability subject to change without prior notice. This sheet is informative and does not represent a binding contract.', 
    zh: '* 价格和空置情况如有更改，恕不另行通知。本表仅供参考，不代表具有约束力的合同。' 
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateAmenity: (amenity: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('inverland_lang');
    return (saved as Language) || 'es';
  });

  const setLanguage = (lang: Language) => {
    setLang(lang);
    localStorage.setItem('inverland_lang', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const amenityMap: Record<string, Record<Language, string>> = {
    'Alberca': { es: 'Alberca', en: 'Pool', zh: '泳池' },
    'Jardín': { es: 'Jardín', en: 'Garden', zh: '花园' },
    'Garaje': { es: 'Garaje', en: 'Garage', zh: '车库' },
    'Seguridad': { es: 'Seguridad', en: 'Security', zh: '安保' },
    'Balcón': { es: 'Balcón', en: 'Balcony', zh: '阳台' },
    'Terraza': { es: 'Terraza', en: 'Terrace', zh: '露台' },
    'Aire acondicionado': { es: 'Aire acondicionado', en: 'Air conditioning', zh: '空调' },
    'Calefacción': { es: 'Calefacción', en: 'Heating', zh: '暖气' },
    'Gimnasio': { es: 'Gimnasio', en: 'Gym', zh: '健身房' },
    'Elevador': { es: 'Elevador', en: 'Elevator', zh: '电梯' },
    'Estacionamiento': { es: 'Estacionamiento', en: 'Parking', zh: '停车位' },
    'Amueblado': { es: 'Amueblado', en: 'Furnished', zh: '带家具' },
    'WiFi': { es: 'WiFi', en: 'WiFi', zh: '无线网络' },
    'TV': { es: 'TV', en: 'TV', zh: '电视' },
    'Lavandería': { es: 'Lavandería', en: 'Laundry', zh: '洗衣设施' },
    'Cocina': { es: 'Cocina', en: 'Kitchen', zh: '厨房' },
    'Closet': { es: 'Closet', en: 'Closet', zh: '衣柜' },
    'Vista al agua': { es: 'Vista al agua', en: 'Water View', zh: '水景' },
    'Capilla': { es: 'Capilla', en: 'Chapel', zh: '小教堂' },
    'A favor del viento': { es: 'A favor del viento', en: 'Wind facing', zh: '迎风' },
    'Fogatero': { es: 'Fogatero', en: 'Fire pit', zh: '火坑' },
    'Bar': { es: 'Bar', en: 'Bar', zh: '酒吧' },
    'Asador': { es: 'Asador', en: 'Grill', zh: '烧烤架' },
    'Cine': { es: 'Cine', en: 'Cinema', zh: '电影院' },
    'Cuarto de servicio': { es: 'Cuarto de servicio', en: 'Service room', zh: '杂物间' },
    'Bodega': { es: 'Bodega', en: 'Storage', zh: '仓库' },
    'Half bath': { es: 'Medio baño', en: 'Half bath', zh: '半浴室' },
    'Vestidor': { es: 'Vestidor', en: 'Walk-in closet', zh: '步入式衣柜' },
  };

  const translateAmenity = (amenity: string): string => {
    return amenityMap[amenity]?.[language] || amenity;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, translateAmenity }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
