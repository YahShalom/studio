
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import {
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  Instagram,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  ProductWithRelations,
  SiteSettings,
} from '@/lib/types';
import { createClient } from '@/lib/supabase/server';
import PublicHeader from '@/components/layout/public-header';
import { Skeleton } from '@/components/ui/skeleton';
import { MotionDiv } from '@/components/motion-div';
import { ProductCard } from '@/components/product-card';

const PublicFooter = dynamic(() => import('@/components/layout/public-footer'));

const categoryChips = [
  { name: 'Heels', href: '/products?category=heels' },
  { name: 'Sandals', href: '/products?category=sandals' },
  { name: 'Sneakers', href: '/products?category=sneakers' },
  { name: 'Bags', href: '/products?category=bags' },
  { name: 'Accessories', href: '/products?category=accessories' },
  { name: 'New Arrivals', href: '/products?is_new=true' },
  { name: 'Sale', href: '/products?on_sale=true' },
];

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const HeroSection = ({ settings }: { settings: SiteSettings }) => {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image') || { imageUrl: 'https://picsum.photos/seed/hero/1200/800', imageHint: 'fashion model' };

  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full text-white flex items-center">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <Image
        src={heroImage.imageUrl}
        alt="Fashion model"
        fill
        className="object-cover"
        priority
        data-ai-hint={heroImage.imageHint}
      />
      <MotionDiv
        className="relative z-20 container mx-auto px-4 text-center"
        initial="hidden"
        animate="visible"
        variants={variants}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold font-headline text-shadow-lg">
          {settings.site_name}
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-shadow">
          {settings.tagline}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="font-bold">
            <Link href="/#trending">
              Shop New Arrivals
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="font-bold">
            <a href={`https://wa.me/${settings.whatsapp_number}`} target="_blank" rel="noopener noreferrer">Message Us</a>
          </Button>
        </div>
      </MotionDiv>
    </section>
  );
};

const CategoryChipsSection = () => (
  <section className="py-8 bg-background">
    <MotionDiv 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={variants}
    >
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {categoryChips.map((cat) => (
          <Button key={cat.name} asChild variant="outline" className="rounded-full">
            <Link href={cat.href}>{cat.name}</Link>
          </Button>
        ))}
      </div>
    </MotionDiv>
  </section>
);

const TrendingSection = async () => {
  const supabase = createClient();
  let trendingProducts: ProductWithRelations[] = [];
  try {
    const { data: productsData, error } = await supabase
      .from('products')
      .select('*, product_media(*)')
      .eq('featured', true)
      .limit(8);
      
    if (error) throw error;
    trendingProducts = productsData || [];
  } catch (error) {
    console.error('Error fetching trending products:', error);
  }

  return (
    <section id="trending" className="py-16 bg-card">
      <MotionDiv 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <h2 className="text-3xl font-bold text-center font-headline mb-8">
          Trending Now
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" className='font-semibold'>
            <Link href="/products">
              Shop All Products <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </MotionDiv>
    </section>
  );
};

const SocialProofSection = ({ settings }: { settings: SiteSettings }) => {
  let socialImages = PlaceHolderImages.filter(p => p.id.startsWith('social-'));
  
  return (
    <section className="py-16 bg-card">
      <MotionDiv 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={variants}
      >
        <h2 className="text-3xl font-bold text-center font-headline mb-2">Follow us on Instagram</h2>
        <p className="text-center text-primary text-lg mb-8 font-semibold">
          <a href={`https://instagram.com/${settings.instagram_handle}`} target="_blank" rel="noopener noreferrer">
            @{settings.instagram_handle}
          </a>
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
          {socialImages.slice(0, 5).map((img, index) => (
            <div key={index} className="aspect-square relative overflow-hidden rounded-lg group">
                <Image
                src={img.imageUrl}
                alt={`Instagram post ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                data-ai-hint={img.imageHint}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="text-white w-8 h-8"/>
              </div>
            </div>
          ))}
        </div>
      </MotionDiv>
    </section>
  );
};


const StoreInfoSection = ({ settings }: { settings: SiteSettings }) => {
  return (
    <section className="py-16 bg-background">
      <MotionDiv 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={variants}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-headline text-2xl font-semibold mb-4">Our Locations</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">{settings.location_1_name}</h4>
                  <p className="text-muted-foreground flex items-start gap-2 mt-1">
                    <MapPin className="h-4 w-4 mt-1 shrink-0" /> {settings.location_1_address}
                  </p>
                  <a href={settings.location_1_gmaps_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">View on Map</a>
                </div>
                <Separator/>
                <div>
                  <h4 className="font-semibold">{settings.location_2_name}</h4>
                  <p className="text-muted-foreground flex items-start gap-2 mt-1">
                    <MapPin className="h-4 w-4 mt-1 shrink-0" /> {settings.location_2_address}
                  </p>
                  <a href={settings.location_2_gmaps_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">View on Map</a>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-headline text-2xl font-semibold mb-4">Contact & Hours</h3>
                <div className="space-y-3 text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> {settings.phone_number}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> {settings.opening_hours}
                </p>
                <p className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" /> @{settings.instagram_handle}
                </p>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button asChild className="w-full font-semibold">
                  <a href={`https://wa.me/${settings.whatsapp_number}`} target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
                </Button>
                <Button asChild variant="outline" className="w-full font-semibold">
                  <Link href="/contact">Send a Message</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MotionDiv>
    </section>
  );
};


const HeroSkeleton = () => (
  <Skeleton className="h-[60vh] md:h-[70vh] w-full" />
);
const ChipsSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex flex-wrap justify-center gap-3">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-24 rounded-full" />
      ))}
    </div>
  </div>
);
const TrendingSkeleton = () => (
   <div className="container mx-auto px-4 py-16">
      <Skeleton className="h-8 w-64 mx-auto mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[3/4]" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        ))}
      </div>
   </div>
);


export default async function Home() {
  const supabase = createClient();
  let settings: SiteSettings | null = null;

  try {
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*')
      .single();
    settings = settingsData;
    
  } catch (error) {
    console.error('Error fetching data for landing page:', error);
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
      <main className="flex-grow">
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSection settings={finalSettings} />
        </Suspense>

        <Suspense fallback={<ChipsSkeleton />}>
          <CategoryChipsSection />
        </Suspense>

        <Suspense fallback={<TrendingSkeleton />}>
          <TrendingSection />
        </Suspense>
        
        <Suspense>
            <SocialProofSection settings={finalSettings} />
        </Suspense>
        
        <Suspense>
            <StoreInfoSection settings={finalSettings} />
        </Suspense>

      </main>
      <Suspense>
        <PublicFooter settings={finalSettings} />
      </Suspense>
    </div>
  );
}
