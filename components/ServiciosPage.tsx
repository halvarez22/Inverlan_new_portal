import React from 'react';
import { useI18n } from './I18nContext';

interface Servicio {
    title: string;
    desc: string;
    benefit: string;
}

const ServiciosPage: React.FC = () => {
    const { t } = useI18n();

    const servicios: Servicio[] = [
        {
            title: t('services.s1_title'),
            desc: t('services.s1_desc'),
            benefit: t('services.s1_benefit')
        },
        {
            title: t('services.s2_title'),
            desc: t('services.s2_desc'),
            benefit: t('services.s2_benefit')
        },
        {
            title: t('services.s3_title'),
            desc: t('services.s3_desc'),
            benefit: t('services.s3_benefit')
        },
        {
            title: t('services.s4_title'),
            desc: t('services.s4_desc'),
            benefit: t('services.s4_benefit')
        },
        {
            title: t('services.s5_title'),
            desc: t('services.s5_desc'),
            benefit: t('services.s5_benefit')
        }
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-br from-inverland-black to-inverland-blue text-inverland-off-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight">
                            {t('services.title')}
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed px-2">
                            {t('services.subtitle')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Content */}
            <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Servicios Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {servicios.map((servicio, index) => (
                        <div 
                            key={index}
                            className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                        >
                            {/* Componente */}
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-inverland-dark mb-3">
                                    {servicio.title}
                                </h3>
                                <div className="w-16 h-1 bg-gradient-to-r from-inverland-blue to-inverland-aqua rounded-full"></div>
                            </div>

                            {/* ¿Qué significa para ti? */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                    <span className="bg-inverland-blue/10 text-inverland-blue p-2 rounded-lg mr-3">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                    {t('services.what_means')}
                                </h4>
                                <p className="text-gray-700 leading-relaxed pl-11">
                                    {servicio.desc}
                                </p>
                            </div>

                            {/* Beneficio Clave */}
                            <div className="bg-gradient-to-r from-inverland-green/5 to-inverland-aqua/5 p-4 rounded-xl border-l-4 border-inverland-green">
                                <h4 className="text-lg font-semibold text-inverland-dark mb-2 flex items-center">
                                    <span className="bg-inverland-green/10 text-inverland-green p-2 rounded-lg mr-3">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                    </span>
                                    {t('services.key_benefit')}
                                </h4>
                                <p className="text-inverland-dark font-medium pl-11">
                                    {servicio.benefit}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-inverland-green to-inverland-blue text-white">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                        {t('services.cta_title')}
                    </h2>
                    <p className="text-xl mb-8 text-gray-200">
                        {t('services.cta_subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-inverland-green font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105 shadow-lg">
                            {t('services.cta_btn1')}
                        </button>
                        <button className="border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white hover:text-inverland-green transition-colors duration-300">
                            {t('services.cta_btn2')}
                        </button>
                    </div>
                </div>
            </div>
        </section>
        </div>
    );
};

export default ServiciosPage;

