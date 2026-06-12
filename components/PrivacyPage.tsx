import React from 'react';
import { useI18n } from './I18nContext';

const PrivacyEs = () => (
    <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">RESPONSABLE DE LA PROTECCIÓN DE SUS DATOS PERSONALES</h2>
            <p><strong>Grupo Inverland, S.A. de C.V.</strong>, conocida comercialmente como <strong>“INVERLAND”</strong>, es una persona moral que se dedica a la prestación de servicios inmobiliarios, ubicada en <strong>Calle Nubes 219, Col. Jardines de Moral, C.P. 37160, en León, Guanajuato, México</strong>; la cual es responsable de la protección de sus Datos Personales, motivo por el cual está comprometida con el tratamiento, control y uso legítimo de los mismos, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (en adelante “Ley”).</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">FINES DEL AVISO DE PRIVACIDAD</h2>
            <p>El presente Aviso es puesto a su disposición previo al tratamiento de sus Datos Personales con la finalidad de que conozca cómo usamos, almacenamos y tratamos su información. Si no existe oposición de su parte, se entiende que otorga su consentimiento para que INVERLAND pueda usar sus Datos Personales.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">¿PARA QUÉ FINES RECABAMOS SUS DATOS PERSONALES?</h2>
            <p className="mb-2"><strong>Finalidades principales:</strong> necesarias para la existencia y cumplimiento de la relación jurídica:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Contratación y provisión de nuestros servicios inmobiliarios.</li>
                <li>Evaluar la calidad del servicio e informar sobre cambios.</li>
                <li>Gestiones de cobro, pagos bancarios e identificación de clientes y proveedores.</li>
                <li>Seguridad en instalaciones mediante videovigilancia.</li>
                <li>Atención a quejas y aclaraciones.</li>
            </ul>
            <p className="mb-2"><strong>Finalidades secundarias:</strong> que nos permiten brindarle mejor atención:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>Informar sobre nuevos servicios y promociones.</li>
                <li>Fines publicitarios, mercadotécnicos y estadísticos.</li>
                <li>Prospección comercial.</li>
            </ul>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">¿QUÉ DATOS PERSONALES OBTENEMOS?</h2>
            <ul className="list-disc pl-5 space-y-1 mb-4">
                <li><strong>De identificación:</strong> Nombre, estado civil, fecha de nacimiento, nacionalidad, fotografía, firma, identificaciones oficiales (INE, Pasaporte), RFC, CURP.</li>
                <li><strong>De contacto:</strong> Domicilio, correo electrónico, teléfono.</li>
                <li><strong>Patrimoniales o financieros:</strong> Información fiscal, ingresos, historial crediticio, datos bancarios.</li>
                <li><strong>Sensibles:</strong> Características físicas recabadas únicamente por videovigilancia por seguridad.</li>
            </ul>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">MEDIDAS DE SEGURIDAD ADOPTADAS</h2>
            <p>INVERLAND ha establecido medidas de seguridad administrativas, técnicas y físicas para proteger sus Datos Personales contra daño, pérdida, alteración o uso no autorizado, manteniendo su información en bases de datos de acceso restringido.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">DERECHOS ARCO Y REVOCACIÓN DE CONSENTIMIENTO</h2>
            <p>Usted puede ejercer sus derechos de <strong>Acceso, Rectificación, Cancelación u Oposición (ARCO)</strong>, así como revocar su consentimiento, enviando una solicitud al correo <strong>hola@inverland.mx</strong>. Deberá incluir: identificación oficial, descripción de los datos respecto a los que busca ejercer su derecho y domicilio o correo para recibir notificaciones. Responderemos en un máximo de 20 días.</p>
            <div className="mt-4">
                <a href="#arco" className="inline-block px-4 py-2 bg-inverland-green text-white text-sm font-semibold rounded-md shadow hover:bg-opacity-90 transition-colors">
                    Llenar Formulario Digital ARCO
                </a>
            </div>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">TRANSFERENCIAS DE DATOS</h2>
            <p>Sus datos pueden ser compartidos con: Autoridades fiscales (por requerimiento legal, sin requerir consentimiento); Instituciones bancarias, Notarías, Despachos contables o jurídicos (requieren consentimiento). INVERLAND no venderá ni cederá sus datos a terceros ajenos a la prestación del servicio.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">MODIFICACIONES AL AVISO</h2>
            <p>Nos reservamos el derecho de modificar este aviso. Los cambios estarán disponibles en nuestra página web: <strong>www.inverland.mx</strong>.</p>
            <p className="mt-4 text-xs text-gray-500">Última actualización: junio de 2026.</p>
        </div>
    </div>
);

const PrivacyEn = () => (
    <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">RESPONSIBLE FOR THE PROTECTION OF YOUR PERSONAL DATA</h2>
            <p><strong>Grupo Inverland, S.A. de C.V.</strong>, doing business as <strong>"INVERLAND"</strong>, located at <strong>Calle Nubes 219, Col. Jardines de Moral, C.P. 37160, in León, Guanajuato, Mexico</strong>, is responsible for the protection of your Personal Data. We are committed to its legitimate processing and control according to the Mexican Federal Law on Protection of Personal Data Held by Private Parties.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">PURPOSES OF THIS PRIVACY NOTICE</h2>
            <p>This Notice informs you how we use, store, and process your information. By not objecting, you grant INVERLAND your consent to use your Personal Data.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">WHY DO WE COLLECT YOUR PERSONAL DATA?</h2>
            <p className="mb-2"><strong>Primary purposes:</strong> necessary for the legal relationship:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Contracting and providing our real estate services.</li>
                <li>Evaluating service quality and communicating changes.</li>
                <li>Billing, banking payments, and identifying clients/suppliers.</li>
                <li>Facility security via video surveillance.</li>
            </ul>
            <p className="mb-2"><strong>Secondary purposes:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
                <li>Information about new services and promotions.</li>
                <li>Advertising, marketing, and commercial prospecting.</li>
            </ul>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">WHAT PERSONAL DATA DO WE OBTAIN?</h2>
            <ul className="list-disc pl-5 space-y-1 mb-4">
                <li><strong>Identification:</strong> Name, marital status, DOB, nationality, photo, signature, IDs (INE, Passport), RFC, CURP.</li>
                <li><strong>Contact:</strong> Address, email, phone number.</li>
                <li><strong>Financial:</strong> Tax info, income, credit history, bank details.</li>
                <li><strong>Sensitive:</strong> Physical characteristics collected strictly via security cameras.</li>
            </ul>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">SECURITY MEASURES</h2>
            <p>INVERLAND has implemented administrative, technical, and physical security measures to protect your Personal Data against damage, loss, or unauthorized use.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">ARCO RIGHTS AND REVOCATION OF CONSENT</h2>
            <p>You may exercise your <strong>Access, Rectification, Cancellation, or Opposition (ARCO)</strong> rights by emailing <strong>hola@inverland.mx</strong>. Include official ID and a description of the data. We will respond within 20 days.</p>
            <div className="mt-4">
                <a href="#arco" className="inline-block px-4 py-2 bg-inverland-green text-white text-sm font-semibold rounded-md shadow hover:bg-opacity-90 transition-colors">
                    Fill out Digital ARCO Form
                </a>
            </div>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">DATA TRANSFERS</h2>
            <p>Your data may be shared with: Tax authorities (legal requirement); Banks, Notaries, Legal/Accounting firms (requires consent). We do not sell your data.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">MODIFICATIONS</h2>
            <p>We reserve the right to modify this notice. Changes will be posted on: <strong>www.inverland.mx</strong>.</p>
            <p className="mt-4 text-xs text-gray-500">Last update: June 2026.</p>
        </div>
    </div>
);

const PrivacyZh = () => (
    <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">个人数据保护责任方</h2>
            <p><strong>Grupo Inverland, S.A. de C.V.</strong>（商业名称：<strong>“INVERLAND”</strong>），位于 <strong>墨西哥瓜纳华托州莱昂市 Jardines de Moral 区 Nubes 街 219 号，邮编 37160</strong>。我们负责保护您的个人数据，并致力于根据《墨西哥私人持有个人数据联邦保护法》合法处理和控制您的信息。</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">隐私声明的目的</h2>
            <p>本声明旨在告知您我们如何使用、存储和处理您的信息。如果您不提出异议，即表示您同意 INVERLAND 使用您的个人数据。</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">我们收集个人数据的目的</h2>
            <p className="mb-2"><strong>主要目的（法律关系所必需）：</strong></p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>签订合同并提供房地产服务。</li>
                <li>评估服务质量和通知变更。</li>
                <li>计费、银行付款以及识别客户/供应商。</li>
                <li>通过视频监控维护设施安全。</li>
            </ul>
            <p className="mb-2"><strong>次要目的：</strong></p>
            <ul className="list-disc pl-5 space-y-1">
                <li>提供新服务和促销信息。</li>
                <li>广告、营销和商业勘探。</li>
            </ul>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">我们收集哪些数据？</h2>
            <ul className="list-disc pl-5 space-y-1 mb-4">
                <li><strong>身份信息：</strong> 姓名、婚姻状况、出生日期、国籍、照片、签名、官方证件（如护照）、RFC、CURP。</li>
                <li><strong>联系方式：</strong> 地址、电子邮件、电话。</li>
                <li><strong>财务信息：</strong> 税务信息、收入、信用记录、银行信息。</li>
                <li><strong>敏感信息：</strong> 仅通过安全摄像头获取的身体特征。</li>
            </ul>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">安全措施</h2>
            <p>INVERLAND 实施了行政、技术和物理安全措施，以保护您的个人数据免遭损坏、丢失或未经授权的使用。</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">ARCO 权利及撤销同意</h2>
            <p>您可以发送电子邮件至 <strong>hola@inverland.mx</strong>，行使<strong>访问、更正、取消或反对（ARCO）</strong>的权利。请附上官方身份证明和相关数据说明。我们将在 20 天内回复。</p>
            <div className="mt-4">
                <a href="#arco" className="inline-block px-4 py-2 bg-inverland-green text-white text-sm font-semibold rounded-md shadow hover:bg-opacity-90 transition-colors">
                    填写数字 ARCO 表单
                </a>
            </div>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">数据转移</h2>
            <p>您的数据可能与以下机构共享：税务机构（法律要求）；银行、公证处、律师/会计师事务所（需您同意）。我们不会出售您的数据。</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">修改声明</h2>
            <p>我们保留修改本声明的权利。任何更改将发布在：<strong>www.inverland.mx</strong>。</p>
            <p className="mt-4 text-xs text-gray-500">最后更新日期：2026年6月。</p>
        </div>
    </div>
);

const PrivacyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { language, t } = useI18n();

    const renderContent = () => {
        switch (language) {
            case 'en': return <PrivacyEn />;
            case 'zh': return <PrivacyZh />;
            case 'es':
            default: return <PrivacyEs />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header bar */}
            <div className="bg-gradient-to-r from-inverland-black to-inverland-blue text-white py-12 px-4">
                <div className="container mx-auto max-w-4xl">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-inverland-light-blue hover:text-inverland-aqua transition-colors mb-6 text-sm font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t('detail.back')}
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-extrabold">{t('legal.privacy_title')}</h1>
                    <p className="mt-2 text-inverland-light-blue text-sm">{t('legal.privacy_subtitle')}</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto max-w-4xl px-4 py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
                    {renderContent()}

                    {/* Contact block */}
                    <div className="mt-12 bg-inverland-blue/5 border border-inverland-blue/20 rounded-xl p-6">
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold text-inverland-dark">{t('legal.contact_label')}: </span>
                            <a href="mailto:hola@inverland.mx" className="text-inverland-green hover:underline">hola@inverland.mx</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
