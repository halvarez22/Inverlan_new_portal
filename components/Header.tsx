import React, { useState } from 'react';
import { NAV_LINKS } from '../constants';
import { useAuth } from './AuthContext';
import { useI18n, Language } from './I18nContext';

const Logo = () => (
    <div className="flex items-center h-12 overflow-visible">
        <img
            src="/images/logo.png"
            alt="Inverland Logo"
            className="h-10 w-auto object-contain transform scale-125 origin-center -my-1 border-0 outline-none"
        />
    </div>
);

const LanguageSelector = () => {
    const { language, setLanguage } = useI18n();
    
    const flags = {
        es: { name: 'México', code: 'mx', label: 'ES' },
        en: { name: 'USA', code: 'us', label: 'EN' },
        zh: { name: 'China', code: 'cn', label: 'ZH' }
    };

    return (
        <div className="flex items-center space-x-2 bg-white/10 rounded-full px-2 py-1.5 backdrop-blur-sm border border-white/20">
            {(Object.keys(flags) as Language[]).map((lang) => (
                <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    title={flags[lang].name}
                    className={`group relative flex items-center transition-all duration-300 hover:scale-110 px-1`}
                >
                    <div className={`relative w-6 h-4 overflow-hidden rounded-sm border shadow-sm transition-all duration-300 ${
                        language === lang ? 'border-white ring-1 ring-white/50 scale-110' : 'border-transparent opacity-50 grayscale-[0.3] group-hover:opacity-100 group-hover:grayscale-0'
                    }`}>
                        <img 
                            src={`https://flagcdn.com/${flags[lang].code}.svg`} 
                            alt={flags[lang].name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </button>
            ))}
        </div>
    );
};

interface HeaderProps {
    onNavigate: (view: 'home' | 'login' | 'dashboard' | 'userPortal' | 'about' | 'contact' | 'servicios') => void;
    onLogout: () => void;
    onNavClick: (href: string) => void;
    onOpenAppointmentModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onLogout, onNavClick, onOpenAppointmentModal }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, currentUser } = useAuth();
    const { t } = useI18n();

    const handleNavLinkClick = (e: React.MouseEvent<HTMLButtonElement>, view: 'home' | 'login' | 'dashboard' | 'userPortal' | 'about' | 'contact' | 'servicios') => {
        e.preventDefault();
        onNavigate(view);
        setIsMenuOpen(false); // Close mobile menu on navigation
    };

    const handleLogoutClick = () => {
        onLogout();
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-gradient-to-r from-inverland-black/95 to-inverland-blue/95 backdrop-blur-sm sticky top-0 z-50 shadow-inverland-lg border-b border-inverland-blue/20">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 md:py-4">
                <div className="flex items-center justify-between">
                    <button onClick={() => onNavigate('home')} aria-label="Go to homepage" className="flex-shrink-0 bg-transparent border-0 p-0 m-0">
                        <Logo />
                    </button>
                    
                    {!isAuthenticated && (
                        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                            <button onClick={() => onNavigate('home')} className="text-inverland-off-white hover:text-inverland-aqua transition-colors duration-300 font-medium text-sm lg:text-base">
                                {t('nav.home')}
                            </button>
                            <button onClick={() => onNavClick('#about')} className="text-inverland-off-white hover:text-inverland-aqua transition-colors duration-300 font-medium text-sm lg:text-base">
                                {t('nav.about')}
                            </button>
                            <button onClick={() => onNavClick('#servicios')} className="text-inverland-off-white hover:text-inverland-aqua transition-colors duration-300 font-medium text-sm lg:text-base">
                                {t('nav.services')}
                            </button>
                            <button onClick={() => onNavClick('#contact')} className="text-inverland-off-white hover:text-inverland-aqua transition-colors duration-300 font-medium text-sm lg:text-base">
                                {t('nav.contact')}
                            </button>
                        </nav>
                    )}

                    <div className="hidden lg:flex items-center space-x-3 xl:space-x-6">
                        <LanguageSelector />
                        
                        {isAuthenticated ? (
                            <>
                                <button onClick={() => onNavigate('userPortal')} className="text-inverland-off-white font-medium px-3 py-2 lg:px-5 rounded-xl hover:bg-inverland-light-blue/20 transition-all duration-300 font-heading">
                                    {t('nav.portal')}
                                </button>
                                {currentUser?.role === 'admin' && (
                                    <button onClick={() => onNavigate('dashboard')} className="text-inverland-off-white font-medium px-3 py-2 lg:px-5 rounded-xl hover:bg-inverland-light-blue/20 transition-all duration-300 font-heading">
                                        {t('nav.dashboard')}
                                    </button>
                                )}
                                <span className="text-inverland-off-white font-medium whitespace-nowrap font-body">Hola, {currentUser?.username}</span>
                                <button onClick={handleLogoutClick} className="text-inverland-off-white font-medium px-3 py-2 lg:px-5 rounded-xl hover:bg-inverland-light-blue/20 transition-all duration-300 font-heading">
                                    {t('nav.logout')}
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={(e) => handleNavLinkClick(e, 'login')} className="bg-gradient-to-r from-inverland-blue to-inverland-light-blue text-inverland-off-white font-bold px-4 py-2 rounded-xl hover:from-inverland-light-blue hover:to-inverland-aqua transition-all duration-300 transform hover:scale-105 shadow-inverland text-sm lg:text-base font-heading">
                                    {t('nav.login')}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center space-x-3 lg:hidden">
                        <LanguageSelector />
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white flex-shrink-0 p-2" aria-label="Toggle Menu">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="lg:hidden mt-4 border-t border-gray-700 pt-4">
                        <nav className="space-y-2">
                            {!isAuthenticated ? (
                                <>
                                    <button onClick={() => { onNavigate('home'); setIsMenuOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white transition-colors duration-300 font-medium">
                                        {t('nav.home')}
                                    </button>
                                    <button onClick={() => { onNavClick('#about'); setIsMenuOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white transition-colors duration-300 font-medium">
                                        {t('nav.about')}
                                    </button>
                                    <button onClick={() => { onNavClick('#servicios'); setIsMenuOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white transition-colors duration-300 font-medium">
                                        {t('nav.services')}
                                    </button>
                                    <button onClick={() => { onNavClick('#contact'); setIsMenuOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white transition-colors duration-300 font-medium">
                                        {t('nav.contact')}
                                    </button>
                                    <button onClick={(e) => handleNavLinkClick(e, 'login')} className="text-white font-medium px-3 py-2 rounded-md hover:bg-inverland-blue transition-colors duration-300 text-left w-full">
                                        {t('nav.login')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => { onNavigate('userPortal'); setIsMenuOpen(false); }} className="block w-full text-left text-white font-medium px-3 py-2 rounded-md hover:bg-inverland-blue transition-colors duration-300">
                                        {t('nav.portal')}
                                    </button>
                                    {currentUser?.role === 'admin' && (
                                        <button onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }} className="block w-full text-left text-white font-medium px-3 py-2 rounded-md hover:bg-inverland-blue transition-colors duration-300">
                                            {t('nav.dashboard')}
                                        </button>
                                    )}
                                    <button onClick={handleLogoutClick} className="block w-full text-left text-white font-medium px-3 py-2 rounded-md hover:bg-inverland-blue transition-colors duration-300">
                                        {t('nav.logout')}
                                    </button>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;