import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/supabase';
import { isDemoMode, getDemoData, getCurrentDemoUser, setCurrentDemoUser } from '@/lib/demoData';

interface AuthContextType {
  user: Profile | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isSupervisor: boolean;
  isTechnician: boolean;
  isCustomer: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as Profile;
  }

  async function refreshUser() {
    if (isDemoMode()) {
      const demoUser = getCurrentDemoUser();
      if (demoUser) {
        setUser(demoUser as unknown as Profile);
        setSession({ user: { id: demoUser.id, email: demoUser.email } });
      } else {
        setUser(null);
        setSession(null);
      }
      return;
    }
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    setSession(currentSession);
    if (currentSession?.user) {
      const profile = await fetchProfile(currentSession.user.id);
      setUser(profile);
    } else {
      setUser(null);
    }
  }

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));

    if (!isDemoMode()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: any) => {
        setSession(session);
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  async function signIn(email: string, password: string) {
    if (isDemoMode()) {
      const data = getDemoData();
      const found = data.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
      if (!found) {
        return { error: { message: 'Usuario no encontrado' } };
      }
      if (password !== 'admin123') {
        return { error: { message: 'Contraseña incorrecta (demo: admin123)' } };
      }
      setCurrentDemoUser(found);
      setUser(found as unknown as Profile);
      setSession({ user: { id: found.id, email: found.email } });
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) await refreshUser();
    return { error };
  }

  async function signUp(email: string, password: string, fullName: string, role = 'customer') {
    if (isDemoMode()) {
      const data = getDemoData();
      const exists = data.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return { error: { message: 'Email ya registrado' } };
      }
      const newUser = {
        id: 'demo-' + Date.now(),
        email,
        full_name: fullName,
        role: role as any,
        status: 'active' as const,
        avatar_url: null,
        phone: null,
        whatsapp_number: null,
        license_number: null,
        gps_tracking_enabled: false,
        current_location_lat: null,
        current_location_lng: null,
      };
      data.profiles.push(newUser);
      saveDemoData(data);
      setCurrentDemoUser(newUser as any);
      setUser(newUser as unknown as Profile);
      return { error: null };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } }
    });
    if (!error && data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: role as any,
        status: 'active',
        gps_tracking_enabled: false,
      });
      await refreshUser();
    }
    return { error };
  }

  async function signOut() {
    if (isDemoMode()) {
      setCurrentDemoUser(null);
      setUser(null);
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }

  const isAdmin = user?.role === 'admin';
  const isSupervisor = user?.role === 'supervisor' || isAdmin;
  const isTechnician = user?.role === 'plumber' || user?.role === 'electrician';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider value={{
      user, session, loading,
      signIn, signUp, signOut,
      isAdmin, isSupervisor, isTechnician, isCustomer,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

function saveDemoData(data: any) {
  localStorage.setItem('profix_demo_data', JSON.stringify(data));
}
