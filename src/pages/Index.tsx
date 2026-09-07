import { useState, useEffect } from 'react';
import { ShoppingCart, Lock, Package, Wrench, Search, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import AdminPanel from './AdminPanel';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('सभी');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['सभी']);
  const [loading, setLoading] = useState(true);

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
      
      if (data) {
        const uniqueCategories = ['सभी', ...new Set(data.map(p => p.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'सभी' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });



  if (isAdmin) {
    return <AdminPanel onLogout={() => setIsAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">निखिल हार्डवेयर</h1>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsAdmin(true)}
            className="gap-2"
          >
            <Lock className="w-4 h-4" />
            एडमिन
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-8 text-center mb-8">
          <Wrench className="w-12 h-12 mx-auto mb-4 text-primary-foreground" />
          <h2 className="text-3xl font-bold text-primary-foreground mb-2">गुणवत्ता हार्डवेयर & उपकरण</h2>
          <p className="text-primary-foreground/90">सभी निर्माण और मशीनरी आवश्यकताओं के लिए आपका विश्वसनीय भागीदार</p>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4 mb-8">
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
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
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">कोई उत्पाद नहीं मिला</p>
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
