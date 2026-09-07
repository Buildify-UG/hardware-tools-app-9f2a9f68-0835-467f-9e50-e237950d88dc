import { useState } from 'react';
import { ShoppingCart, Lock, LogOut, LogIn, Package, Wrench, Settings, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Sample data
const PRODUCTS = [
  { id: 1, name: 'हथौड़ा 2kg', category: 'हाथ के उपकरण', price: 450, stock: 25, image: '🔨' },
  { id: 2, name: 'स्क्रूड्राइवर सेट', category: 'हाथ के उपकरण', price: 320, stock: 40, image: '🔧' },
  { id: 3, name: 'ड्रिल मशीन', category: 'विद्युत उपकरण', price: 3500, stock: 8, image: '⚙️' },
  { id: 4, name: 'कोण लोहा 2x2 inch', category: 'हार्डवेयर', price: 85, stock: 150, image: '📦' },
  { id: 5, name: 'बोल्ट & नट असॉर्टेड', category: 'हार्डवेयर', price: 180, stock: 200, image: '🔩' },
  { id: 6, name: 'पेंच (विभिन्न आकार)', category: 'हार्डवेयर', price: 120, stock: 300, image: '📌' },
  { id: 7, name: 'चेन 10mm', category: 'मशीनरी', price: 650, stock: 12, image: '⛓️' },
  { id: 8, name: 'बेयरिंग SKF', category: 'मशीनरी', price: 1200, stock: 5, image: '⭕' },
];

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('सभी');
  const [products, setProducts] = useState(PRODUCTS);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newStock, setNewStock] = useState('');

  const categories = ['सभी', ...new Set(PRODUCTS.map(p => p.category))];
  
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'सभी' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStockUpdate = () => {
    if (editingProduct && newStock) {
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...p, stock: parseInt(newStock) } : p
      ));
      setEditingProduct(null);
      setNewStock('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">निखिल हार्डवेयर</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {isAdmin ? (
              <>
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4" /> एडमिन मोड
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAdmin(false)}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  लॉगआउट
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAdmin(true)}
                className="gap-2"
              >
                <Lock className="w-4 h-4" />
                एडमिन
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isAdmin ? (
          // Admin View
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">स्टॉक प्रबंधन</h2>
            </div>

            <div className="grid gap-4">
              {products.map(product => (
                <Card key={product.id} className="border border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-4xl">{product.image}</div>
                        <div>
                          <h3 className="font-semibold text-foreground">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                          <p className="text-sm font-medium text-foreground mt-1">₹{product.price}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{product.stock}</p>
                          <p className="text-xs text-muted-foreground">स्टॉक में</p>
                        </div>

                        <Dialog open={editingProduct?.id === product.id} onOpenChange={(open) => {
                          if (!open) setEditingProduct(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm"
                              onClick={() => {
                                setEditingProduct(product);
                                setNewStock(product.stock.toString());
                              }}
                            >
                              अपडेट करें
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{product.name}</DialogTitle>
                              <DialogDescription>
                                नया स्टॉक मान दर्ज करें
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Input
                                type="number"
                                value={newStock}
                                onChange={(e) => setNewStock(e.target.value)}
                                placeholder="स्टॉक संख्या"
                                className="border-border"
                              />
                              <Button 
                                onClick={handleStockUpdate}
                                className="w-full"
                              >
                                सहेजें
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Customer View
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-8 text-center">
              <Wrench className="w-12 h-12 mx-auto mb-4 text-primary-foreground" />
              <h2 className="text-3xl font-bold text-primary-foreground mb-2">गुणवत्ता हार्डवेयर & उपकरण</h2>
              <p className="text-primary-foreground/90">सभी निर्माण और मशीनरी आवश्यकताओं के लिए आपका विश्वसनीय भागीदार</p>
            </div>

            {/* Search and Filter */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="उत्पाद खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="border border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="text-6xl mb-4 text-center">{product.image}</div>
                    <CardTitle className="text-foreground">{product.name}</CardTitle>
                    <CardDescription>{product.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        product.stock > 10 
                          ? 'bg-green-100 text-green-800' 
                          : product.stock > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? `${product.stock} स्टॉक में` : 'स्टॉक खत्म'}
                      </span>
                    </div>
                    
                    <Button 
                      className="w-full gap-2"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      कार्ट में जोड़ें
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">कोई उत्पाद नहीं मिला</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          <p>© 2024 निखिल हार्डवेयर और टूल्स मशीनरी। सर्वाधिकार सुरक्षित।</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
