import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showCreate, setShowCreate] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const [customerId, setCustomerId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState(60);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  useEffect(() => {
    fetchAppointments();
    fetchCustomers();
    fetchEmployees();
  }, [currentWeek]);

  async function fetchAppointments() {
    const start = weekStart.toISOString().split('T')[0];
    const end = weekEnd.toISOString().split('T')[0];
    const { data } = await supabase
      .from('appointments')
      .select('*, customers(name), profiles(full_name)')
      .gte('date', start)
      .lte('date', end)
      .order('time', { ascending: true });
    setAppointments(data || []);
  }

  async function fetchCustomers() {
    const { data } = await supabase.from('customers').select('*').order('name');
    setCustomers(data || []);
  }

  async function fetchEmployees() {
    const { data } = await supabase.from('profiles').select('*').in('role', ['plumber', 'electrician', 'supervisor']).eq('status', 'active');
    setEmployees(data || []);
  }

  async function createAppointment() {
    const { error } = await supabase.from('appointments').insert({
      customer_id: customerId,
      employee_id: employeeId || null,
      date: selectedDate,
      time,
      duration,
      status: 'booked',
      reminder_sent: false,
    });
    if (error) {
      toast.error('Error al crear cita');
      return;
    }
    toast.success('Cita creada');
    setShowCreate(false);
    fetchAppointments();
  }

  function getAppointmentsForDay(date: Date) {
    return appointments.filter((a) => isSameDay(new Date(a.date), date));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Citas</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[180px] text-center">
            {format(weekStart, 'd MMM', { locale: es })} - {format(weekEnd, 'd MMM yyyy', { locale: es })}
          </span>
          <Button variant="outline" size="icon" onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isToday = isSameDay(day, new Date());
          return (
            <div key={day.toISOString()} className={`border rounded-lg p-2 min-h-[120px] ${isToday ? 'border-[#1e3a5f] bg-blue-50' : 'bg-card'}`}>
              <div className="text-center mb-2">
                <p className="text-xs text-muted-foreground capitalize">{format(day, 'EEE', { locale: es })}</p>
                <p className={`text-lg font-bold ${isToday ? 'text-[#1e3a5f]' : ''}`}>{format(day, 'd')}</p>
              </div>
              <div className="space-y-1">
                {dayAppointments.map((a) => (
                  <div key={a.id} className="text-xs p-1.5 rounded bg-[#1e3a5f] text-white cursor-pointer hover:opacity-90">
                    <p className="font-medium">{a.time} - {a.customers?.name?.split(' ')[0]}</p>
                    <p className="opacity-80">{a.profiles?.full_name?.split(' ')[0] || 'N/A'}</p>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-6 text-[10px] text-muted-foreground hover:text-[#1e3a5f]"
                  onClick={() => { setSelectedDate(day.toISOString().split('T')[0]); setShowCreate(true); }}
                >
                  <Plus className="h-3 w-3 mr-1" /> Agregar
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Próximas Citas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {appointments.slice(0, 10).map((a) => (
            <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="bg-[#1e3a5f] text-white p-2 rounded-lg text-center min-w-[50px]">
                  <p className="text-xs">{format(new Date(a.date), 'MMM', { locale: es })}</p>
                  <p className="text-lg font-bold">{format(new Date(a.date), 'd')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{a.customers?.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {a.time} ({a.duration}min) — {a.profiles?.full_name || 'Sin asignar'}
                  </p>
                </div>
              </div>
              <Badge variant={a.status === 'booked' ? 'default' : 'secondary'} className="capitalize">
                {a.status}
              </Badge>
            </div>
          ))}
          {appointments.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No hay citas esta semana</p>}
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Nueva Cita</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Fecha: {selectedDate}</p>
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hora</label>
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duración (min)</label>
                <Input type="number" min={15} step={15} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
              </div>
            </div>
            <Button className="w-full bg-[#1e3a5f]" onClick={createAppointment}>Crear Cita</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
