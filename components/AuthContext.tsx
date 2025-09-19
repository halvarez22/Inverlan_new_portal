import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
    currentUser: User | null;
    isAuthenticated: boolean;
    users: User[];
    login: (username: string, password: string) => boolean;
    logout: () => void;
    registerUser: (newUser: Omit<User, 'id'>) => boolean;
    updateUser: (updatedUser: User) => void;
    deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    
    const saveUsers = (newUsers: User[]) => {
        try {
            localStorage.setItem('inverland_users', JSON.stringify(newUsers));
        } catch (error) {
            console.error("Failed to save users to localStorage:", error);
        }
        setUsers(newUsers);
    };

    useEffect(() => {
        // Load users from localStorage, or initialize with defaults
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
                saveUsers(initialUsers);
            }
            
            // Check for a logged-in user in session storage
            const sessionUser = sessionStorage.getItem('inverland_session');
            if (sessionUser) {
                setCurrentUser(JSON.parse(sessionUser));
            }
        } catch (error) {
            console.error("Failed to access browser storage:", error);
        }
    }, []);

    const login = (username: string, password: string): boolean => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            const userToStore = { ...user };
            delete userToStore.password; // Do not store password in session
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

    const registerUser = (newUser: Omit<User, 'id'>): boolean => {
        if (users.some(u => u.username === newUser.username)) {
            return false; // Username already exists
        }
        const userWithId: User = { ...newUser, id: `user-${Date.now()}` };
        saveUsers([...users, userWithId]);
        return true;
    };
    
    const updateUser = (updatedUser: User) => {
        const updatedUsers = users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u);
        saveUsers(updatedUsers);

        // Update current user session if they are the one being edited
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

    const deleteUser = (userId: string) => {
        if (userId === currentUser?.id) {
            alert("No puedes eliminar al usuario con el que has iniciado sesión.");
            return;
        }
        if (window.confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.")) {
            const updatedUsers = users.filter(u => u.id !== userId);
            saveUsers(updatedUsers);
        }
    };
    
    const isAuthenticated = !!currentUser;

    return (
        <AuthContext.Provider value={{ currentUser, isAuthenticated, users, login, logout, registerUser, updateUser, deleteUser }}>
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