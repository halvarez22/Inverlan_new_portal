import React, { useState } from 'react';
import { Property, User, Client } from '../types';
import { loggingService } from '../services/loggingService';

interface SalesPipelineProps {
    properties: Property[];
    users: User[];
    clients: Client[];
    onAssignClient: (property: Property) => void;
    updateProperty: (property: Property) => void;
}

const SalesPipeline: React.FC<SalesPipelineProps> = ({ properties, users, clients, onAssignClient, updateProperty }) => {
    const pipelineStages: Property['pipelineStage'][] = ['Lead', 'Contactado', 'Visita Agendada', 'Negociación', 'Cerrado'];
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const [dragOverStage, setDragOverStage] = useState<Property['pipelineStage'] | null>(null);

    const getAgentName = (agentId: string | null | undefined) => {
        if (!agentId) return 'No asignado';
        const agent = users.find(u => u.id === agentId);
        return agent?.name || agent?.username || 'Desconocido';
    };

    const getClientName = (clientId: string | null | undefined) => {
        if (!clientId) return null;
        const client = clients.find(c => c.id === clientId);
        return client?.name || null;
    }
    
    const formatPrice = (price: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(price);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, stage: NonNullable<Property['pipelineStage']>) => {
        const propertyId = e.dataTransfer.getData('propertyId');
        setDragOverStage(null);
        setDraggedItemId(null);

        const propertyToMove = properties.find(p => p.id === propertyId);
        if (propertyToMove && propertyToMove.pipelineStage !== stage) {
            const oldStage = propertyToMove.pipelineStage;
            const updatedProperty: Property = { ...propertyToMove, pipelineStage: stage };
            
            if (stage === 'Cerrado') {
                updatedProperty.soldAt = new Date().toISOString();
                const agent = users.find(u => u.id === propertyToMove.agentId);
                if (agent && agent.commissionRate) {
                    updatedProperty.commissionAmount = propertyToMove.price * agent.commissionRate;
                }
            } else {
                // Clear commission fields if moved out of "Cerrado"
                updatedProperty.soldAt = undefined;
                updatedProperty.commissionAmount = undefined;
            }
            
            updateProperty(updatedProperty);
            loggingService.logSecurity('PIPELINE_STAGE_CHANGE', true, undefined, undefined, `Property ${propertyId} moved from ${oldStage} to ${stage}`);
        }
    };

    return (
        <div className="w-full overflow-x-auto pb-4">
            <div className="flex space-x-4 min-w-max">
                {pipelineStages.map(stage => {
                    const stageProperties = properties.filter(p => p.pipelineStage === stage);
                    const totalValue = stageProperties.reduce((sum, prop) => sum + prop.price, 0);

                    return (
                        <div 
                            key={stage} 
                            className={`rounded-lg w-72 lg:w-80 flex-shrink-0 flex flex-col transition-all duration-300 border-2 ${dragOverStage === stage ? 'bg-inverland-blue/10 border-inverland-blue scale-[1.02] shadow-lg' : 'bg-gray-100 border-transparent'}`}
                            onDragOver={(e) => { e.preventDefault(); setDragOverStage(stage); }}
                            onDragLeave={() => setDragOverStage(null)}
                            onDrop={(e) => handleDrop(e, stage!)}
                        >
                            <div className="p-3 border-b bg-white rounded-t-lg sticky top-0 z-10 shadow-sm">
                                <h4 className="text-md font-bold text-inverland-dark flex justify-between items-center">
                                    <span>{stage}</span>
                                    <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">{stageProperties.length}</span>
                                </h4>
                                <p className="text-xs text-gray-500 font-medium mt-1">{formatPrice(totalValue)}</p>
                            </div>
                            <div className="p-3 space-y-3 overflow-y-auto h-[60vh] flex-grow custom-scrollbar">
                                {stageProperties.length > 0 ? stageProperties.map(prop => {
                                    const clientName = getClientName(prop.clientId);
                                    return (
                                        <div 
                                            key={prop.id} 
                                            draggable="true"
                                            onDragStart={(e) => { 
                                                e.dataTransfer.setData('propertyId', prop.id); 
                                                setDraggedItemId(prop.id); 
                                                // Create a custom drag image if needed, for now use default
                                            }}
                                            onDragEnd={() => {
                                                setDraggedItemId(null);
                                                setDragOverStage(null);
                                            }}
                                            className={`bg-white p-3 rounded-md shadow-sm border-l-4 transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow-md ${draggedItemId === prop.id ? 'opacity-40 grayscale' : 'opacity-100'} ${stage === 'Cerrado' ? 'border-l-green-500' : 'border-l-inverland-blue'}`}
                                        >
                                            <p className="font-semibold text-gray-800 text-sm truncate">{prop.title}</p>
                                            <p className="text-xs text-gray-500 truncate">{prop.location}</p>
                                            <p className="text-sm font-bold text-inverland-green mt-1">{formatPrice(prop.price)}</p>
                                            
                                            {stage === 'Cerrado' && prop.commissionAmount && (
                                                <div className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded mt-2 inline-block">
                                                    COMISIÓN: {formatPrice(prop.commissionAmount)}
                                                </div>
                                            )}

                                            <div className="text-[10px] text-gray-500 mt-2 border-t pt-2 space-y-1">
                                                <p className="flex justify-between"><span className="font-medium">Agente:</span> <span className="truncate max-w-[120px]">{getAgentName(prop.agentId)}</span></p>
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium mr-1">Cliente:</p>
                                                    <button onClick={() => onAssignClient(prop)} className={`text-right text-[10px] font-semibold py-0.5 px-1.5 rounded truncate max-w-[120px] ${clientName ? 'text-inverland-blue bg-blue-50 hover:bg-blue-100' : 'text-gray-400 bg-gray-50 hover:bg-gray-100 border border-dashed'}`}>
                                                        {clientName || 'Sin asignar'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : (
                                     <div className={`text-center text-sm p-4 h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors ${dragOverStage === stage ? 'border-inverland-blue text-inverland-blue' : 'border-gray-300 text-gray-400'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                                        <p className="text-xs">Sin propiedades</p>
                                    </div>
                                )}
                                
                                {dragOverStage === stage && draggedItemId && !stageProperties.some(p => p.id === draggedItemId) && (
                                    <div className="bg-inverland-blue/5 border-2 border-dashed border-inverland-blue/30 p-3 rounded-md h-24 animate-pulse"></div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div>
    );
};

export default SalesPipeline;

