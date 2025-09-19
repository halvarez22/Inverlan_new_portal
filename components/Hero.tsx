import React, { useState } from 'react';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
);

interface HeroProps {
    onSearch: (query: string) => void;
    isSearching: boolean;
}

const Hero: React.FC<HeroProps> = ({ onSearch, isSearching }) => {
    const [query, setQuery] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <section id="home" className="relative h-screen min-h-[500px] flex items-center justify-center text-white">
            <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
            <img src="./images/portada.jpeg" alt="Portada Inverland" className="absolute inset-0 w-full h-full object-cover" />
            
            <div className="relative z-20 text-center px-4 w-full">
                <div className="mb-6">
                    <img src="./images/logo.png" alt="Inverland" className="h-16 w-auto mx-auto drop-shadow-lg" />
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg">La mejor elección inmobiliaria en México</h1>
                <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-md">Describe la propiedad de tus sueños y la encontraremos para ti.</p>
                
                <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-2xl max-w-3xl mx-auto">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ej: Casa con alberca en Querétaro"
                            className="w-full flex-grow p-3 sm:p-4 rounded-md border border-gray-300 bg-white text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-inverland-green focus:border-transparent outline-none"
                            aria-label="Búsqueda de propiedades"
                        />
                        <button 
                            type="submit" 
                            disabled={isSearching}
                            className="w-full sm:w-auto bg-inverland-green text-white font-bold p-3 sm:p-4 rounded-md flex items-center justify-center hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-md disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
                        >
                            {isSearching ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <SearchIcon />
                                    Buscar
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Hero;