import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  CalendarDays,
  Users,
  UserCircle,
  Wrench,
  DollarSign,
  Settings,
  LogOut,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'supervisor', 'plumber', 'electrician'] },
  { path: '/quotes', label: 'Presupuestos', icon: FileText, roles: ['admin', 'supervisor', 'plumber', 'electrician'] },
  { path: '/jobs', label: 'Trabajos', icon: Briefcase, roles: ['admin', 'supervisor', 'plumber', 'electrician'] },
  { path: '/appointments', label: 'Citas', icon: CalendarDays, roles: ['admin', 'supervisor', 'plumber', 'electrician'] },
  { path: '/employees', label: 'Empleados', icon: Users, roles: ['admin', 'supervisor'] },
  { path: '/customers', label: 'Clientes', icon: UserCircle, roles: ['admin', 'supervisor'] },
  { path: '/inventory', label: 'Inventario', icon: Wrench, roles: ['admin', 'supervisor', 'plumber', 'electrician'] },
  { path: '/finances', label: 'Finanzas', icon: DollarSign, roles: ['admin', 'supervisor'] },
  { path: '/gps', label: 'GPS Tracking', icon: MapPin, roles: ['admin', 'supervisor'] },
  { path: '/settings', label: 'Configuración', icon: Settings, roles: ['admin', 'supervisor'] },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, isAdmin, isSupervisor } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const visibleNav = navItems.filter((item) => {
    if (isAdmin) return true;
    if (isSupervisor) return item.roles.includes('supervisor');
    return item.roles.includes(user?.role as string);
  });

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b px-3">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src="/icons/icon-192x192.png" alt="ProFix" className="h-8 w-8" />
            <span className="font-bold text-lg text-[#1e3a5f]">ProFix</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="ml-auto">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Button
                  variant={active ? 'secondary' : 'ghost'}
                  className={`w-full justify-start gap-3 ${collapsed ? 'px-2' : 'px-3'}`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user?.avatar_url || ''} />
            <AvatarFallback>{user?.full_name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.full_name || 'Usuario'}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 mt-2 ${collapsed ? 'px-2' : 'px-3'}`}
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Salir</span>}
        </Button>
      </div>
    </aside>
  );
}
