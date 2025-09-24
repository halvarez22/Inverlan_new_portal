import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, Property, Client } from '../types';

interface AuthContextType {
    currentUser: User | null;
    isAuthenticated: boolean;
    users: User[];
    statusMessage: string | null;
    clearStatusMessage: () => void;
    login: (username: string, password: string) => boolean;
    logout: () => void;
    registerUser: (newUser: Omit<User, 'id'>) => void;
    updateUser: (updatedUser: User) => void;
    deleteUser: (userId: string, currentUserName: string, properties: Property[], clients: Client[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    
    useEffect(() => {
        try {
            const storedUsers = localStorage.getItem('inverland_users');
            if (storedUsers) {
                setUsers(JSON.parse(storedUsers));
            } else {
                const adminUser: User = { id: 'admin1', username: 'admin', password: 'admin', role: 'admin', name: 'Administrador' };
                const agentUser: User = { id: 'agent1', username: 'jhernandez', password: 'password', role: 'agent', name: 'Juan Hernández', commissionRate: 0.025 }; // 2.5% rate
                const testAgent: User = { id: 'agent2', username: 'agente', password: 'agente', role: 'agent', name: 'Agente de Pruebas', commissionRate: 0.03 }; // 3% rate
                const referrerUser: User = { id: 'referrer1', username: 'referido', password: 'password', role: 'referrer', name: 'Ana de Referidos' };
                const initialUsers = [adminUser, agentUser, testAgent, referrerUser];
                localStorage.setItem('inverland_users', JSON.stringify(initialUsers));
                setUsers(initialUsers);
            }
            
            const sessionUser = sessionStorage.getItem('inverland_session');
            if (sessionUser) {
                setCurrentUser(JSON.parse(sessionUser));
            }
        } catch (error) {
            console.error("Failed to access browser storage:", error);
        }
    }, []);

    const clearStatusMessage = () => {
        setStatusMessage(null);
    };

    const login = (username: string, password: string): boolean => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            const userToStore = { ...user };
            delete userToStore.password;
            setCurrentUser(userToStore);
            try {
              sessionStorage.setItem('inverland_session', JSON.stringify(userToStore));
            } catch(error) {
              console.error("Failed to set session storage:", error)
            }
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        try {
          sessionStorage.removeItem('inverland_session');
        } catch(error) {
          console.error("Failed to remove from session storage:", error)
        }
    };

    const registerUser = (newUser: Omit<User, 'id'>) => {
        if (users.some(u => u.username === newUser.username)) {
            setStatusMessage(`Error: El usuario '${newUser.username}' ya existe.`);
            return;
        }

        setUsers(currentUsers => {
            const userWithId: User = { ...newUser, id: `user-${Date.now()}` };
            const updatedUsers = [...currentUsers, userWithId];
            try {
                localStorage.setItem('inverland_users', JSON.stringify(updatedUsers));
                setStatusMessage(`Éxito: Usuario '${newUser.username}' creado.`);
            } catch (error) {
                console.error("Failed to save users to localStorage:", error);
                setStatusMessage("Error: No se pudo guardar el usuario.");
            }
            return updatedUsers;
        });
    };
    
    const updateUser = (updatedUser: User) => {
        setUsers(currentUsers => {
            const updatedUsers = currentUsers.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u);
            try {
                localStorage.setItem('inverland_users', JSON.stringify(updatedUsers));
                setStatusMessage(`Éxito: Usuario '${updatedUser.username}' actualizado.`);
            } catch (error) {
                console.error("Failed to save users to localStorage:", error);
                setStatusMessage("Error: No se pudo actualizar el usuario.");
            }
            return updatedUsers;
        });

        if (currentUser && currentUser.id === updatedUser.id) {
            const userToStore = { ...currentUser, ...updatedUser };
            delete userToStore.password;
            setCurrentUser(userToStore);
            try {
                sessionStorage.setItem('inverland_session', JSON.stringify(userToStore));
            } catch (error) {
                console.error("Failed to update session storage:", error);
            }
        }
    };

    const deleteUser = (userId: string, currentUserName: string, properties: Property[], clients: Client[]) => {
        if (userId === currentUser?.id) {
            setStatusMessage("Error: No puedes eliminar al usuario con el que has iniciado sesión.");
            return;
        }
        
        const userToDelete = users.find(u => u.id === userId);
        if (currentUser?.role === 'admin' && userToDelete?.role === 'admin') {
            setStatusMessage("Error: Un administrador no puede eliminar a otro. Primero degrada su rol.");
            return;
        }

        const hasAssignedProperties = properties.some(p => p.agentId === userId);
        const hasAssignedClients = clients.some(c => c.assignedAgentId === userId);

        if (hasAssignedProperties || hasAssignedClients) {
            setStatusMessage(`Error: No se puede eliminar a '${currentUserName}'. Reasigna sus propiedades y clientes primero.`);
            return;
        }
        
        setUsers(currentUsers => {
            const updatedUsers = currentUsers.filter(u => u.id !== userId);
            try {
                localStorage.setItem('inverland_users', JSON.stringify(updatedUsers));
                setStatusMessage(`Éxito: Usuario '${currentUserName}' eliminado.`);
            } catch (error) {
                console.error("Failed to save users to localStorage:", error);
                 setStatusMessage("Error: No se pudo eliminar el usuario.");
            }
            return updatedUsers;
        });
    };
    
    const isAuthenticated = !!currentUser;

    return (
        <AuthContext.Provider value={{ currentUser, isAuthenticated, users, login, logout, registerUser, updateUser, deleteUser, statusMessage, clearStatusMessage }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};