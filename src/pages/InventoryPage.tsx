import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Search, AlertTriangle, Package, Wrench, Zap, Hammer, Minus, Plus as PlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CATEGORY_ICONS: Record<string, any> = {
  plumbing_parts: Wrench,
  electrical_parts: Zap,
  tools: Hammer,
  general: Package,
};

export default function InventoryPage() {
  const [parts, setParts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [showAdjust, setShowAdjust] = useState<any>(null);
  const [adjustQty, setAdjustQty] = useState(0);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<'plumbing_parts' | 'electrical_parts' | 'tools' | 'general'>('general');
  const [stock, setStock] = useState(0);
  const [minStock, setMinStock] = useState(5);
  const [cost, setCost] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    fetchParts();
  }, []);

  async function fetchParts() {
    const { data } = await supabase.from('inventory_parts').select('*').order('name');
    setParts(data || []);
  }

  async function createPart() {
    const { error } = await supabase.from('inventory_parts').insert({
      name, sku, category, quantity_stock: stock, quantity_minimum: minStock,
      price_cost: cost, price_sale: salePrice, barcode,
    });
    if (error) { toast.error('Error'); return; }
    toast.success('Parte creada');
    setShowCreate(false);
    setName(''); setSku(''); setCategory('general'); setStock(0); setMinStock(5); setCost(0); setSalePrice(0); setBarcode('');
    fetchParts();
  }

  async function adjustStock() {
    if (!showAdjust) return;
    const newQty = showAdjust.quantity_stock + adjustQty;
    if (newQty < 0) { toast.error('Stock no puede ser negativo'); return; }
    const { error } = await supabase.from('inventory_parts').update({ quantity_stock: newQty }).eq('id', showAdjust.id);
    if (error) { toast.error('Error'); return; }
    toast.success(`Stock ajustado a ${newQty}`);
    setShowAdjust(null);
    setAdjustQty(0);
    fetchParts();
  }

  const filtered = parts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStock = parts.filter((p) => p.quantity_stock <= p.quantity_minimum);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Inventario</h1>
        <Button onClick={() => setShowCreate(true)} className="bg-[#1e3a5f]">
          <Plus className="h-4 w-4 mr-2" /> Nueva Parte
        </Button>
      </div>

      {lowStock.length > 0 && (
        <Card className="border-orange-300 bg-orange-50">
          <CardContent className="p-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <p className="text-sm text-orange-800">
              <span className="font-bold">{lowStock.length}</span> items con stock bajo
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar parte..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="plumbing_parts">Plomería</SelectItem>
            <SelectItem value="electrical_parts">Electricidad</SelectItem>
            <SelectItem value="tools">Herramientas</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((part) => {
          const CatIcon = CATEGORY_ICONS[part.category] || Package;
          const isLow = part.quantity_stock <= part.quantity_minimum;
          return (
            <Card key={part.id} className={`hover:shadow-md transition-shadow ${isLow ? 'border-orange-300' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${isLow ? 'bg-orange-100' : 'bg-blue-100'}`}>
                      <CatIcon className={`h-4 w-4 ${isLow ? 'text-orange-600' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{part.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {part.sku || 'N/A'}</p>
                    </div>
                  </div>
                  <Badge variant={isLow ? 'destructive' : 'default'} className="text-[10px]">
                    {part.quantity_stock} / {part.quantity_minimum}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Costo: ${part.price_cost?.toFixed(2)}</span>
                  <span>Venta: ${part.price_sale?.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => { setShowAdjust(part); setAdjustQty(0); }}>
                    Ajustar Stock
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Nueva Parte</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
            <Select value={category} onValueChange={(v: any) => setCategory(v)}>
              <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="plumbing_parts">Plomería</SelectItem>
                <SelectItem value="electrical_parts">Electricidad</SelectItem>
                <SelectItem value="tools">Herramientas</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
              <Input type="number" placeholder="Stock mínimo" value={minStock} onChange={(e) => setMinStock(Number(e.target.value))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" placeholder="Precio costo" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
              <Input type="number" placeholder="Precio venta" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} />
            </div>
            <Input placeholder="Código de barras" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
            <Button className="w-full bg-[#1e3a5f]" onClick={createPart}>Crear Parte</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showAdjust} onOpenChange={() => setShowAdjust(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Ajustar Stock: {showAdjust?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm">Stock actual: <span className="font-bold">{showAdjust?.quantity_stock}</span></p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setAdjustQty((q) => q - 1)}><Minus className="h-4 w-4" /></Button>
              <Input type="number" value={adjustQty} onChange={(e) => setAdjustQty(Number(e.target.value))} className="text-center" />
              <Button variant="outline" size="icon" onClick={() => setAdjustQty((q) => q + 1)}><PlusIcon className="h-4 w-4" /></Button>
            </div>
            <p className="text-sm">Nuevo stock: <span className="font-bold">{(showAdjust?.quantity_stock || 0) + adjustQty}</span></p>
            <Button className="w-full bg-[#1e3a5f]" onClick={adjustStock}>Confirmar Ajuste</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
