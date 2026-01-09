import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  ProductWithRelations,
  Category,
  SiteSettings,
} from '@/lib/types';
import PublicHeader from '@/components/layout/public-header';
import PublicFooter from '@/components/layout/public-footer';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ProductCard = ({ product }: { product: ProductWithRelations }) => {
  const firstMedia = product.product_media?.[0];
  const placeholder = PlaceHolderImages.find(
    (p) => p.id === 'product-placeholder'
  ) || {
    imageUrl: 'https://picsum.photos/seed/1/600/800',
    imageHint: 'fashion product',
  };

  return (
    <Card className="overflow-hidden w-full group">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Link href={`/products/${product.slug}`}>
            <Image
              src={firstMedia?.url || placeholder.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={placeholder.imageHint}
            />
          </Link>
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_new && (
              <Badge variant="default" className="bg-primary/90">
                New
              </Badge>
            )}
            {product.on_sale && <Badge variant="destructive">Sale</Badge>}
            {product.featured && (
              <Badge
                variant="secondary"
                className="text-accent-foreground bg-accent/80"
              >
                Hot
              </Badge>
            )}
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-4">
          <h3 className="font-headline font-medium text-lg leading-tight truncate">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="text-primary font-semibold mt-1">
            TTD ${product.price_ttd.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    category?: string;
    on_sale?: string;
    is_new?: string;
    sort?: string;
  };
}) {
  const supabase = createClient();

  let settings: SiteSettings | null = null;
  let products: ProductWithRelations[] = [];
  let categories: Category[] = [];

  try {
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*')
      .single();
    settings = settingsData;

    let query = supabase
      .from('products')
      .select('*, categories(slug), product_media(*)');

    if (searchParams.category) {
      query = query.eq('categories.slug', searchParams.category);
    }
    if (searchParams.on_sale === 'true') {
      query = query.eq('on_sale', true);
    }
    if (searchParams.is_new === 'true') {
      query = query.eq('is_new', true);
    }
    
    if (searchParams.sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (searchParams.sort === 'price-asc') {
      query = query.order('price_ttd', { ascending: true });
    } else if (searchParams.sort === 'price-desc') {
      query = query.order('price_ttd', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data: productsData, error: productsError } = await query;
    if (productsError) throw productsError;
    products = productsData || [];

    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (categoriesError) throw categoriesError;
    categories = categoriesData || [];
  } catch (error) {
    console.error('Error fetching data for products page:', error);
  }

  const defaultSettings: SiteSettings = {
    id: 1,
    site_name: 'Exclusive Fashions Ltd',
    tagline: 'Your one-stop shop for trendy footwear, bags, and accessories.',
    location_1_name: 'High Street Branch',
    location_1_address: '116–118 High Street, San Fernando, Trinidad',
    location_1_gmaps_url: 'https://maps.google.com',
    location_2_name: 'Carlton Centre Branch',
    location_2_address: 'Carlton Centre, 61 St. James Street, San Fernando, Trinidad',
    location_2_gmaps_url: 'https://maps.google.com',
    phone_number: '1-868-123-4567',
    whatsapp_number: '18681234567',
    instagram_handle: 'exclusive_fashion_ltd_',
    opening_hours: 'Mon - Sat: 9am - 5pm',
    announcement_banner: null,
    payments_enabled: false,
  };

  const finalSettings = settings || defaultSettings;
  
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader settings={finalSettings} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-headline font-bold">
            Shop All Products
          </h1>
          <p className="text-muted-foreground mt-2">
            Browse our collection of the latest trends in fashion.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="md:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-xl font-headline font-semibold mb-4">
                Filters
              </h2>
              <Accordion type="multiple" defaultValue={['category', 'other']} className="w-full">
                <AccordionItem value="category">
                  <AccordionTrigger className="font-semibold">Category</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-2">
                      {categories.map((cat) => (
                         <Link key={cat.id} href={`/products?category=${cat.slug}`} className="text-sm text-muted-foreground hover:text-primary">{cat.name}</Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="other">
                  <AccordionTrigger className="font-semibold">Other</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                       <div className="flex items-center space-x-2">
                        <Checkbox id="on_sale" />
                        <Label htmlFor="on_sale">On Sale</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="is_new" />
                        <Label htmlFor="is_new">New Arrivals</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="md:col-span-3">
             <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-muted-foreground">{products.length} products</p>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>
             </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground">
                  No products found matching your criteria.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <PublicFooter settings={finalSettings} />
    </div>
  );
}
