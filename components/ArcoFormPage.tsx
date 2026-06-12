import React, { useState } from 'react';
import { useI18n } from './I18nContext';

const ArcoFormPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useI18n();
    
    const [formData, setFormData] = useState({
        // Motivo
        motivo: [] as string[],
        
        // Identificación
        tipoIdentificacion: 'Credencial de Elector',
        acreditacionPersonalidad: 'Carta poder',
        
        // Datos Solicitante
        nombres: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        
        // Domicilio
        calle: '',
        numExt: '',
        numInt: '',
        colonia: '',
        cp: '',
        ciudad: '',
        estado: '',
        pais: '',
        
        // Contacto
        email: '',
        telefono: '',
        
        // Forma de entrega
        formaEntrega: 'Medios electrónicos (Sin costo)'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            if (checked) {
                return { ...prev, motivo: [...prev.motivo, value] };
            } else {
                return { ...prev, motivo: prev.motivo.filter(m => m !== value) };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.motivo.length === 0) {
            alert('Por favor seleccione al menos un motivo para su solicitud.');
            return;
        }

        const subject = `Solicitud de Derechos ARCO - ${formData.nombres} ${formData.apellidoPaterno}`;
        
        const body = `FORMATO DE SOLICITUD DE ACCESO, RECTIFICACIÓN, CANCELACIÓN Y OPOSICIÓN DE DATOS PERSONALES

1. MOTIVO DE LA SOLICITUD:
${formData.motivo.map(m => `- ${m}`).join('\n')}

2. DOCUMENTO OFICIAL CON EL QUE SE IDENTIFICA:
Tipo: ${formData.tipoIdentificacion}
Acreditación de personalidad: ${formData.acreditacionPersonalidad}

3. DATOS DEL SOLICITANTE:
Nombre(s): ${formData.nombres}
Apellido Paterno: ${formData.apellidoPaterno}
Apellido Materno: ${formData.apellidoMaterno}

4. DOMICILIO:
Calle: ${formData.calle}
Núm. Ext: ${formData.numExt}
Núm. Int: ${formData.numInt || 'N/A'}
Colonia: ${formData.colonia}
C.P.: ${formData.cp}
Ciudad: ${formData.ciudad}
Estado: ${formData.estado}
País: ${formData.pais}

5. CONTACTO:
Correo Electrónico: ${formData.email}
Teléfono: ${formData.telefono}
Fecha de presentación: ${new Date().toLocaleDateString()}

6. FORMA EN QUE DESEA LE SEA ENTREGADA LA INFORMACIÓN:
${formData.formaEntrega}

----------------------------------------------------
IMPORTANTE: El solicitante adjunta copia de su identificación oficial a este correo.
`;

        const mailtoLink = `mailto:hola@inverland.mx?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Show alert about attaching the ID
        alert('ATENCIÓN: Se abrirá tu cliente de correo electrónico. POR FAVOR NO OLVIDES ADJUNTAR UNA FOTO O COPIA ESCANEADA DE TU IDENTIFICACIÓN OFICIAL antes de enviar el correo.');
        
        window.location.href = mailtoLink;
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Header bar */}
            <div className="bg-gradient-to-r from-inverland-black to-inverland-blue text-white py-12 px-4">
                <div className="container mx-auto max-w-4xl">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-inverland-light-blue hover:text-inverland-aqua transition-colors mb-6 text-sm font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-extrabold">Solicitud de Derechos ARCO</h1>
                    <p className="mt-2 text-inverland-light-blue text-sm">Formulario de Acceso, Rectificación, Cancelación y Oposición</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto max-w-4xl px-4 mt-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 border-t-4 border-inverland-green">
                    
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8 rounded-r-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-orange-700 font-medium">
                                    Importante: Al finalizar y hacer clic en "Generar Solicitud", se abrirá tu programa de correo electrónico. 
                                    <strong> Es obligatorio adjuntar tu identificación oficial</strong> antes de presionar Enviar.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 text-gray-700">
                        
                        {/* 1. MOTIVO */}
                        <section>
                            <h2 className="text-xl font-bold text-inverland-dark mb-4 border-b pb-2">1. Motivo de la Solicitud</h2>
                            <p className="text-sm text-gray-500 mb-4">Seleccione uno o más procedimientos que solicita:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    'Derecho de Acceso', 
                                    'Derecho de Rectificación', 
                                    'Derecho de Cancelación', 
                                    'Derecho de Oposición',
                                    'Revocación del consentimiento',
                                    'Limitación al uso o divulgación',
                                    'Oposición a transferencia de datos'
                                ].map((motivo) => (
                                    <label key={motivo} className="flex items-start space-x-3">
                                        <input 
                                            type="checkbox" 
                                            value={motivo}
                                            checked={formData.motivo.includes(motivo)}
                                            onChange={handleCheckboxChange}
                                            className="mt-1 rounded text-inverland-green focus:ring-inverland-green"
                                        />
                                        <span className="text-sm">{motivo}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* 2. IDENTIFICACION */}
                        <section>
                            <h2 className="text-xl font-bold text-inverland-dark mb-4 border-b pb-2">2. Documento Oficial</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Identificación del solicitante</label>
                                    <select 
                                        name="tipoIdentificacion" 
                                        value={formData.tipoIdentificacion} 
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green"
                                    >
                                        <option value="Credencial de Elector">Credencial de Elector (INE)</option>
                                        <option value="Pasaporte vigente">Pasaporte vigente</option>
                                        <option value="Cartilla del Servicio Militar">Cartilla del Servicio Militar</option>
                                        <option value="Cedula Profesional">Cédula Profesional</option>
                                        <option value="Credencial de afiliación del IMSS/ISSSTE/INAPAM">Credencial afiliación IMSS/ISSSTE/INAPAM</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Documento con que acredita personalidad</label>
                                    <select 
                                        name="acreditacionPersonalidad" 
                                        value={formData.acreditacionPersonalidad} 
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green"
                                    >
                                        <option value="Ninguno (Trámite Personal)">Ninguno (Trámite Personal)</option>
                                        <option value="Carta poder">Carta poder simple</option>
                                        <option value="Poder notarial">Poder notarial</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* 3. DATOS DEL SOLICITANTE */}
                        <section>
                            <h2 className="text-xl font-bold text-inverland-dark mb-4 border-b pb-2">3. Datos del Solicitante</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s) *</label>
                                    <input type="text" name="nombres" required value={formData.nombres} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno *</label>
                                    <input type="text" name="apellidoPaterno" required value={formData.apellidoPaterno} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno *</label>
                                    <input type="text" name="apellidoMaterno" required value={formData.apellidoMaterno} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green" />
                                </div>
                            </div>
                        </section>

                        {/* 4. DOMICILIO */}
                        <section>
                            <h2 className="text-xl font-bold text-inverland-dark mb-4 border-b pb-2">4. Domicilio</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Calle *</label>
                                    <input type="text" name="calle" required value={formData.calle} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Núm Ext. *</label>
                                    <input type="text" name="numExt" required value={formData.numExt} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Núm Int.</label>
                                    <input type="text" name="numInt" value={formData.numInt} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green" />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Colonia *</label>
                                    <input type="text" name="colonia" required value={formData.colonia} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal *</label>
                                    <input type="text" name="cp" required value={formData.cp} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                                    <input type="text" name="ciudad" required value={formData.ciudad} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                                    <input type="text" name="estado" required value={formData.estado} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">País *</label>
                                    <input type="text" name="pais" required value={formData.pais} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green" />
                                </div>
                            </div>
                        </section>

                        {/* 5. CONTACTO */}
                        <section>
                            <h2 className="text-xl font-bold text-inverland-dark mb-4 border-b pb-2">5. Contacto</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico *</label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                                    <input type="tel" name="telefono" required value={formData.telefono} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green" />
                                </div>
                            </div>
                        </section>

                        {/* 6. FORMA DE ENTREGA */}
                        <section>
                            <h2 className="text-xl font-bold text-inverland-dark mb-4 border-b pb-2">6. Entrega de Información</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Forma en que desea le sea entregada la información:</label>
                                <select 
                                    name="formaEntrega" 
                                    value={formData.formaEntrega} 
                                    onChange={handleInputChange}
                                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:ring-inverland-green focus:border-inverland-green"
                                >
                                    <option value="Medios electrónicos (Sin costo)">Por Medios Electrónicos (Sin costo, al email proporcionado)</option>
                                    <option value="Personalmente en domicilio de Inverland (Sin costo)">Personalmente en domicilio de Inverland (Sin costo)</option>
                                    <option value="Mensajería (Con costo al solicitante)">Mensajería a mi domicilio (El pago del servicio corre a cargo del solicitante)</option>
                                    <option value="Correo certificado con acuse (Con costo)">Correo certificado con acuse (Con costo)</option>
                                </select>
                            </div>
                        </section>

                        <div className="pt-6 border-t">
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-8 py-4 bg-inverland-green hover:bg-opacity-90 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-lg flex items-center justify-center space-x-2 mx-auto"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>Generar Solicitud y Enviar</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ArcoFormPage;
