import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Plus, DollarSign, TrendingUp, TrendingDown, Receipt, CreditCard, Banknote } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function FinancesPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showExpense, setShowExpense] = useState(false);

  const [jobId, setJobId] = useState('');
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState<'cash' | 'card' | 'check' | 'online'>('cash');
  const [reference, setReference] = useState('');

  const [expCategory, setExpCategory] = useState('materials');
  const [expAmount, setExpAmount] = useState(0);
  const [expDescription, setExpDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: p } = await supabase.from('payments').select('*, jobs(title)').order('date', { ascending: false });
    const { data: e } = await supabase.from('expenses').select('*').order('date', { ascending: false });
    const { data: j } = await supabase.from('jobs').select('id, title, total_cost, payment_status').eq('payment_status', 'unpaid');
    setPayments(p || []);
    setExpenses(e || []);
    setJobs(j || []);
  }

  async function createPayment() {
    const { error } = await supabase.from('payments').insert({
      job_id: jobId, amount, method, date: new Date().toISOString(), reference_number: reference, status: 'completed',
    });
    if (error) { toast.error('Error'); return; }
    await supabase.from('jobs').update({ payment_status: 'paid' }).eq('id', jobId);
    toast.success('Pago registrado');
    setShowPayment(false);
    setJobId(''); setAmount(0); setMethod('cash'); setReference('');
    fetchData();
  }

  async function createExpense() {
    const { error } = await supabase.from('expenses').insert({
      category: expCategory, amount: expAmount, date: new Date().toISOString(), description: expDescription,
    });
    if (error) { toast.error('Error'); return; }
    toast.success('Gasto registrado');
    setShowExpense(false);
    setExpCategory('materials'); setExpAmount(0); setExpDescription('');
    fetchData();
  }

  const totalIncome = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const profit = totalIncome - totalExpenses;

  const chartData = [
    { name: 'Ingresos', value: totalIncome },
    { name: 'Gastos', value: totalExpenses },
    { name: 'Ganancia', value: Math.max(0, profit) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Finanzas</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowExpense(true)}><TrendingDown className="h-4 w-4 mr-2" /> Gasto</Button>
          <Button onClick={() => setShowPayment(true)} className="bg-[#1e3a5f]"><Plus className="h-4 w-4 mr-2" /> Pago</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos</p>
                <p className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gastos</p>
                <p className="text-2xl font-bold text-red-500">${totalExpenses.toLocaleString()}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ganancia</p>
                <p className={`text-2xl font-bold ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>${profit.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Resumen Financiero</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1e3a5f" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Pagos Recientes</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {payments.slice(0, 10).map((p) => (
            <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                {p.method === 'cash' && <Banknote className="h-4 w-4 text-green-500" />}
                {p.method === 'card' && <CreditCard className="h-4 w-4 text-blue-500" />}
                {p.method === 'check' && <Receipt className="h-4 w-4 text-orange-500" />}
                {p.method === 'online' && <DollarSign className="h-4 w-4 text-purple-500" />}
                <div>
                  <p className="text-sm font-medium">{p.jobs?.title || 'Trabajo'}</p>
                  <p className="text-xs text-muted-foreground">{p.date?.slice(0, 10)} — {p.method}</p>
                </div>
              </div>
              <p className="font-bold text-green-600">${p.amount?.toFixed(2)}</p>
            </div>
          ))}
          {payments.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Sin pagos registrados</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Gastos Recientes</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {expenses.slice(0, 10).map((e) => (
            <div key={e.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium capitalize">{e.category}</p>
                <p className="text-xs text-muted-foreground">{e.date?.slice(0, 10)} — {e.description || 'Sin descripción'}</p>
              </div>
              <p className="font-bold text-red-500">-${e.amount?.toFixed(2)}</p>
            </div>
          ))}
          {expenses.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Sin gastos registrados</p>}
        </CardContent>
      </Card>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Registrar Pago</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Select value={jobId} onValueChange={setJobId}>
              <SelectTrigger><SelectValue placeholder="Seleccionar trabajo" /></SelectTrigger>
              <SelectContent>
                {jobs.map((j) => <SelectItem key={j.id} value={j.id}>{j.title} — ${j.total_cost}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Monto" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            <Select value={method} onValueChange={(v: any) => setMethod(v)}>
              <SelectTrigger><SelectValue placeholder="Método" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Efectivo</SelectItem>
                <SelectItem value="card">Tarjeta</SelectItem>
                <SelectItem value="check">Cheque</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Referencia" value={reference} onChange={(e) => setReference(e.target.value)} />
            <Button className="w-full bg-[#1e3a5f]" onClick={createPayment}>Registrar Pago</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showExpense} onOpenChange={setShowExpense}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Registrar Gasto</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Select value={expCategory} onValueChange={setExpCategory}>
              <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fuel">Combustible</SelectItem>
                <SelectItem value="tools">Herramientas</SelectItem>
                <SelectItem value="materials">Materiales</SelectItem>
                <SelectItem value="office">Oficina</SelectItem>
                <SelectItem value="salary">Salarios</SelectItem>
                <SelectItem value="other">Otros</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Monto" value={expAmount} onChange={(e) => setExpAmount(Number(e.target.value))} />
            <Input placeholder="Descripción" value={expDescription} onChange={(e) => setExpDescription(e.target.value)} />
            <Button className="w-full bg-[#1e3a5f]" onClick={createExpense}>Registrar Gasto</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
