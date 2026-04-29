import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  CalendarDays,
  UserCircle,
  Wrench,
  Settings,
} from 'lucide-react';

const mobileNavItems = [
  { path: '/', label: 'Inicio', icon: LayoutDashboard },
  { path: '/quotes', label: 'Presup.', icon: FileText },
  { path: '/jobs', label: 'Trabajos', icon: Briefcase },
  { path: '/appointments', label: 'Citas', icon: CalendarDays },
  { path: '/customers', label: 'Clientes', icon: UserCircle },
];

export function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isSupervisor } = useAuth();

  const extraItems = [];
  if (isAdmin || isSupervisor) {
    extraItems.push(
      { path: '/inventory', label: 'Stock', icon: Wrench },
      { path: '/settings', label: 'Ajustes', icon: Settings }
    );
  }

  const allItems = [...mobileNavItems, ...extraItems];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-card px-2 pb-safe">
      <ul className="flex items-center justify-around">
        {allItems.slice(0, 6).map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <li key={item.path} className="flex-1">
              <button
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 w-full py-2 text-xs ${
                  active ? 'text-[#1e3a5f] font-medium' : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="scale-90">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
