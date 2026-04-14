import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useI18n } from './I18nContext';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { t } = useI18n();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await login(username, password);
        if (success) {
            onLoginSuccess();
        } else {
            setError(t('login.error') || 'Credenciales inválidas o usuario sin correo asociado.');
        }
    };

    return (
        <section className="py-16 md:py-24 bg-gray-100">
            <div className="container mx-auto px-4 sm:px-6 max-w-md">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl">
                    <h2 className="text-3xl font-extrabold text-inverland-black mb-6 text-center">{t('login.title')}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</p>}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">{t('login.username')}</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-inverland-blue focus:border-inverland-blue bg-white text-gray-800"
                                aria-required="true"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('login.password')}</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-inverland-blue focus:border-inverland-blue bg-white text-gray-800"
                                aria-required="true"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-inverland-off-white bg-inverland-blue hover:bg-inverland-light-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-inverland-blue transition-transform transform hover:scale-105"
                            >
                                {t('login.button')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;