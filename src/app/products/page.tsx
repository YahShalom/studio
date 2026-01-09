
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type {
  Category,
  SiteSettings,
} from '@/lib/types';
import PublicHeader from '@/components/layout/public-header';
import PublicFooter from '@/components/layout/public-footer';
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
import { Skeleton } from '@/components/ui/skeleton';
import { ProductGrid } from '@/components/product-grid';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal } from 'lucide-react';

function Filters({
  categories,
  className,
  onFilterChange,
}: {
  categories: Category[];
  className?: string;
  onFilterChange?: () => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleCategoryChange = (slug: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const currentCategory = newParams.get('category');
    if (currentCategory === slug) {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    newParams.delete('page');
    router.push(`/products?${newParams.toString()}`);
    onFilterChange?.();
  };

  const handleCheckboxChange = (name: 'on_sale' | 'is_new') => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (newParams.get(name) === 'true') {
      newParams.delete(name);
    } else {
      newParams.set(name, 'true');
    }
    newParams.delete('page');
    router.push(`/products?${newParams.toString()}`);
    onFilterChange?.();
  };

  return (
      <div className={className}>
        <h2 className="text-xl font-headline font-semibold mb-4">Filters</h2>
        <Accordion
          type="multiple"
          defaultValue={['category', 'other']}
          className="w-full"
        >
          <AccordionItem value="category">
            <AccordionTrigger className="font-semibold">
              Category
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${cat.slug}`}
                      checked={searchParams.get('category') === cat.slug}
                      onCheckedChange={() => handleCategoryChange(cat.slug)}
                    />
                    <Label
                      htmlFor={`cat-${cat.slug}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {cat.name}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="other">
            <AccordionTrigger className="font-semibold">Other</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="on_sale"
                    checked={searchParams.get('on_sale') === 'true'}
                    onCheckedChange={() => handleCheckboxChange('on_sale')}
                  />
                  <Label htmlFor="on_sale" className="cursor-pointer">On Sale</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_new"
                    checked={searchParams.get('is_new') === 'true'}
                    onCheckedChange={() => handleCheckboxChange('is_new')}
                  />
                  <Label htmlFor="is_new" className="cursor-pointer">New Arrivals</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  );
}

const FilterSkeleton = () => (
    <div className="w-full">
        <Skeleton className="h-8 w-24 mb-4" />
        <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
    </div>
)

const ProductGridSkeleton = () => (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
            <Skeleton className="aspect-[3/4]" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
        </div>
      ))}
    </div>
  );

function SortSelect() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleSortChange = (value: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('sort', value);
        newParams.delete('page');
        router.push(`/products?${newParams.toString()}`);
    };

    return (
        <Select onValueChange={handleSortChange} defaultValue={searchParams.get('sort') || 'newest'}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
    );
}

export default function ProductsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      try {
        const { data: settingsData } = await supabase
          .from('site_settings')
          .select('*')
          .single();
        setSettings(settingsData);

        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true });
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching initial data for products page:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          <aside className="md:col-span-1 hidden md:block">
            {loading ? <FilterSkeleton /> : <Suspense fallback={<FilterSkeleton />}><Filters categories={categories} /></Suspense>}
          </aside>

          <div className="md:col-span-3">
             <div className="hidden md:flex justify-end items-center mb-6">
                <Suspense fallback={<Skeleton className="h-10 w-[180px]" />}>
                    <SortSelect />
                </Suspense>
             </div>
             <Suspense fallback={<ProductGridSkeleton />}>
                <ProductGrid />
             </Suspense>
          </div>
        </div>
      </main>

       {/* Mobile Sticky Filter Bar */}
       <div className="md:hidden sticky bottom-0 left-0 right-0 z-30 bg-background/90 backdrop-blur-sm border-t p-2">
          <div className="container mx-auto flex justify-between items-center gap-2">
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <div className="p-4">
                  {loading ? <FilterSkeleton /> : <Suspense fallback={<FilterSkeleton />}><Filters categories={categories} onFilterChange={() => setIsFilterSheetOpen(false)} /></Suspense>}
                </div>
              </SheetContent>
            </Sheet>
             <Suspense fallback={<Skeleton className="h-10 w-[160px]" />}>
                <SortSelect />
            </Suspense>
          </div>
        </div>

      <PublicFooter settings={finalSettings} />
    </div>
  );
}
