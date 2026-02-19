/**
 * Origen Antifrágil - Base de Datos Centralizada con Persistencia (Mock)
 * Este archivo gestiona los datos maestros en LocalStorage para simular una DB funcional.
 */

const DEFAULT_OA_DATA = {
    experts: [
        { id: 'exp_1', name: 'Ing. Silas Vane', specialty: 'Ciberseguridad & Robustez', rating: 4.9, sessions: 156, price: 150, status: 'Disponible', bio: 'Estratega senior en sistemas resilientes.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
        { id: 'exp_2', name: 'Dra. Elena Vance', specialty: 'Estrategia IA & Datos', rating: 5.0, sessions: 89, price: 200, status: 'En Sesión', bio: 'PhD en Inteligencia Artificial Aplicada.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
        { id: 'exp_3', name: 'Lic. Manuel Rodriguez', specialty: 'Finanzas Corporativas', rating: 4.8, sessions: 210, price: 120, status: 'Disponible', bio: 'Experto en optimización de flujo de caja.', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
        { id: 'exp_4', name: 'Arq. Aristhène Zoller', specialty: 'Arquitectura de Procesos', rating: 4.7, sessions: 64, price: 180, status: 'Offline', bio: 'Diseño de flujos operativos escalables.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
        { id: 'exp_5', name: 'Dra. Isabela Luna', specialty: 'Derecho Tecnológico', rating: 4.9, sessions: 45, price: 160, status: 'Disponible', bio: 'Asesoría legal para startups de base tecnológica.', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200' },
        { id: 'exp_6', name: 'Ing. Marcos Ruiz', specialty: 'Sostenibilidad Energética', rating: 4.6, sessions: 78, price: 140, status: 'En Sesión', bio: 'Transformación energética para MiPyMEs.', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200' },
        { id: 'exp_7', name: 'Mg. Laura Torres', specialty: 'Recursos Humanos Senior', rating: 4.8, sessions: 112, price: 110, status: 'Disponible', bio: 'Cultura organizacional y liderazgo.', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' },
        { id: 'exp_8', name: 'Dr. Roberto Kane', specialty: 'Gestión de Riesgos', rating: 5.0, sessions: 230, price: 250, status: 'Disponible', bio: 'Manejo de crisis y planes de contingencia.', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200' }
    ],
    clients: [
        { id: 'cli_1', name: 'Innovate Corp', email: 'cliente@antifragil.com', plan: 'Premium', industry: 'Software', status: 'Activo', credits: 12, totalSpent: 4800, img: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?auto=format&fit=crop&q=80&w=150' },
    ],
    sessions: [
        { id: 'ses_1', clientEmail: 'cliente@antifragil.com', expert: 'Ing. Silas Vane', date: '2026-05-20', time: '16:30', topic: 'Ciberresiliencia', cost: 1200, status: 'Agendada' },
        { id: 'ses_2', clientEmail: 'cliente@antifragil.com', expert: 'Dra. Elena Vance', date: '2026-05-19', time: '10:00', topic: 'Optimización IA', cost: 800, status: 'Completada' },
        { id: 'ses_3', clientEmail: 'admin@antifragil.com', expert: 'Ing. Silas Vane', date: '2026-05-15', time: '09:00', topic: 'Auditoría de Seguridad', cost: 1500, status: 'Completada' },
        { id: 'ses_4', clientEmail: 'cliente@antifragil.com', expert: 'Ing. Silas Vane', date: '2026-05-10', time: '11:00', topic: 'Plan de Antifragilidad', cost: 2000, status: 'Completada' }
    ],
    invoices: [
        { id: 'INV-001', date: '2026-05-01', amount: 1200.00, status: 'Pagada', concept: 'Suscripción Premium Mayo' },
        { id: 'INV-002', date: '2026-04-01', amount: 1200.00, status: 'Pagada', concept: 'Suscripción Premium Abril' }
    ],
    metrics: {
        totalRevenue: 142850,
        monthlyGrowth: 15.4,
        activePymes: 215,
        expertNetworkSize: 48,
        antiFragilityScore: 92,
        unsuccessfulSessions: 3
    },
    schedules: ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']
};

// Singleton para manejar la DB
const DB = {
    get: () => {
        const data = localStorage.getItem('OA_DATABASE');
        return data ? JSON.parse(data) : DEFAULT_OA_DATA;
    },
    save: (data) => {
        localStorage.setItem('OA_DATABASE', JSON.stringify(data));
    },
    reset: () => {
        localStorage.removeItem('OA_DATABASE');
        location.reload();
    }
};

// Iniciar base de datos si no existe
if (!localStorage.getItem('OA_DATABASE')) {
    DB.save(DEFAULT_OA_DATA);
}

// Alias global para compatibilidad con scripts existentes
const OA_DATA = DB.get();
