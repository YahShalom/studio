
'use client';

import React from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ProductWithRelations, SiteSettings } from '@/lib/types';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export function QuickViewModal({ product, children }: { product: ProductWithRelations, children: React.ReactNode }) {
    const [settings, setSettings] = React.useState<SiteSettings | null>(null);

    React.useEffect(() => {
        const fetchSettings = async () => {
            const supabase = createClient();
            const { data } = await supabase.from('site_settings').select('*').single();
            if (data) {
                setSettings(data);
            }
        };
        fetchSettings();
    }, []);
    
    const placeholder = PlaceHolderImages.find(p => p.id === 'product-placeholder') || { imageUrl: 'https://picsum.photos/seed/1/600/800', imageHint: 'fashion product' };
    const media = product.product_media && product.product_media.length > 0 ? product.product_media : [{ id: 'placeholder', url: placeholder.imageUrl, type: 'image' as const }];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl p-0">
        <div className="grid md:grid-cols-2">
            {/* Image Carousel */}
            <div className="p-6">
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
                            loading="lazy"
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
            <div className="flex flex-col space-y-6 p-6 border-l">
                <DialogHeader>
                    {product.categories && (
                        <p className="text-sm text-muted-foreground">{product.categories.name}</p>
                    )}
                    <DialogTitle className="text-2xl lg:text-3xl font-headline font-bold">{product.name}</DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-2">
                    {product.is_new && <Badge variant="default" className='bg-primary/90'>New</Badge>}
                    {product.on_sale && <Badge variant="destructive">Sale</Badge>}
                </div>
                
                <p className="text-3xl font-bold text-primary">
                    TTD ${product.price_ttd.toFixed(2)}
                </p>

                {product.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
                )}

                <div className="space-y-2">
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="flex items-center gap-3 text-sm">
                        <span className="font-semibold w-16">Sizes:</span>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map(size => (
                            <Badge key={size} variant="outline" className="px-2 py-0.5">{size}</Badge>
                            ))}
                        </div>
                        </div>
                    )}
                     {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center gap-3 text-sm">
                        <span className="font-semibold w-16">Colors:</span>
                        <div className="flex flex-wrap gap-2">
                            {product.colors.map(color => (
                            <Badge key={color} variant="outline" className="px-2 py-0.5">{color}</Badge>
                            ))}
                        </div>
                        </div>
                    )}
                </div>
                
                <div className="flex flex-col gap-3 pt-4 border-t">
                    <Button asChild size="lg" className="w-full font-semibold" disabled={!settings}>
                        <a href={settings ? `https://wa.me/${settings.whatsapp_number}?text=Hi! I'm interested in the ${product.name}.` : '#'} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="mr-2 h-5 w-5" /> Message on WhatsApp
                        </a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="w-full font-semibold">
                        <Link href={`/products/${product.slug}`}>View Full Details</Link>
                    </Button>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
