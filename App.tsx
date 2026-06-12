
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { PropertyProvider, useProperties } from './components/PropertyContext';
import { ClientProvider } from './components/ClientContext';
import { CampaignProvider } from './components/CampaignContext';
import { MCPProvider } from './mcp/MCPContext';
import { I18nProvider } from './components/I18nContext';
import { Property, PropertyFilters, Client } from './types';
import { useConnectionStatus } from './hooks/useConnectionStatus';

import Header from './components/Header';
import Hero from './components/Hero';
import PropertyListings from './components/PropertyListings';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollingBanner from './components/ScrollingBanner';
import SyncStatus from './components/SyncStatus';
import CookieBanner from './components/CookieBanner';
import PrivacyPage from './components/PrivacyPage';
import TermsPage from './components/TermsPage';
import ArcoFormPage from './components/ArcoFormPage';

const LoginPage = lazy(() => import('./components/LoginPage'));
const UserPortal = lazy(() => import('./components/UserPortal'));
const PropertyDetailPage = lazy(() => import('./components/PropertyDetailPage'));
const AgentsPage = lazy(() => import('./components/AgentsPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ServiciosPage = lazy(() => import('./components/ServiciosPage'));
const AppointmentModal = lazy(() => import('./components/AppointmentModal'));
const DataMigration = lazy(() => import('./components/DataMigration'));
const Chatbot = lazy(() => import('./components/Chatbot'));

const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const AddProperty = lazy(() => import('./components/AddProperty'));
const EditPropertyPage = lazy(() => import('./components/EditPropertyPage'));
const TrackingPage = lazy(() => import('./components/TrackingPage'));
const UserManagementPage = lazy(() => import('./components/UserManagementPage'));
const ClientsPage = lazy(() => import('./components/ClientsPage'));
const MarketingPage = lazy(() => import('./components/MarketingPage'));
const AnalyticsPage = lazy(() => import('./components/AnalyticsPage'));
const AgentPortal = lazy(() => import('./components/AgentPortal'));
const ClientDetailPage = lazy(() => import('./components/ClientDetailPage'));
const AgentPropertyDetailPage = lazy(() => import('./components/AgentPropertyDetailPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));

const PageLoadFallback = () => (
    <div className="min-h-[40vh] flex items-center justify-center text-gray-600 text-sm">Cargando…</div>
);

type View =
    | 'home'
    | 'login'
    | 'dashboard'
    | 'userPortal'
    | 'propertyDetail'
    | 'addProperty'
    | 'editProperty'
    | 'agents'
    | 'tracking'
    | 'userManagement'
    | 'clients'
    | 'marketing'
    | 'analytics'
    | 'agentPortal'
    | 'clientDetail'
    | 'agentPropertyDetail'
    | 'about'
    | 'contact'
    | 'servicios'
    | 'privacy'
    | 'terms'
    | 'arco';

function App() {
    const { isAuthenticated, currentUser, logout: authLogout } = useAuth();

    const { properties, isLoadingProperties, propertiesLoadError } = useProperties();
    const { isOnline, lastSync } = useConnectionStatus();
    const [view, setView] = useState<View>('home');
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);

    const [filters, setFilters] = useState<Partial<PropertyFilters>>({});
    const [isSearching, setIsSearching] = useState(false);
    const propertyListingsRef = useRef<HTMLDivElement>(null);

    const handleNavigate = (newView: View) => {
        setView(newView);
        window.scrollTo(0, 0);
    };

    const handleNavigateToProperties = () => {
        handleNavigate('home');
        setTimeout(() => {
            propertyListingsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleViewProperty = (property: Property) => {
        setSelectedProperty(property);
        handleNavigate('propertyDetail');
    };

    const handleViewAgentProperty = (property: Property) => {
        setSelectedProperty(property);
        handleNavigate('agentPropertyDetail');
    };

    const handleViewClient = (client: Client) => {
        setSelectedClient(client);
        handleNavigate('clientDetail');
    };

    const handleBackToList = () => {
        setSelectedProperty(null);
        handleNavigate('home');
        setTimeout(() => {
            propertyListingsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleBackFromLegal = () => {
        handleNavigate('home');
        setTimeout(() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
    };

    const handleLoginSuccess = () => {
        handleNavigate('userPortal');
    };

    const handleLogout = () => {
        authLogout();
        setSelectedProperty(null);
        setSelectedClient(null);
        handleNavigate('home');
    };

    const handleNavClick = (href: string) => {
        if (href === '#about') {
            handleNavigate('about');
        } else if (href === '#contact') {
            handleNavigate('contact');
        } else if (href === '#servicios') {
            handleNavigate('servicios');
        } else if (href === '#properties') {
            handleNavigate('home');
            setTimeout(() => {
                propertyListingsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else if (href === '#privacy') {
            handleNavigate('privacy');
        } else if (href === '#terms') {
            handleNavigate('terms');
        } else if (href === '#arco') {
            handleNavigate('arco');
        } else {
            const element = document.querySelector(href);
            element?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash === '#privacy') {
                handleNavigate('privacy');
            } else if (window.location.hash === '#terms') {
                handleNavigate('terms');
            } else if (window.location.hash === '#arco') {
                handleNavigate('arco');
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Check on mount
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleSearch = async (query: string) => {
        setIsSearching(true);
        try {
            const { parseSearchQueryWithGroq } = await import('./services/groqService');
            const parsedFilters = await parseSearchQueryWithGroq(query);
            setFilters(parsedFilters);
            propertyListingsRef.current?.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error during AI search with Groq:', error);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && view === 'userPortal') {
            if (currentUser?.role === 'admin') {
                /* admins stay on user portal */
            } else if (currentUser?.role === 'agent' || currentUser?.role === 'user') {
                handleNavigate('agentPortal');
            }
        }
    }, [isAuthenticated, currentUser, view]);

    useEffect(() => {
        if (isAuthenticated && view === 'userManagement' && currentUser?.role !== 'admin') {
            handleNavigate('userPortal');
        }
    }, [isAuthenticated, view, currentUser?.role]);

    const renderContent = () => {
        const homePage = (
            <>
                <Hero onSearch={handleSearch} isSearching={isSearching} />
                <ScrollingBanner />
                <div ref={propertyListingsRef}>
                    <PropertyListings
                        properties={properties}
                        filters={filters}
                        setFilters={setFilters}
                        onViewProperty={handleViewProperty}
                        isLoadingProperties={isLoadingProperties}
                        propertiesLoadError={propertiesLoadError}
                    />
                </div>
                <ContactSection />
            </>
        );

        if (!isAuthenticated) {
            switch (view) {
                case 'login':
                    return (
                        <Suspense fallback={<PageLoadFallback />}>
                            <LoginPage onLoginSuccess={handleLoginSuccess} />
                        </Suspense>
                    );
                case 'propertyDetail':
                    return selectedProperty ? (
                        <Suspense fallback={<PageLoadFallback />}>
                            <PropertyDetailPage property={selectedProperty} onBack={handleBackToList} />
                        </Suspense>
                    ) : (
                        homePage
                    );
                case 'privacy':
                    return (
                        <Suspense fallback={<PageLoadFallback />}>
                            <PrivacyPage onBack={handleBackFromLegal} />
                        </Suspense>
                    );
                case 'terms':
                    return (
                        <Suspense fallback={<PageLoadFallback />}>
                            <TermsPage onBack={handleBackFromLegal} />
                        </Suspense>
                    );
                case 'arco':
                    return (
                        <Suspense fallback={<PageLoadFallback />}>
                            <ArcoFormPage onBack={handleBackFromLegal} />
                        </Suspense>
                    );
                case 'about':
                    return (
                        <Suspense fallback={<PageLoadFallback />}>
                            <AboutPage
                                onNavigate={(v: View) => handleNavigate(v)}
                                onNavigateToProperties={handleNavigateToProperties}
                            />
                        </Suspense>
                    );
                case 'contact':
                    return (
                        <Suspense fallback={<PageLoadFallback />}>
                            <ContactPage />
                        </Suspense>
                    );
                case 'servicios':
                    return (
                        <Suspense fallback={<PageLoadFallback />}>
                            <ServiciosPage />
                        </Suspense>
                    );
                default:
                    return homePage;
            }
        }

        switch (view) {
            case 'dashboard':
                return (
                    <Suspense fallback={<PageLoadFallback />}>
                        <AdminDashboard onNavigate={(v) => handleNavigate(v as View)} />
                    </Suspense>
                );
            case 'userPortal':
                return (
                    <Suspense fallback={<PageLoadFallback />}>
                        <UserPortal onNavigate={(v) => handleNavigate(v as View)} />
                    </Suspense>
                );
            case 'agentPortal':
                return (
                    <Suspense fallback={<PageLoadFallback />}>
                        <AgentPortal
                            onNavigate={(v) => handleNavigate(v as View)}
                            onViewClient={handleViewClient}
                            onViewProperty={handleViewAgentProperty}
                            selectedProperty={selectedProperty}
                            selectedClient={selectedClient}
                        />
                    </Suspense>
                );
            case 'addProperty':
                return (
                    <Suspense fallback={<PageLoadFallback />}>
                        <AddProperty onPropertyAdded={() => handleNavigate('userPortal')} />
                    </Suspense>
                );
            case 'editProperty':
                return (
                    <Suspense fallback={<PageLoadFallback />}>
                        <EditPropertyPage onBack={() => handleNavigate('userPortal')} />
                    </Suspense>
                );
            case 'agents':
                return (
                    <Suspense fallback={<PageLoadFallback />}>
                        <AgentsPage />
                    </Suspense>
                );
            case 'tracking':
                return (
                    <Suspense fallback={<PageLoadFallback />}>
                        <TrackingPage />
                    </Suspense>
                );
            case 'userManagement':
                return currentUser?.role === 'admin' ? (
                    <Suspense fallback={<PageLoadFallback />}>
                        <UserManagementPage />
                    </Suspense>
                ) : (
                    <Suspense fallback={<PageLoadFallback />}>
                        <UserPortal onNavigate={(v) => handleNavigate(v as View)} />
                    </Suspense>
                );
            case 'clients':
                return (
                    <Suspense fallback={<PageLoadFallback />}>
                        <ClientsPage />
                    </Suspense>
                );
            case 'marketing':
                return (
                    <Suspense fallback={<PageLoadFallback />}>
                        <MarketingPage />
                    </Suspense>
                );
            case 'analytics':
                return (
                    <Suspense fallback={<PageLoadFallback />}>
                        <AnalyticsPage />
                    </Suspense>
                );
            case 'propertyDetail':
                return selectedProperty ? (
                    <PropertyDetailPage property={selectedProperty} onBack={handleBackToList} />
                ) : (
                    homePage
                );
            case 'clientDetail':
                return selectedClient ? (
                    <Suspense fallback={<PageLoadFallback />}>
                        <ClientDetailPage client={selectedClient} onBack={() => handleNavigate('agentPortal')} />
                    </Suspense>
                ) : (
                    <Suspense fallback={<PageLoadFallback />}>
                        <AgentPortal
                            onNavigate={(v) => handleNavigate(v as View)}
                            onViewClient={handleViewClient}
                            onViewProperty={handleViewAgentProperty}
                            selectedProperty={selectedProperty}
                            selectedClient={selectedClient}
                        />
                    </Suspense>
                );
            case 'agentPropertyDetail':
                return selectedProperty ? (
                    <Suspense fallback={<PageLoadFallback />}>
                        <AgentPropertyDetailPage property={selectedProperty} onBack={() => handleNavigate('agentPortal')} />
                    </Suspense>
                ) : (
                    <Suspense fallback={<PageLoadFallback />}>
                        <AgentPortal
                            onNavigate={(v) => handleNavigate(v as View)}
                            onViewClient={handleViewClient}
                            onViewProperty={handleViewAgentProperty}
                            selectedProperty={selectedProperty}
                            selectedClient={selectedClient}
                        />
                    </Suspense>
                );
            case 'privacy':
                return (
                    <Suspense fallback={<PageLoadFallback />}>
                        <PrivacyPage onBack={handleBackFromLegal} />
                    </Suspense>
                );
            case 'terms':
                return (
                    <Suspense fallback={<PageLoadFallback />}>
                        <TermsPage onBack={handleBackFromLegal} />
                    </Suspense>
                );
            case 'arco':
                return (
                    <Suspense fallback={<PageLoadFallback />}>
                        <ArcoFormPage onBack={handleBackFromLegal} />
                    </Suspense>
                );
            case 'about':
                return (
                    <Suspense fallback={<PageLoadFallback />}>
                        <AboutPage
                            onNavigate={(v: View) => handleNavigate(v)}
                            onNavigateToProperties={handleNavigateToProperties}
                        />
                    </Suspense>
                );
            case 'contact':
                return (
                    <Suspense fallback={<PageLoadFallback />}>
                        <ContactPage />
                    </Suspense>
                );
            case 'servicios':
                return <ServiciosPage />;
            case 'home':
            default:
                return homePage;
        }
    };

    return (
        <div className="bg-white text-gray-800 font-sans">
            <Header
                onNavigate={handleNavigate}
                onLogout={handleLogout}
                onNavClick={handleNavClick}
                onOpenAppointmentModal={() => setAppointmentModalOpen(true)}
            />
            <main>{renderContent()}</main>
            {!isAuthenticated && <WhatsAppButton phoneNumber="524779155107" />}
            {!isAuthenticated && (
                <Suspense fallback={null}>
                    <Chatbot />
                </Suspense>
            )}
            <Footer onNavClick={handleNavClick} />
            {isAppointmentModalOpen && (
                <Suspense fallback={null}>
                    <AppointmentModal isOpen={isAppointmentModalOpen} onClose={() => setAppointmentModalOpen(false)} />
                </Suspense>
            )}
            <CookieBanner onNavClick={handleNavClick} />
            <Suspense fallback={null}>
                <DataMigration />
            </Suspense>
            {import.meta.env.DEV && <SyncStatus isOnline={isOnline} lastSync={lastSync || undefined} />}
        </div>
    );
}

const AppWrapper: React.FC = () => (
    <I18nProvider>
        <AuthProvider>
            <PropertyProvider>
                <ClientProvider>
                    <CampaignProvider>
                        <MCPProvider>
                            <App />
                        </MCPProvider>
                    </CampaignProvider>
                </ClientProvider>
            </PropertyProvider>
        </AuthProvider>
    </I18nProvider>
);

export default AppWrapper;
