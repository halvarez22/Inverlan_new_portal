import React from 'react';
import { useI18n } from '../I18nContext';

export type ContactFormState = {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
};

interface ContactFormBlockProps {
    formData: ContactFormState;
    isSubmitting: boolean;
    submitStatus: 'idle' | 'success' | 'error';
    submitMessage: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const ContactFormBlock: React.FC<ContactFormBlockProps> = ({
    formData,
    isSubmitting,
    submitStatus,
    submitMessage,
    onInputChange,
    onSubmit,
}) => {
    const { t } = useI18n();
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-inverland-dark mb-4 sm:mb-6">
                {t('contact.form_title')}
            </h3>
            <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('contact.name')} *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={onInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-inverland-green focus:border-transparent outline-none transition-colors duration-300"
                            placeholder={t('contact.name_placeholder')}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('contact.email')} *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={onInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-inverland-green focus:border-transparent outline-none transition-colors duration-300"
                            placeholder={t('contact.email_placeholder')}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('contact.phone')}
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={onInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-inverland-green focus:border-transparent outline-none transition-colors duration-300"
                            placeholder={t('contact.phone_placeholder')}
                        />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('contact.subject')} *
                        </label>
                        <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={onInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-inverland-green focus:border-transparent outline-none transition-colors duration-300"
                        >
                            <option value="">{t('contact.subject_placeholder')}</option>
                            <option value="compra">{t('contact.subject_option1')}</option>
                            <option value="venta">{t('contact.subject_option2')}</option>
                            <option value="renta">{t('contact.subject_option3')}</option>
                            <option value="inversion">{t('contact.subject_option4')}</option>
                            <option value="consulta">{t('contact.subject_option5')}</option>
                            <option value="otro">{t('contact.subject_option6')}</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.message')} *
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={onInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-inverland-green focus:border-transparent outline-none transition-colors duration-300 resize-none"
                        placeholder={t('contact.message_placeholder')}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-inverland-green text-white font-bold py-4 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            {t('contact.sending')}
                        </div>
                    ) : (
                        t('contact.send')
                    )}
                </button>

                {submitStatus !== 'idle' && (
                    <div
                        className={`mt-4 p-4 rounded-lg ${
                            submitStatus === 'success'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                    >
                        <div className="flex items-center">
                            {submitStatus === 'success' ? (
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                            <span className="font-medium">{submitMessage}</span>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default ContactFormBlock;
