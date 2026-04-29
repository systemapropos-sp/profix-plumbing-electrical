import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Plus, Search, Phone, Mail, MapPin, Wrench, Zap, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ROLE_ICONS: Record<string, any> = {
  plumber: Wrench,
  electrician: Zap,
  supervisor: Shield,
  admin: Shield,
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'plumber' | 'electrician' | 'supervisor' | 'admin'>('plumber');
  const [license, setLicense] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['plumber', 'electrician', 'supervisor', 'admin'])
      .order('full_name');
    setEmployees(data || []);
    setLoading(false);
  }

  async function createEmployee() {
    const { error } = await supabase.from('profiles').insert({
      email,
      full_name: fullName,
      phone,
      role,
      license_number: license,
      status: 'active',
      gps_tracking_enabled: false,
    });
    if (error) {
      toast.error('Error al crear empleado');
      return;
    }
    toast.success('Empleado creado');
    setShowCreate(false);
    setFullName(''); setEmail(''); setPhone(''); setRole('plumber'); setLicense('');
    fetchEmployees();
  }

  const filtered = employees.filter((e) =>
    e.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    e.email?.toLowerCase().includes(search.toLowerCase()) ||
    e.phone?.includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Empleados</h1>
        <Button onClick={() => setShowCreate(true)} className="bg-[#1e3a5f]">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Empleado
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar empleado..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((emp) => {
          const RoleIcon = ROLE_ICONS[emp.role] || Wrench;
          return (
            <Card key={emp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={emp.avatar_url || ''} />
                    <AvatarFallback className="bg-[#1e3a5f] text-white">{emp.full_name?.charAt(0) || 'E'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{emp.full_name || 'Sin nombre'}</p>
                      <Badge variant={emp.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">
                        {emp.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize flex items-center gap-1 mt-0.5">
                      <RoleIcon className="h-3 w-3" /> {emp.role}
                    </p>
                    {emp.phone && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3" /> {emp.phone}
                      </p>
                    )}
                    {emp.whatsapp_number && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {emp.whatsapp_number}
                      </p>
                    )}
                    {emp.current_location_lat && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> GPS activo
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <p className="text-center text-muted-foreground py-8">No hay empleados</p>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Nuevo Empleado</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Select value={role} onValueChange={(v: any) => setRole(v)}>
              <SelectTrigger><SelectValue placeholder="Rol" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="plumber">Plomero</SelectItem>
                <SelectItem value="electrician">Electricista</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Número de licencia" value={license} onChange={(e) => setLicense(e.target.value)} />
            <Button className="w-full bg-[#1e3a5f]" onClick={createEmployee}>Crear Empleado</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
