import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Notification } from '@/lib/supabase';

export function useRealtime<T>(
  table: string,
  query?: () => Promise<T[]>
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (query) {
          const result = await query();
          setData(result);
        } else {
          const { data: d, error: e } = await supabase.from(table).select('*');
          if (e) throw e;
          setData(d as T[]);
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    const channel = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table]);

  return { data, loading, error, refresh: () => setLoading(true) };
}

export function useCompanySettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('company_settings').select('*').single();
      setSettings(data);
      setLoading(false);
    }
    fetch();
  }, []);

  return { settings, loading };
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    async function fetch() {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      setNotifications(data || []);
      setUnreadCount((data || []).filter((n: any) => !n.read_status).length);
    }
    fetch();

    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, fetch)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read_status: true }).eq('id', id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_status: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  return { notifications, unreadCount, markAsRead };
}
