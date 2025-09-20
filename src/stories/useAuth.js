import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuth = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            role: null,
            isAuthenticated: () => !!(get().user && get().token && get().role),
            login: async ({ login, password }) => {
                const isAdmin = login?.trim() === 'admin' && password === 'adminadmin';
                const role = isAdmin ? 'manager' : 'employee';
                set({user: { id: 'u1', name: login || 'User', email: `${login || 'user'}@example.com` }, token: 'fake.jwt.token', role});
                return { ok: true, role };
            },
            loginMock: (name = 'Demo User', role = 'employee') => {
                set({user: { id: 'u1', name, email: 'demo@example.com' }, token: 'fake.jwt.token', role});
            },
            setRoleFromDemo: (demo) => {
                const role = demo === '1' ? 'manager' : demo === '2' ? 'employee' : null;
                if (!role) return;
                set({user: { id: 'u1', name: 'Demo User', email: 'demo@example.com' }, token: 'fake.jwt.token', role});
            },
            logout: () => {
                set({ user: null, token: null, role: null });
            }
        }),
        { name: 'auth_storage' }
    )
);
