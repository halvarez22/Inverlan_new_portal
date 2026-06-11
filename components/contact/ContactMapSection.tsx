import React from 'react';
import { useI18n } from '../I18nContext';

const ContactMapSection: React.FC = () => {
    const { t } = useI18n();
    return (
    <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-inverland-dark mb-4">
                    {t('contact.our_location')}
                </h2>
                <p className="text-lg text-gray-600">
                    {t('contact.visit_us')}
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-gray-200 rounded-lg shadow-lg overflow-hidden" style={{ height: '400px' }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.123456789!2d-101.69164941912484!3d21.14519209685408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDA4JzQyLjgiTiAxMDHCsDQxJzI5LjQiVw!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación de Inverland - Nubes 219, Jardines del Moral, León, Guanajuato"
                    />
                </div>
            </div>
        </div>
    </section>
    );
};

export default ContactMapSection;
