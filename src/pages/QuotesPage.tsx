import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Eye,
  Send,
  Trash2,
  FileText,
  Mail,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  X,
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  draft: { label: 'Borrador', color: 'bg-gray-500', icon: FileText },
  sent: { label: 'Enviado', color: 'bg-blue-500', icon: Send },
  pending_approval: { label: 'Pendiente', color: 'bg-orange-500', icon: Clock },
  approved: { label: 'Aprobado', color: 'bg-green-500', icon: CheckCircle },
  rejected: { label: 'Rechazado', color: 'bg-red-500', icon: XCircle },
  expired: { label: 'Expirado', color: 'bg-gray-400', icon: Clock },
};

interface QuoteLineItem {
  item_name: string;
  qty: number;
  unit_price: number;
  total: number;
}

export default function QuotesPage() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [showPreview, setShowPreview] = useState<any>(null);

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [serviceType, setServiceType] = useState<'plumbing' | 'electrical' | 'both'>('plumbing');
  const [description, setDescription] = useState('');
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([{ item_name: '', qty: 1, unit_price: 0, total: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [validDays, setValidDays] = useState(7);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchQuotes();
    fetchCustomers();
  }, []);

  async function fetchQuotes() {
    setLoading(true);
    const { data } = await supabase
      .from('quotes')
      .select('*, customers(name, email, phone, whatsapp_number)')
      .order('created_at', { ascending: false });
    setQuotes(data || []);
    setLoading(false);
  }

  async function fetchCustomers() {
    const { data } = await supabase.from('customers').select('*').order('name');
    setCustomers(data || []);
  }

  function updateLineItem(index: number, field: keyof QuoteLineItem, value: any) {
    const items = [...lineItems];
    items[index] = { ...items[index], [field]: value };
    if (field === 'qty' || field === 'unit_price') {
      items[index].total = items[index].qty * items[index].unit_price;
    }
    setLineItems(items);
  }

  function addLineItem() {
    setLineItems([...lineItems, { item_name: '', qty: 1, unit_price: 0, total: 0 }]);
  }

  function removeLineItem(index: number) {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = subtotal * (discount / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (taxRate / 100);
  const total = taxableAmount + taxAmount;

  async function saveQuote(asDraft = false, sendMethod?: 'email' | 'whatsapp' | 'both') {
    if (!selectedCustomer) {
      toast.error('Selecciona un cliente');
      return;
    }

    const quoteNumber = `Q-${Date.now().toString().slice(-6)}`;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validDays);

    const quoteData = {
      quote_number: quoteNumber,
      customer_id: selectedCustomer,
      employee_id: user?.id,
      status: asDraft ? 'draft' : 'sent',
      service_type: serviceType,
      description,
      line_items: lineItems.filter((i) => i.item_name.trim()),
      subtotal,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      total,
      valid_until: validUntil.toISOString(),
      notes,
      sent_via: sendMethod || null,
    };

    const { data, error } = await supabase.from('quotes').insert(quoteData).select().single();
    if (error) {
      toast.error('Error al guardar presupuesto');
      console.error(error);
      return;
    }

    if (!asDraft) {
      const token = crypto.randomUUID();
      await supabase.from('quote_approvals').insert({
        quote_id: data.id,
        token,
        customer_email: customers.find((c) => c.id === selectedCustomer)?.email,
        customer_whatsapp: customers.find((c) => c.id === selectedCustomer)?.whatsapp_number,
        status: 'pending',
      });

      if (sendMethod === 'whatsapp' || sendMethod === 'both') {
        toast.success(`WhatsApp simulado enviado al cliente`);
      }
      if (sendMethod === 'email' || sendMethod === 'both') {
        toast.success(`Email simulado enviado al cliente`);
      }
    }

    toast.success(asDraft ? 'Presupuesto guardado como borrador' : 'Presupuesto enviado');
    setShowCreate(false);
    resetForm();
    fetchQuotes();
  }

  function resetForm() {
    setSelectedCustomer('');
    setServiceType('plumbing');
    setDescription('');
    setLineItems([{ item_name: '', qty: 1, unit_price: 0, total: 0 }]);
    setDiscount(0);
    setTaxRate(0);
    setValidDays(7);
    setNotes('');
  }

  async function deleteQuote(id: string) {
    if (!confirm('¿Eliminar este presupuesto?')) return;
    await supabase.from('quotes').delete().eq('id', id);
    toast.success('Presupuesto eliminado');
    fetchQuotes();
  }

  async function convertToJob(quote: any) {
    const { data: job, error } = await supabase.from('jobs').insert({
      title: `Trabajo de ${quote.service_type}`,
      description: quote.description,
      customer_id: quote.customer_id,
      employee_id: quote.employee_id,
      quote_id: quote.id,
      status: 'pending',
      priority: 'medium',
      service_type: quote.service_type,
      total_cost: quote.total,
      payment_status: 'unpaid',
    }).select().single();

    if (error) {
      toast.error('Error al convertir a trabajo');
      return;
    }

    await supabase.from('quotes').update({ converted_to_job_id: job.id, status: 'approved' }).eq('id', quote.id);
    toast.success('Convertido a trabajo exitosamente');
    fetchQuotes();
  }

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.quote_number.toLowerCase().includes(search.toLowerCase()) ||
      q.customers?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Presupuestos</h1>
        <Button onClick={() => setShowCreate(true)} className="bg-[#1e3a5f]">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Presupuesto
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="draft">Borrador</SelectItem>
            <SelectItem value="sent">Enviado</SelectItem>
            <SelectItem value="pending_approval">Pendiente</SelectItem>
            <SelectItem value="approved">Aprobado</SelectItem>
            <SelectItem value="rejected">Rechazado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Vence</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">Cargando...</TableCell>
                  </TableRow>
                ) : filteredQuotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No hay presupuestos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuotes.map((quote) => {
                    const status = STATUS_CONFIG[quote.status] || STATUS_CONFIG.draft;
                    const StatusIcon = status.icon;
                    return (
                      <TableRow key={quote.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setShowPreview(quote)}>
                        <TableCell className="font-medium">{quote.quote_number}</TableCell>
                        <TableCell>{quote.customers?.name || 'N/A'}</TableCell>
                        <TableCell className="capitalize">{quote.service_type}</TableCell>
                        <TableCell>${quote.total?.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={`${status.color} text-white`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{quote.valid_until ? quote.valid_until.slice(0, 10) : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setShowPreview(quote); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {quote.status === 'approved' && !quote.converted_to_job_id && (
                              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); convertToJob(quote); }}>
                                <ArrowRight className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); deleteQuote(quote.id); }}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo Presupuesto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo de Servicio</Label>
                <Select value={serviceType} onValueChange={(v: any) => setServiceType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plomería</SelectItem>
                    <SelectItem value="electrical">Electricidad</SelectItem>
                    <SelectItem value="both">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción del Problema</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe el problema..." />
            </div>

            <div className="space-y-2">
              <Label>Items</Label>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="w-24">Cant.</TableHead>
                      <TableHead className="w-28">Precio Unit.</TableHead>
                      <TableHead className="w-28">Total</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input value={item.item_name} onChange={(e) => updateLineItem(index, 'item_name', e.target.value)} placeholder="Item..." />
                        </TableCell>
                        <TableCell>
                          <Input type="number" min={1} value={item.qty} onChange={(e) => updateLineItem(index, 'qty', Number(e.target.value))} />
                        </TableCell>
                        <TableCell>
                          <Input type="number" min={0} step="0.01" value={item.unit_price} onChange={(e) => updateLineItem(index, 'unit_price', Number(e.target.value))} />
                        </TableCell>
                        <TableCell className="font-medium">${item.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeLineItem(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button variant="outline" onClick={addLineItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Agregar Item
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Descuento (%)</Label>
                <Input type="number" min={0} max={100} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Tax (%)</Label>
                <Input type="number" min={0} value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Válido por (días)</Label>
                <Input type="number" min={1} value={validDays} onChange={(e) => setValidDays(Number(e.target.value))} />
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-1 text-right">
              <p className="text-sm">Subtotal: <span className="font-medium">${subtotal.toFixed(2)}</span></p>
              <p className="text-sm">Descuento: <span className="font-medium">-${discountAmount.toFixed(2)}</span></p>
              <p className="text-sm">Tax: <span className="font-medium">${taxAmount.toFixed(2)}</span></p>
              <p className="text-lg font-bold text-[#1e3a5f]">Total: ${total.toFixed(2)}</p>
            </div>

            <div className="space-y-2">
              <Label>Notas</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas internas..." />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="outline" onClick={() => saveQuote(true)}>Guardar Borrador</Button>
              <Button variant="outline" onClick={() => saveQuote(false, 'email')}>
                <Mail className="h-4 w-4 mr-2" /> Enviar Email
              </Button>
              <Button variant="outline" onClick={() => saveQuote(false, 'whatsapp')}>
                <MessageCircle className="h-4 w-4 mr-2" /> Enviar WhatsApp
              </Button>
              <Button className="bg-[#1e3a5f]" onClick={() => saveQuote(false, 'both')}>
                <Send className="h-4 w-4 mr-2" /> Enviar Ambos
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showPreview} onOpenChange={() => setShowPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Presupuesto {showPreview?.quote_number}</DialogTitle>
          </DialogHeader>
          {showPreview && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{showPreview.customers?.name}</p>
                </div>
                <Badge className={`${STATUS_CONFIG[showPreview.status]?.color} text-white`}>
                  {STATUS_CONFIG[showPreview.status]?.label}
                </Badge>
              </div>
              <div className="border rounded-lg p-4 space-y-2">
                <p className="font-medium">Items:</p>
                {(showPreview.line_items || []).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.qty}x {item.item_name}</span>
                    <span>${item.total?.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 space-y-1 text-right">
                  <p className="text-sm">Subtotal: ${showPreview.subtotal?.toFixed(2)}</p>
                  <p className="text-sm">Tax: ${showPreview.tax_amount?.toFixed(2)}</p>
                  <p className="text-lg font-bold">Total: ${showPreview.total?.toFixed(2)}</p>
                </div>
              </div>
              {showPreview.status === 'approved' && !showPreview.converted_to_job_id && (
                <Button className="w-full bg-green-600" onClick={() => { convertToJob(showPreview); setShowPreview(null); }}>
                  <ArrowRight className="h-4 w-4 mr-2" /> Convertir a Trabajo
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
