import React from 'react';
import { useI18n } from './I18nContext';

const TermsEs = () => (
    <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">1. ACEPTACIÓN DE LOS TÉRMINOS</h2>
            <p>Bienvenido al portal web de <strong>Grupo Inverland, S.A. de C.V.</strong> ("INVERLAND"). Al acceder y utilizar nuestro sitio web (www.inverland.mx) y nuestros servicios, usted acepta estar sujeto a los presentes Términos y Condiciones de Uso. Si no está de acuerdo con alguna parte de estos términos, le rogamos que no utilice nuestro portal.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">2. DESCRIPCIÓN DEL SERVICIO</h2>
            <p>INVERLAND proporciona una plataforma en línea para la publicación, búsqueda y gestión de propiedades inmobiliarias (venta y renta). La información sobre las propiedades mostradas en el portal es de carácter informativo y está sujeta a cambios sin previo aviso. Los precios, disponibilidad y características definitivas se confirmarán únicamente al momento de formalizar cualquier contrato físico.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">3. USO DEL PORTAL</h2>
            <p>El usuario se compromete a utilizar el sitio web únicamente para fines lícitos y de manera que no infrinja los derechos de terceros, ni restrinja o inhiba el uso y disfrute del sitio por parte de cualquier otra persona. Queda estrictamente prohibido:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Utilizar el portal para transmitir material publicitario no solicitado (spam).</li>
                <li>Intentar obtener acceso no autorizado a nuestros sistemas o bases de datos.</li>
                <li>Extraer información masiva del portal (scraping) sin autorización expresa.</li>
            </ul>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">4. PROPIEDAD INTELECTUAL</h2>
            <p>Todo el contenido incluido en este portal, como textos, gráficos, logotipos, iconos de botones, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de INVERLAND o de sus proveedores de contenido, y está protegido por las leyes de propiedad intelectual mexicanas e internacionales.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">5. LIMITACIÓN DE RESPONSABILIDAD</h2>
            <p>INVERLAND no garantiza que el sitio web esté libre de errores o que el acceso sea ininterrumpido. En la medida máxima permitida por la ley, INVERLAND no será responsable de ningún daño directo, indirecto, incidental o consecuente que resulte del uso o la imposibilidad de usar este sitio web o la información contenida en él.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">6. ENLACES A TERCEROS</h2>
            <p>Nuestro portal puede contener enlaces a sitios web de terceros. Estos enlaces se proporcionan únicamente para su conveniencia. INVERLAND no tiene control sobre el contenido de esos sitios y no asume ninguna responsabilidad por ellos ni por cualquier pérdida o daño que pueda derivarse de su uso.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">7. MODIFICACIONES A LOS TÉRMINOS</h2>
            <p>INVERLAND se reserva el derecho de revisar y modificar estos Términos y Condiciones en cualquier momento. El uso continuado del sitio web después de la publicación de los cambios constituirá su aceptación de dichos cambios.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">8. JURISDICCIÓN Y LEY APLICABLE</h2>
            <p>Para la interpretación, cumplimiento y ejecución de los presentes Términos y Condiciones, las partes se someten a las leyes federales de los Estados Unidos Mexicanos y a la jurisdicción de los tribunales competentes de la ciudad de León, Guanajuato, renunciando a cualquier otro fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros.</p>
            <p className="mt-4 text-xs text-gray-500">Última actualización: junio de 2026.</p>
        </div>
    </div>
);

const TermsEn = () => (
    <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">1. ACCEPTANCE OF TERMS</h2>
            <p>Welcome to the web portal of <strong>Grupo Inverland, S.A. de C.V.</strong> ("INVERLAND"). By accessing and using our website (www.inverland.mx) and our services, you agree to be bound by these Terms and Conditions of Use. If you do not agree with any part of these terms, please do not use our portal.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">2. DESCRIPTION OF SERVICE</h2>
            <p>INVERLAND provides an online platform for the publication, search, and management of real estate properties (sale and rent). The information about properties displayed on the portal is for informational purposes and is subject to change without prior notice. Final prices, availability, and features will only be confirmed at the time of formalizing any physical contract.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">3. USE OF THE PORTAL</h2>
            <p>The user agrees to use the website only for lawful purposes and in a way that does not infringe the rights of third parties, or restrict or inhibit anyone else's use and enjoyment of the website. It is strictly prohibited to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Use the portal to transmit unsolicited advertising material (spam).</li>
                <li>Attempt to gain unauthorized access to our systems or databases.</li>
                <li>Extract bulk information from the portal (scraping) without express authorization.</li>
            </ul>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">4. INTELLECTUAL PROPERTY</h2>
            <p>All content included on this portal, such as text, graphics, logos, button icons, images, audio clips, digital downloads, and data compilations, is the property of INVERLAND or its content suppliers and is protected by Mexican and international intellectual property laws.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">5. LIMITATION OF LIABILITY</h2>
            <p>INVERLAND does not guarantee that the website will be error-free or that access will be uninterrupted. To the maximum extent permitted by law, INVERLAND will not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website or the information contained therein.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">6. THIRD-PARTY LINKS</h2>
            <p>Our portal may contain links to third-party websites. These links are provided solely for your convenience. INVERLAND has no control over the content of those sites and assumes no responsibility for them or for any loss or damage that may arise from your use of them.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">7. MODIFICATIONS TO TERMS</h2>
            <p>INVERLAND reserves the right to revise and modify these Terms and Conditions at any time. Continued use of the website after the posting of changes will constitute your acceptance of such changes.</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">8. JURISDICTION AND APPLICABLE LAW</h2>
            <p>For the interpretation, compliance, and execution of these Terms and Conditions, the parties submit to the federal laws of the United Mexican States and the jurisdiction of the competent courts of the city of León, Guanajuato, renouncing any other jurisdiction that may correspond to them by reason of their present or future domiciles.</p>
            <p className="mt-4 text-xs text-gray-500">Last update: June 2026.</p>
        </div>
    </div>
);

const TermsZh = () => (
    <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">1. 接受条款</h2>
            <p>欢迎访问 <strong>Grupo Inverland, S.A. de C.V.</strong> ("INVERLAND") 的网络门户。访问和使用我们的网站 (www.inverland.mx) 及其服务，即表示您同意受本使用条款和条件的约束。如果您不同意这些条款的任何部分，请不要使用我们的门户。</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">2. 服务说明</h2>
            <p>INVERLAND 提供一个用于发布、搜索和管理房地产（出售和出租）的在线平台。门户网站上显示的房产信息仅供参考，如有更改，恕不另行通知。最终价格、可用性和特征只有在正式签订任何物理合同时才能确认。</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">3. 门户的使用</h2>
            <p>用户同意仅出于合法目的使用本网站，并且不得侵犯第三方的权利，或限制、禁止任何其他人使用和享受本网站。严禁：</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>使用门户发送未经请求的广告材料（垃圾邮件）。</li>
                <li>试图未经授权访问我们的系统或数据库。</li>
                <li>未经明确授权从门户提取批量信息（数据抓取）。</li>
            </ul>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">4. 知识产权</h2>
            <p>本门户包含的所有内容，如文本、图形、徽标、按钮图标、图像、音频剪辑、数字下载和数据汇编，均为 INVERLAND 或其内容供应商的财产，受墨西哥和国际知识产权法的保护。</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">5. 责任限制</h2>
            <p>INVERLAND 不保证网站没有错误或访问不会中断。在法律允许的最大范围内，INVERLAND 对因使用或无法使用本网站或其中包含的信息而导致的任何直接、间接、附带或后果性损害不承担责任。</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">6. 第三方链接</h2>
            <p>我们的门户可能包含指向第三方网站的链接。提供这些链接仅为您的方便起见。INVERLAND 无法控制这些网站的内容，并且对它们或因您使用它们而可能产生的任何损失或损害不承担任何责任。</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">7. 条款的修改</h2>
            <p>INVERLAND 保留随时修改这些条款和条件的权利。在发布更改后继续使用本网站将构成您对这些更改的接受。</p>
        </div>

        <div>
            <h2 className="text-lg font-bold text-inverland-dark mb-2">8. 司法管辖权和适用法律</h2>
            <p>对于这些条款和条件的解释、遵守和执行，双方服从墨西哥合众国联邦法律以及瓜纳华托州莱昂市主管法院的管辖权，并放弃因其当前或未来住所而可能对应的任何其他管辖权。</p>
            <p className="mt-4 text-xs text-gray-500">最后更新日期：2026年6月。</p>
        </div>
    </div>
);

const TermsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { language, t } = useI18n();

    const renderContent = () => {
        switch (language) {
            case 'en': return <TermsEn />;
            case 'zh': return <TermsZh />;
            case 'es':
            default: return <TermsEs />;
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
                    <h1 className="text-3xl sm:text-4xl font-extrabold">{t('footer.terms')}</h1>
                    <p className="mt-2 text-inverland-light-blue text-sm">Reglas de uso del portal web</p>
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

export default TermsPage;
