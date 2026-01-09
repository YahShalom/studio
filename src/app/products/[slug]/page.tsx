
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import PublicHeader from '@/components/layout/public-header';
import PublicFooter from '@/components/layout/public-footer';
import { SiteSettings, ProductWithRelations } from '@/lib/types';
import { Tag, Truck, MessageCircle, Instagram } from 'lucide-react';
import Link from 'next/link';

async function getProduct(slug: string): Promise<ProductWithRelations | null> {
  const supabase = createClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('*, categories(name, slug), product_media(*)')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  return product;
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: settingsData } = await supabase.from('site_settings').select('*').single();
  const settings: SiteSettings = settingsData || ({} as SiteSettings);

  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const placeholder = PlaceHolderImages.find(p => p.id === 'product-placeholder') || { imageUrl: 'https://picsum.photos/seed/1/600/800', imageHint: 'fashion product' };
  const media = product.product_media && product.product_media.length > 0 ? product.product_media : [{ id: 'placeholder', url: placeholder.imageUrl, type: 'image' as const }];

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader settings={settings} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Carousel */}
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {media.map((item, index) => (
                  <CarouselItem key={item.id}>
                    <div className="aspect-[3/4] relative rounded-lg overflow-hidden border">
                      <Image
                        src={item.url}
                        alt={`${product.name} - image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index === 0}
                        data-ai-hint={placeholder.imageHint}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
            </Carousel>
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-6">
            <div>
              {product.categories && (
                <Link href={`/products?category=${product.categories.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{product.categories.name}</Link>
              )}
              <h1 className="text-3xl lg:text-4xl font-headline font-bold mt-1">{product.name}</h1>
              <div className="flex items-center gap-2 mt-3">
                {product.is_new && <Badge variant="default" className='bg-primary/90'>New Arrival</Badge>}
                {product.on_sale && <Badge variant="destructive">On Sale</Badge>}
                {product.featured && <Badge variant="secondary" className='text-accent-foreground bg-accent/80'>Hot</Badge>}
              </div>
            </div>

            <p className="text-3xl font-bold text-primary">
              TTD ${product.price_ttd.toFixed(2)}
            </p>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            <div className="space-y-4">
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="font-semibold w-20">Sizes:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <Badge key={size} variant="outline" className="px-3 py-1">{size}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {product.colors && product.colors.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="font-semibold w-20">Colors:</span>
                   <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <Badge key={color} variant="outline" className="px-3 py-1">{color}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-headline text-xl font-semibold">How to Order</h3>
              <p className="text-muted-foreground text-sm">We make it easy! Order directly through WhatsApp or Instagram for a personalized shopping experience.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="w-full font-semibold">
                  <a href={`https://wa.me/${settings.whatsapp_number}?text=Hi! I'm interested in the ${product.name} (slug: ${product.slug}).`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" /> Message on WhatsApp
                  </a>
                </Button>
                <Button asChild size="lg" variant="secondary" className="w-full font-semibold">
                  <a href={`https://instagram.com/${settings.instagram_handle}`} target="_blank" rel="noopener noreferrer">
                    <Instagram className="mr-2 h-5 w-5" /> DM on Instagram
                  </a>
                </Button>
              </div>
            </div>

            <Separator />

             <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary"/>
                    <span>Authentic & Trendy Styles</span>
                </div>
                <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary"/>
                    <span>Island-wide Delivery</span>
                </div>
             </div>
          </div>
        </div>
      </main>
      <PublicFooter settings={settings} />
    </div>
  );
}
