import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, Building, MessageCircle, PenLine } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  const { isAdmin } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);

  // Company form
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [taxRate, setTaxRate] = useState(0);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [autoQuote, setAutoQuote] = useState(false);
  const [autoReminder, setAutoReminder] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data: comp } = await supabase.from('company_settings').select('*').single();
    const { data: temps } = await supabase.from('whatsapp_templates').select('*').order('name');
    const { data: stgs } = await supabase.from('pipeline_stages').select('*').order('order');
    setCompany(comp);
    setTemplates(temps || []);
    setStages(stgs || []);
    if (comp) {
      setName(comp.name || '');
      setAddress(comp.address || '');
      setPhone(comp.phone || '');
      setEmail(comp.email || '');
      setTaxRate(comp.tax_rate || 0);
      setWhatsappNumber(comp.whatsapp_business_number || '');
      setAutoQuote(comp.auto_send_quote_whatsapp || false);
      setAutoReminder(comp.auto_send_reminder_whatsapp || false);
    }
  }

  async function saveCompany() {
    const data = {
      name, address, phone, email, tax_rate: taxRate,
      whatsapp_business_number: whatsappNumber,
      auto_send_quote_whatsapp: autoQuote,
      auto_send_reminder_whatsapp: autoReminder,
    };
    if (company) {
      await supabase.from('company_settings').update(data).eq('id', company.id);
    } else {
      await supabase.from('company_settings').insert(data);
    }
    toast.success('Configuración guardada');
    fetchSettings();
  }

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold text-red-500">Acceso restringido</h1>
        <p className="text-muted-foreground">Solo administradores pueden acceder a configuración.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <h1 className="text-2xl font-bold text-[#1e3a5f]">Configuración</h1>

      <Tabs defaultValue="company">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company"><Building className="h-4 w-4 mr-2" /> Empresa</TabsTrigger>
          <TabsTrigger value="whatsapp"><MessageCircle className="h-4 w-4 mr-2" /> WhatsApp</TabsTrigger>
          <TabsTrigger value="pipeline"><PenLine className="h-4 w-4 mr-2" /> Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Información de la Empresa</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Dirección</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
                </div>
              </div>
              <Button onClick={saveCompany} className="bg-[#1e3a5f]"><Save className="h-4 w-4 mr-2" /> Guardar</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">WhatsApp Business</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Número WhatsApp Business</Label>
                <Input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="+1234567890" />
              </div>
              <div className="flex items-center justify-between">
                <Label>Auto-enviar presupuestos</Label>
                <Switch checked={autoQuote} onCheckedChange={setAutoQuote} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Auto-enviar recordatorios</Label>
                <Switch checked={autoReminder} onCheckedChange={setAutoReminder} />
              </div>
              <Button onClick={saveCompany} className="bg-[#1e3a5f]"><Save className="h-4 w-4 mr-2" /> Guardar</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Plantillas de Mensajes</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {templates.map((t) => (
                <div key={t.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{t.name}</p>
                    <Badge variant={t.is_active ? 'default' : 'secondary'}>{t.is_active ? 'Activo' : 'Inactivo'}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.template_body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Etapas del Pipeline</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {stages.map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: s.color }} />
                  <p className="font-medium text-sm">{s.name}</p>
                  <Badge variant="outline" className="text-[10px]">Orden: {s.order}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
