import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import ContactPageHero from './contact/ContactPageHero';
import ContactInfoColumn from './contact/ContactInfoColumn';
import ContactFormBlock from './contact/ContactFormBlock';
import ContactMapSection from './contact/ContactMapSection';
import ContactCtaSection from './contact/ContactCtaSection';
import { useI18n } from './I18nContext';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const CONTACT_TARGET_EMAIL = import.meta.env.VITE_CONTACT_TARGET_EMAIL || 'hola@inverland.mx';

const ContactPage: React.FC = () => {
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submitMessage, setSubmitMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setSubmitMessage('');

        try {
            if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
                throw new Error('EmailJS environment variables are not configured.');
            }

            emailjs.init(EMAILJS_PUBLIC_KEY);

            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message,
                to_email: CONTACT_TARGET_EMAIL,
            };

            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

            setSubmitStatus('success');
            setSubmitMessage(t('contact.success'));

            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
        } catch (error) {
            console.error('Error enviando email:', error);
            setSubmitStatus('error');
            setSubmitMessage(t('contact.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white">
            <ContactPageHero />

            <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
                        <ContactInfoColumn />
                        <ContactFormBlock
                            formData={formData}
                            isSubmitting={isSubmitting}
                            submitStatus={submitStatus}
                            submitMessage={submitMessage}
                            onInputChange={handleInputChange}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </section>

            <ContactMapSection />
            <ContactCtaSection />
        </div>
    );
};

export default ContactPage;
