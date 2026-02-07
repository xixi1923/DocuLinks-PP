"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebaseConfig';
import { onAuthStateChanged, getIdTokenResult, User } from 'firebase/auth';

type Role = 'admin' | 'user' | undefined;

interface RoleState {
  user: User | null;
  role: Role;
  isAdmin: boolean;
  loading: boolean;
  refreshRole: () => Promise<void>;
}

const Ctx = createContext<RoleState>({
  user: null,
  role: undefined,
  isAdmin: false,
  loading: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refreshRole: async () => {},
});

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(undefined);
  const [loading, setLoading] = useState(true);

  const readRole = async (u: User | null) => {
    if (!u) {
      setRole(undefined);
      return;
    }
    try {
      const token = await getIdTokenResult(u, true);
      const r = (token.claims as any)?.role as Role;
      setRole(r);
    } catch (e) {
      setRole(undefined);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      await readRole(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const refreshRole = async () => readRole(user);

  return (
    <Ctx.Provider value={{ user, role, isAdmin: role === 'admin', loading, refreshRole }}>
      {children}
    </Ctx.Provider>
  );
}

export function useUserRole() {
  return useContext(Ctx);
}
