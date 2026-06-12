import React, { useState, useEffect } from 'react';
import { useI18n } from './I18nContext';

interface CookieBannerProps {
    onNavClick?: (href: string) => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onNavClick }) => {
    const { t } = useI18n();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if the user has already accepted cookies
        const consent = localStorage.getItem('inverland_cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('inverland_cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-inverland-dark text-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-300 leading-relaxed flex-1">
                    <p>
                        {t('legal.cookie_message')}{' '}
                        <a
                            href="#privacy"
                            onClick={(e) => {
                                if (onNavClick) {
                                    e.preventDefault();
                                    onNavClick('#privacy');
                                }
                            }}
                            className="text-inverland-light-blue hover:text-white underline font-semibold focus:outline-none transition-colors"
                        >
                            {t('legal.cookie_link')}
                        </a>.
                    </p>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto">
                    <button
                        onClick={handleAccept}
                        className="w-full sm:w-auto bg-inverland-green hover:bg-opacity-90 text-white font-bold py-2 px-6 rounded transition-colors text-sm"
                    >
                        {t('legal.cookie_accept')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
