import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, FileText, Calendar, Mail, MessageCircle } from 'lucide-react';

export default function QuoteApprovalPage() {
  const { token } = useParams<{ token: string }>();
  const [approval, setApproval] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejection, setShowRejection] = useState(false);
  const [responded, setResponded] = useState(false);

  useEffect(() => {
    if (token) fetchApproval();
  }, [token]);

  async function fetchApproval() {
    setLoading(true);
    const { data: app } = await supabase
      .from('quote_approvals')
      .select('*, quotes(*, customers(name, email, phone, address))')
      .eq('token', token)
      .single();
    
    if (app) {
      setApproval(app);
      setQuote(app.quotes);
      setResponded(app.status !== 'pending');

      // Update viewed_at
      if (!app.viewed_at) {
        await supabase.from('quote_approvals').update({ viewed_at: new Date().toISOString() }).eq('id', app.id);
      }

      // Fetch company settings
      const { data: comp } = await supabase.from('company_settings').select('*').single();
      setCompany(comp);
    }
    setLoading(false);
  }

  async function handleApprove() {
    if (!approval || !quote) return;
    
    await supabase.from('quote_approvals').update({
      status: 'approved',
      responded_at: new Date().toISOString(),
    }).eq('id', approval.id);

    await supabase.from('quotes').update({
      status: 'approved',
      approved_at: new Date().toISOString(),
    }).eq('id', quote.id);

    toast.success('Presupuesto aprobado! Nos pondremos en contacto para agendar.');
    setResponded(true);
    fetchApproval();
  }

  async function handleReject() {
    if (!approval || !quote) return;
    
    await supabase.from('quote_approvals').update({
      status: 'rejected',
      responded_at: new Date().toISOString(),
    }).eq('id', approval.id);

    await supabase.from('quotes').update({
      status: 'rejected',
      rejection_reason: rejectionReason,
    }).eq('id', quote.id);

    toast.success('Respuesta registrada. Nos pondremos en contacto.');
    setShowRejection(false);
    setResponded(true);
    fetchApproval();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#1e3a5f] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!approval || !quote) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Presupuesto no encontrado</h1>
            <p className="text-muted-foreground">El enlace de aprobación es inválido o ha expirado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const customer = quote.customers;
  const lineItems = quote.line_items || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          {company?.logo_url ? (
            <img src={company.logo_url} alt={company.name} className="h-16 mx-auto mb-3" />
          ) : (
            <img src="/icons/icon-192x192.png" alt="ProFix" className="h-16 mx-auto mb-3" />
          )}
          <h1 className="text-2xl font-bold text-[#1e3a5f]">{company?.name || 'ProFix'}</h1>
          <p className="text-sm text-muted-foreground">Plomería & Electricidad Profesional</p>
        </div>

        {/* Quote Card */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Presupuesto #{quote.quote_number}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Para: {customer?.name}</p>
              </div>
              <Badge
                variant={
                  quote.status === 'approved' ? 'default' :
                  quote.status === 'rejected' ? 'destructive' :
                  quote.status === 'expired' ? 'secondary' :
                  'outline'
                }
                className={quote.status === 'approved' ? 'bg-green-500' : ''}
              >
                {quote.status === 'approved' ? 'Aprobado' :
                 quote.status === 'rejected' ? 'Rechazado' :
                 quote.status === 'expired' ? 'Expirado' :
                 'Pendiente'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Emitido: {quote.created_at?.slice(0, 10)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Vence: {quote.valid_until?.slice(0, 10) || 'N/A'}</span>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2">Descripción</th>
                    <th className="text-center p-2">Cant.</th>
                    <th className="text-right p-2">Precio</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item: any, i: number) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{item.item_name}</td>
                      <td className="text-center p-2">{item.qty}</td>
                      <td className="text-right p-2">${item.unit_price?.toFixed(2)}</td>
                      <td className="text-right p-2 font-medium">${item.total?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-1 text-right text-sm">
              <p>Subtotal: <span className="font-medium">${quote.subtotal?.toFixed(2)}</span></p>
              {quote.discount_amount > 0 && <p>Descuento: <span className="font-medium">-${quote.discount_amount?.toFixed(2)}</span></p>}
              <p>Tax: <span className="font-medium">${quote.tax_amount?.toFixed(2)}</span></p>
              <p className="text-lg font-bold text-[#1e3a5f]">Total: ${quote.total?.toFixed(2)}</p>
            </div>

            {quote.notes && (
              <div className="bg-muted p-3 rounded-lg text-sm">
                <p className="font-medium mb-1">Notas:</p>
                <p className="text-muted-foreground">{quote.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            {!responded && quote.status !== 'expired' && (
              <div className="space-y-3 pt-2">
                {!showRejection ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      className="bg-green-600 hover:bg-green-700 h-14 text-lg"
                      onClick={handleApprove}
                    >
                      <CheckCircle className="h-5 w-5 mr-2" /> Aprobar Presupuesto
                    </Button>
                    <Button
                      variant="outline"
                      className="h-14 text-lg border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => setShowRejection(true)}
                    >
                      <XCircle className="h-5 w-5 mr-2" /> Rechazar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      className="w-full p-3 border rounded-lg text-sm"
                      placeholder="Razón del rechazo (opcional)..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => setShowRejection(false)}>Cancelar</Button>
                      <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleReject}>Confirmar Rechazo</Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {responded && (
              <div className={`p-4 rounded-lg text-center ${
                approval.status === 'approved' ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
              }`}>
                {approval.status === 'approved' ? (
                  <>
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-green-800">Presupuesto aprobado!</p>
                    <p className="text-sm text-green-600">Nos pondremos en contacto para agendar el trabajo.</p>
                  </>
                ) : (
                  <>
                    <XCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="font-medium">Presupuesto rechazado</p>
                    <p className="text-sm text-muted-foreground">Gracias por tu respuesta. Nos pondremos en contacto.</p>
                  </>
                )}
              </div>
            )}

            {/* Contact Info */}
            <div className="border-t pt-4 text-center text-sm text-muted-foreground">
              <p className="font-medium text-[#1e3a5f]">¿Preguntas?</p>
              {company?.phone && (
                <p className="flex items-center justify-center gap-1 mt-1">
                  <MessageCircle className="h-3 w-3" /> {company.phone}
                </p>
              )}
              {company?.email && (
                <p className="flex items-center justify-center gap-1">
                  <Mail className="h-3 w-3" /> {company.email}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
