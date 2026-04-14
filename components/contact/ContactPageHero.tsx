import React from 'react';
import { useI18n } from '../I18nContext';

const ContactPageHero: React.FC = () => {
    const { t } = useI18n();
    return (
        <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-br from-inverland-black to-inverland-blue text-inverland-off-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight">
                        {t('contact.title')}
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed px-2">
                        {t('contact.subtitle')}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ContactPageHero;
