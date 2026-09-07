import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, LogOut, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

const EMOJIS = ['🔨', '🔧', '⚙️', '📦', '🔩', '📌', '⛓️', '⭕', '🪛', '🪚', '🔗', '⚡'];
const CATEGORIES = ['हाथ के उपकरण', 'विद्युत उपकरण', 'हार्डवेयर', 'मशीनरी'];

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: '🔨',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast({ title: 'त्रुटि', description: 'उत्पाद लोड नहीं हो सके', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', category: '', price: '', stock: '', image: '🔨' });
    setEditingProduct(null);
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.category || !formData.price || formData.stock === '') {
      toast({ title: 'त्रुटि', description: 'सभी फील्ड भरें', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase.from('products').insert([{
        name: formData.name,
        category: formData.category,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
        image: formData.image,
      }]);

      if (error) throw error;
      toast({ title: 'सफल', description: 'उत्पाद जोड़ा गया' });
      setIsAddOpen(false);
      resetForm();
      loadProducts();
    } catch (error) {
      toast({ title: 'त्रुटि', description: 'उत्पाद जोड़ने में विफल', variant: 'destructive' });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !formData.name || !formData.category || !formData.price || formData.stock === '') {
      toast({ title: 'त्रुटि', description: 'सभी फील्ड भरें', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          category: formData.category,
          price: parseInt(formData.price),
          stock: parseInt(formData.stock),
          image: formData.image,
        })
        .eq('id', editingProduct.id);

      if (error) throw error;
      toast({ title: 'सफल', description: 'उत्पाद अपडेट किया गया' });
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (error) {
      toast({ title: 'त्रुटि', description: 'अपडेट में विफल', variant: 'destructive' });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('क्या आप इस उत्पाद को हटाना चाहते हैं?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'सफल', description: 'उत्पाद हटाया गया' });
      loadProducts();
    } catch (error) {
      toast({ title: 'त्रुटि', description: 'हटाने में विफल', variant: 'destructive' });
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">📊 एडमिन पैनल</h1>
          <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            लॉगआउट
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Add Product Button */}
        <div className="mb-8">
          <Dialog open={isAddOpen && !editingProduct} onOpenChange={(open) => {
            setIsAddOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                नया उत्पाद जोड़ें
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>नया उत्पाद जोड़ें</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="उत्पाद का नाम"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-border"
                />
                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="श्रेणी चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="कीमत (₹)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="border-border"
                />
                <Input
                  type="number"
                  placeholder="स्टॉक"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="border-border"
                />
                <Select value={formData.image} onValueChange={(val) => setFormData({ ...formData, image: val })}>
                  <SelectTrigger className="border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMOJIS.map(emoji => (
                      <SelectItem key={emoji} value={emoji}>{emoji}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddProduct} className="w-full">
                  जोड़ें
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map(product => (
              <Card key={product.id} className="border border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-4xl">{product.image}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <div className="flex gap-4 mt-2">
                          <span className="text-sm font-medium text-primary">₹{product.price}</span>
                          <span className="text-sm text-muted-foreground">स्टॉक: {product.stock}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Dialog open={editingProduct?.id === product.id} onOpenChange={(open) => {
                        if (!open) {
                          setEditingProduct(null);
                          resetForm();
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(product)}
                            className="gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            एडिट
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>उत्पाद एडिट करें</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input
                              placeholder="उत्पाद का नाम"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="border-border"
                            />
                            <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                              <SelectTrigger className="border-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CATEGORIES.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              placeholder="कीमत (₹)"
                              value={formData.price}
                              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                              className="border-border"
                            />
                            <Input
                              type="number"
                              placeholder="स्टॉक"
                              value={formData.stock}
                              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                              className="border-border"
                            />
                            <Select value={formData.image} onValueChange={(val) => setFormData({ ...formData, image: val })}>
                              <SelectTrigger className="border-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {EMOJIS.map(emoji => (
                                  <SelectItem key={emoji} value={emoji}>{emoji}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button onClick={handleUpdateProduct} className="w-full">
                              सहेजें
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        हटाएं
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">कोई उत्पाद नहीं। नया जोड़ें!</p>
          </div>
        )}
      </main>
    </div>
  );
}
