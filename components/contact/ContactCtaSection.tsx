import React from 'react';

const ContactCtaSection: React.FC = () => (
    <section className="py-16 md:py-24 bg-gradient-to-r from-inverland-green to-inverland-blue text-white">
        <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                    ¿Listo para encontrar tu próxima propiedad?
                </h2>
                <p className="text-xl mb-8 text-gray-200">
                    Nuestro equipo de expertos está aquí para ayudarte en cada paso del proceso.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="tel:+524776670010"
                        className="bg-white text-inverland-green font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Llamar Ahora
                    </a>
                    <a
                        href="https://wa.me/524776670010"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white hover:text-inverland-green transition-colors duration-300"
                    >
                        WhatsApp
                    </a>
                </div>
            </div>
        </div>
    </section>
);

export default ContactCtaSection;
