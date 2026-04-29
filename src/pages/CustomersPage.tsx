import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Search, Phone, Mail, MapPin, Home, Building, FileText, Briefcase } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState<any>(null);
  const [customerQuotes, setCustomerQuotes] = useState<any[]>([]);
  const [customerJobs, setCustomerJobs] = useState<any[]>([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<'residential' | 'commercial'>('residential');
  const [notes, setNotes] = useState('');
  const [source, setSource] = useState('walk-in');

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    const { data } = await supabase.from('customers').select('*').order('name');
    setCustomers(data || []);
  }

  async function createCustomer() {
    const { error } = await supabase.from('customers').insert({
      name, email, phone, whatsapp_number: whatsapp, address, type, notes, source,
    });
    if (error) {
      toast.error('Error al crear cliente');
      return;
    }
    toast.success('Cliente creado');
    setShowCreate(false);
    setName(''); setEmail(''); setPhone(''); setWhatsapp(''); setAddress(''); setType('residential'); setNotes('');
    fetchCustomers();
  }

  async function viewCustomerDetail(customer: any) {
    setShowDetail(customer);
    const { data: quotes } = await supabase.from('quotes').select('*').eq('customer_id', customer.id).order('created_at', { ascending: false });
    const { data: jobs } = await supabase.from('jobs').select('*').eq('customer_id', customer.id).order('created_at', { ascending: false });
    setCustomerQuotes(quotes || []);
    setCustomerJobs(jobs || []);
  }

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Clientes</h1>
        <Button onClick={() => setShowCreate(true)} className="bg-[#1e3a5f]">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Cliente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar cliente..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((customer) => (
          <Card key={customer.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => viewCustomerDetail(customer)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{customer.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    {customer.type === 'residential' ? <Home className="h-3 w-3" /> : <Building className="h-3 w-3" />}
                    {customer.type === 'residential' ? 'Residencial' : 'Comercial'}
                  </p>
                  {customer.phone && <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> {customer.phone}</p>}
                  {customer.email && <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" /> {customer.email}</p>}
                  {customer.address && <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {customer.address}</p>}
                </div>
                <Badge variant="outline" className="text-[10px] capitalize">{customer.source}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!showDetail} onOpenChange={() => setShowDetail(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{showDetail?.name}</DialogTitle></DialogHeader>
          {showDetail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="font-medium">Email:</span> {showDetail.email || 'N/A'}</p>
                <p><span className="font-medium">Teléfono:</span> {showDetail.phone || 'N/A'}</p>
                <p><span className="font-medium">WhatsApp:</span> {showDetail.whatsapp_number || 'N/A'}</p>
                <p><span className="font-medium">Dirección:</span> {showDetail.address || 'N/A'}</p>
                <p><span className="font-medium">Tipo:</span> {showDetail.type}</p>
                <p><span className="font-medium">Fuente:</span> {showDetail.source}</p>
              </div>
              {showDetail.notes && <p className="text-sm bg-muted p-2 rounded">{showDetail.notes}</p>}

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2"><FileText className="h-4 w-4" /> Presupuestos ({customerQuotes.length})</h4>
                <div className="space-y-1">
                  {customerQuotes.slice(0, 5).map((q) => (
                    <div key={q.id} className="flex justify-between text-xs p-2 bg-muted/50 rounded">
                      <span>#{q.quote_number} — {q.status}</span>
                      <span className="font-medium">${q.total?.toFixed(2)}</span>
                    </div>
                  ))}
                  {customerQuotes.length === 0 && <p className="text-xs text-muted-foreground">Sin presupuestos</p>}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2"><Briefcase className="h-4 w-4" /> Trabajos ({customerJobs.length})</h4>
                <div className="space-y-1">
                  {customerJobs.slice(0, 5).map((j) => (
                    <div key={j.id} className="flex justify-between text-xs p-2 bg-muted/50 rounded">
                      <span>{j.title} — {j.status}</span>
                      <span className="font-medium">${j.total_cost?.toFixed(2)}</span>
                    </div>
                  ))}
                  {customerJobs.length === 0 && <p className="text-xs text-muted-foreground">Sin trabajos</p>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Nuevo Cliente</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input placeholder="WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
            </div>
            <Input placeholder="Dirección" value={address} onChange={(e) => setAddress(e.target.value)} />
            <Select value={type} onValueChange={(v: any) => setType(v)}>
              <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residencial</SelectItem>
                <SelectItem value="commercial">Comercial</SelectItem>
              </SelectContent>
            </Select>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger><SelectValue placeholder="Fuente" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="walk-in">Walk-in</SelectItem>
                <SelectItem value="referral">Referido</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="website">Website</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full bg-[#1e3a5f]" onClick={createCustomer}>Crear Cliente</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
