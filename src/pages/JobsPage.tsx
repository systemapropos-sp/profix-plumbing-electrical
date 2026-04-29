import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Search } from 'lucide-react';

const COLUMNS = [
  { key: 'pending', label: 'Pendiente', color: 'bg-amber-500' },
  { key: 'scheduled', label: 'Agendado', color: 'bg-blue-500' },
  { key: 'in_progress', label: 'En Progreso', color: 'bg-purple-500' },
  { key: 'completed', label: 'Completado', color: 'bg-green-500' },
  { key: 'cancelled', label: 'Cancelado', color: 'bg-red-500' },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState<any>(null);

  const [title, setTitle] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [serviceType, setServiceType] = useState<'plumbing' | 'electrical' | 'both'>('plumbing');
  const [address, setAddress] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchJobs();
    fetchCustomers();
    fetchEmployees();
  }, []);

  async function fetchJobs() {
    const { data } = await supabase
      .from('jobs')
      .select('*, customers(name), profiles(full_name)')
      .order('created_at', { ascending: false });
    setJobs(data || []);
  }

  async function fetchCustomers() {
    const { data } = await supabase.from('customers').select('*').order('name');
    setCustomers(data || []);
  }

  async function fetchEmployees() {
    const { data } = await supabase.from('profiles').select('*').in('role', ['plumber', 'electrician', 'supervisor']).eq('status', 'active');
    setEmployees(data || []);
  }

  async function createJob() {
    const { error } = await supabase.from('jobs').insert({
      title,
      customer_id: customerId,
      employee_id: employeeId || null,
      priority,
      service_type: serviceType,
      address,
      scheduled_date: scheduledDate || null,
      notes,
      status: scheduledDate ? 'scheduled' : 'pending',
      total_cost: 0,
      payment_status: 'unpaid',
    });
    if (error) {
      toast.error('Error al crear trabajo');
      return;
    }
    toast.success('Trabajo creado');
    setShowCreate(false);
    resetForm();
    fetchJobs();
  }

  async function updateStatus(job: any, newStatus: string) {
    const updates: any = { status: newStatus };
    if (newStatus === 'in_progress') updates.actual_start = new Date().toISOString();
    if (newStatus === 'completed') updates.actual_end = new Date().toISOString();
    
    const { error } = await supabase.from('jobs').update(updates).eq('id', job.id);
    if (error) {
      toast.error('Error al actualizar estado');
      return;
    }
    toast.success(`Estado actualizado a ${newStatus}`);
    fetchJobs();
    if (showDetail?.id === job.id) setShowDetail({ ...job, ...updates });
  }

  function resetForm() {
    setTitle('');
    setCustomerId('');
    setEmployeeId('');
    setPriority('medium');
    setServiceType('plumbing');
    setAddress('');
    setScheduledDate('');
    setNotes('');
  }

  const filteredJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.customers?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Trabajos</h1>
        <Button onClick={() => setShowCreate(true)} className="bg-[#1e3a5f]">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Trabajo
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar trabajo..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {COLUMNS.map((col) => {
          const colJobs = filteredJobs.filter((j) => j.status === col.key);
          return (
            <div key={col.key} className="bg-muted/50 rounded-lg p-3 min-h-[200px]">
              <div className={`${col.color} text-white text-xs font-medium px-2 py-1 rounded mb-2 flex items-center justify-between`}>
                <span>{col.label}</span>
                <Badge variant="secondary" className="text-xs">{colJobs.length}</Badge>
              </div>
              <div className="space-y-2">
                {colJobs.map((job) => (
                  <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowDetail(job)}>
                    <CardContent className="p-3 space-y-1">
                      <p className="text-sm font-medium truncate">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.customers?.name || 'Sin cliente'}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px] capitalize">{job.priority}</Badge>
                        <span className="text-xs text-muted-foreground">{job.profiles?.full_name?.split(' ')[0] || 'N/A'}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Nuevo Trabajo</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del trabajo" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cliente</label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Técnico</label>
                <Select value={employeeId} onValueChange={setEmployeeId}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin asignar</SelectItem>
                    {employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prioridad</label>
                <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Servicio</label>
                <Select value={serviceType} onValueChange={(v: any) => setServiceType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plomería</SelectItem>
                    <SelectItem value="electrical">Electricidad</SelectItem>
                    <SelectItem value="both">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dirección</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Dirección del trabajo" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Agendada</label>
              <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notas</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas..." />
            </div>
            <Button className="w-full bg-[#1e3a5f]" onClick={createJob}>Crear Trabajo</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showDetail} onOpenChange={() => setShowDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{showDetail?.title}</DialogTitle></DialogHeader>
          {showDetail && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <Badge className={`${COLUMNS.find(c => c.key === showDetail.status)?.color} text-white capitalize`}>
                  {showDetail.status}
                </Badge>
                <Badge variant="outline" className="capitalize">{showDetail.priority}</Badge>
              </div>
              <p className="text-sm"><span className="font-medium">Cliente:</span> {showDetail.customers?.name}</p>
              <p className="text-sm"><span className="font-medium">Técnico:</span> {showDetail.profiles?.full_name || 'Sin asignar'}</p>
              <p className="text-sm"><span className="font-medium">Dirección:</span> {showDetail.address || 'N/A'}</p>
              <p className="text-sm"><span className="font-medium">Servicio:</span> {showDetail.service_type}</p>
              <p className="text-sm"><span className="font-medium">Fecha:</span> {showDetail.scheduled_date || 'No agendado'}</p>
              {showDetail.description && <p className="text-sm"><span className="font-medium">Descripción:</span> {showDetail.description}</p>}
              
              <div className="flex flex-wrap gap-2 pt-2">
                {showDetail.status === 'pending' && (
                  <Button size="sm" onClick={() => updateStatus(showDetail, 'scheduled')}>Agendar</Button>
                )}
                {showDetail.status === 'scheduled' && (
                  <Button size="sm" className="bg-purple-600" onClick={() => updateStatus(showDetail, 'in_progress')}>Iniciar</Button>
                )}
                {showDetail.status === 'in_progress' && (
                  <Button size="sm" className="bg-green-600" onClick={() => updateStatus(showDetail, 'completed')}>Completar</Button>
                )}
                <Button size="sm" variant="outline" className="text-red-500" onClick={() => updateStatus(showDetail, 'cancelled')}>Cancelar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
