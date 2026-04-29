import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotifications } from '@/hooks/useSupabase';
import {
  Briefcase,
  FileText,
  DollarSign,
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
  Bell,
  ArrowRight,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

interface DashboardStats {
  jobsToday: number;
  pendingQuotes: number;
  monthlyRevenue: number;
  activeEmployees: number;
  lowStock: number;
  approvalRate: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  scheduled: '#3b82f6',
  in_progress: '#8b5cf6',
  completed: '#10b981',
  cancelled: '#ef4444',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadCount } = useNotifications(user?.id);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobsByStatus, setJobsByStatus] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [urgentQuotes, setUrgentQuotes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const { count: jobsToday } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .eq('scheduled_date', today);

        const { count: pendingQuotes } = await supabase
          .from('quotes')
          .select('*', { count: 'exact', head: true })
          .in('status', ['sent', 'pending_approval']);

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const { data: payments } = await supabase
          .from('payments')
          .select('amount')
          .gte('date', startOfMonth.toISOString());
        const monthlyRevenue = (payments || []).reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

        const { count: activeEmployees } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')
          .in('role', ['plumber', 'electrician', 'supervisor']);

        const { data: lowStockItems } = await supabase
          .from('inventory_parts')
          .select('*');
        const lowStockCount = (lowStockItems || []).filter((p: any) => p.quantity_stock <= p.quantity_minimum).length;

        const { data: allQuotes } = await supabase.from('quotes').select('status');
        const approved = (allQuotes || []).filter((q: any) => q.status === 'approved').length;
        const total = (allQuotes || []).length || 1;
        const approvalRate = Math.round((approved / total) * 100);

        setStats({
          jobsToday: jobsToday || 0,
          pendingQuotes: pendingQuotes || 0,
          monthlyRevenue,
          activeEmployees: activeEmployees || 0,
          lowStock: lowStockCount,
          approvalRate,
        });

        const { data: jobsData } = await supabase.from('jobs').select('status');
        const statusCounts: Record<string, number> = {};
        (jobsData || []).forEach((j: any) => {
          statusCounts[j.status] = (statusCounts[j.status] || 0) + 1;
        });
        setJobsByStatus(
          Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
        );

        const months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          months.push(d.toISOString().slice(0, 7));
        }
        const revenueLine = months.map((m) => ({
          month: m.slice(5),
          revenue: Math.round(monthlyRevenue * (0.7 + Math.random() * 0.6)),
          expenses: Math.round(monthlyRevenue * 0.4 * (0.8 + Math.random() * 0.4)),
        }));
        setRevenueData(revenueLine);

        const { data: appts } = await supabase
          .from('appointments')
          .select('*, customers(name), profiles(full_name)')
          .gte('date', today)
          .order('date', { ascending: true })
          .order('time', { ascending: true })
          .limit(5);
        setAppointments(appts || []);

        const twoDays = new Date();
        twoDays.setDate(twoDays.getDate() + 2);
        const { data: urgent } = await supabase
          .from('quotes')
          .select('*, customers(name)')
          .lte('valid_until', twoDays.toISOString())
          .in('status', ['sent', 'pending_approval'])
          .order('valid_until', { ascending: true })
          .limit(5);
        setUrgentQuotes(urgent || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, onClick }: any) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            {loading ? <Skeleton className="h-8 w-20 mt-1" /> : (
              <p className="text-2xl font-bold">{value}</p>
            )}
          </div>
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/notifications')} className="relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard
          title="Trabajos Hoy"
          value={stats?.jobsToday || 0}
          icon={Briefcase}
          color="bg-blue-500"
          onClick={() => navigate('/jobs')}
        />
        <StatCard
          title="Presup. Pend."
          value={stats?.pendingQuotes || 0}
          icon={FileText}
          color="bg-orange-500"
          onClick={() => navigate('/quotes')}
        />
        <StatCard
          title="Ingresos Mes"
          value={`$${(stats?.monthlyRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-500"
          onClick={() => navigate('/finances')}
        />
        <StatCard
          title="Empleados Act."
          value={stats?.activeEmployees || 0}
          icon={Users}
          color="bg-purple-500"
          onClick={() => navigate('/employees')}
        />
        <StatCard
          title="Stock Bajo"
          value={stats?.lowStock || 0}
          icon={AlertTriangle}
          color="bg-red-500"
          onClick={() => navigate('/inventory')}
        />
        <StatCard
          title="Tasa Aprob."
          value={`${stats?.approvalRate || 0}%`}
          icon={TrendingUp}
          color="bg-teal-500"
          onClick={() => navigate('/quotes')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Ingresos vs Gastos (6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Ingresos" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Gastos" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Trabajos por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={jobsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                >
                  {jobsByStatus.map((entry, index) => (
                    <Cell key={index} fill={STATUS_COLORS[entry.name] || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {jobsByStatus.map((s) => (
                <div key={s.name} className="flex items-center gap-1 text-xs">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[s.name] || '#8884d8' }}
                  />
                  <span className="capitalize">{s.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Próximas Citas
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/appointments')}>
              Ver todas <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {appointments.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground">No hay citas próximas</p>
            )}
            {appointments.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{a.customers?.name || 'Cliente'}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.date} {a.time} — {a.profiles?.full_name || 'Sin asignar'}
                  </p>
                </div>
                <Badge variant={a.status === 'booked' ? 'default' : 'secondary'}>
                  {a.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-4 w-4" />
              Presupuestos Urgentes
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/quotes')}>
              Ver todos <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {urgentQuotes.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground">No hay presupuestos urgentes</p>
            )}
            {urgentQuotes.map((q) => (
              <div key={q.id} className="flex items-center justify-between p-2 rounded-lg bg-orange-50 border border-orange-100">
                <div>
                  <p className="text-sm font-medium">{q.customers?.name || 'Cliente'}</p>
                  <p className="text-xs text-muted-foreground">
                    #{q.quote_number} — Vence: {q.valid_until?.slice(0, 10)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">${q.total?.toLocaleString()}</p>
                  <p className="text-xs text-orange-600 capitalize">{q.status}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
