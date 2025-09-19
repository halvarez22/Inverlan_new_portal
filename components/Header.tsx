import React, { useState } from 'react';
import { NAV_LINKS } from '../constants';
import { useAuth } from './AuthContext';

const Logo = () => (
    <div className="flex items-center">
        <img src="/images/logo.png" alt="Inverland" className="h-10 w-auto" />
    </div>
);

interface HeaderProps {
    onNavigate: (view: 'home' | 'login' | 'dashboard' | 'userPortal') => void;
    onLogout: () => void;
    onNavClick: (href: string) => void;
    onOpenAppointmentModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onLogout, onNavClick, onOpenAppointmentModal }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, currentUser } = useAuth();

    const handleNavLinkClick = (e: React.MouseEvent<HTMLButtonElement>, view: 'home' | 'login' | 'dashboard' | 'userPortal') => {
        e.preventDefault();
        onNavigate(view);
        setIsMenuOpen(false); // Close mobile menu on navigation
    };

    const handleLogoutClick = () => {
        onLogout();
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-inverland-dark/90 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    <button onClick={() => onNavigate('home')} aria-label="Go to homepage">
                        <Logo />
                    </button>
                    
                    {!isAuthenticated && (
                        <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
                            {NAV_LINKS.map((link) => (
                                <button key={link.name} onClick={() => onNavClick(link.href)} className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">
                                    {link.name}
                                </button>
                            ))}
                        </nav>
                    )}

                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <button onClick={() => onNavigate('home')} className="text-white font-medium px-3 py-2 lg:px-5 rounded-md hover:bg-inverland-blue transition-colors duration-300">
                                    Inicio
                                </button>
                                <button onClick={() => onNavigate('userPortal')} className="text-white font-medium px-3 py-2 lg:px-5 rounded-md hover:bg-inverland-blue transition-colors duration-300">
                                    Portal
                                </button>
                                {currentUser?.role === 'admin' && (
                                    <button onClick={() => onNavigate('dashboard')} className="text-white font-medium px-3 py-2 lg:px-5 rounded-md hover:bg-inverland-blue transition-colors duration-300">
                                        Dashboard
                                    </button>
                                )}
                                <span className="text-gray-300 font-medium whitespace-nowrap">Hola, {currentUser?.username}</span>
                                <button onClick={handleLogoutClick} className="text-white font-medium px-3 py-2 lg:px-5 rounded-md hover:bg-inverland-blue transition-colors duration-300">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => onNavigate('login')} className="text-white font-medium px-3 py-2 lg:px-5 rounded-md hover:bg-inverland-blue transition-colors duration-300">
                                    Login
                                </button>
                                <button onClick={onOpenAppointmentModal} className="bg-inverland-green text-white font-bold px-3 py-2 lg:px-5 rounded-md hover:bg-opacity-90 transition-transform duration-300 transform hover:scale-105 shadow-md">
                                    Agendar Cita
                                </button>
                            </>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none" aria-label="Toggle menu" aria-expanded={isMenuOpen}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden mt-4 bg-inverland-dark rounded-lg p-4">
                        <nav className="flex flex-col space-y-4">
                            {!isAuthenticated && NAV_LINKS.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => {
                                        onNavClick(link.href);
                                        setIsMenuOpen(false);
                                    }}
                                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium text-left w-full"
                                >
                                    {link.name}
                                </button>
                            ))}
                            {isAuthenticated ? (
                                <>
                                    <button onClick={(e) => handleNavLinkClick(e, 'home')} className="text-white font-medium px-3 py-2 rounded-md hover:bg-inverland-blue transition-colors duration-300 text-left w-full">
                                        Inicio
                                    </button>
                                    <button onClick={(e) => handleNavLinkClick(e, 'userPortal')} className="text-white font-medium px-3 py-2 rounded-md hover:bg-inverland-blue transition-colors duration-300 text-left w-full">
                                        Portal
                                    </button>
                                    {currentUser?.role === 'admin' && (
                                        <button onClick={(e) => handleNavLinkClick(e, 'dashboard')} className="text-white font-medium px-3 py-2 rounded-md hover:bg-inverland-blue transition-colors duration-300 text-left w-full">
                                            Dashboard
                                        </button>
                                    )}
                                    <button onClick={handleLogoutClick} className="text-white font-medium px-3 py-2 rounded-md hover:bg-inverland-blue transition-colors duration-300 text-left w-full">
                                        Logout ({currentUser?.username})
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={(e) => handleNavLinkClick(e, 'login')} className="text-white font-medium px-3 py-2 rounded-md hover:bg-inverland-blue transition-colors duration-300 text-left w-full">
                                        Login
                                    </button>
                                    <button onClick={() => { onOpenAppointmentModal(); setIsMenuOpen(false); }} className="bg-inverland-green text-white font-bold px-3 py-2 rounded-md hover:bg-opacity-90 transition-transform duration-300 transform hover:scale-105 shadow-md w-full">
                                        Agendar Cita
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