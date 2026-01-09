import Link from 'next/link';
import { Instagram, Facebook, Phone } from 'lucide-react';
import { Logo } from '@/components/icons';
import { SiteSettings } from '@/lib/types';
import { Button } from '../ui/button';

const footerNav = {
  shop: [
    { name: 'New Arrivals', href: '/products?sort=newest' },
    { name: 'Heels', href: '/products?category=heels' },
    { name: 'Sandals', href: '/products?category=sandals' },
    { name: 'Bags', href: '/products?category=bags' },
  ],
  company: [
    { name: 'About Us', href: '/#why-us' },
    { name: 'Contact', href: '/contact' },
    { name: 'Store Locations', href: '/#store-info' },
  ],
};

export default function PublicFooter({ settings }: { settings: SiteSettings }) {
  const instagramUrl = `https://instagram.com/${settings.instagram_handle}`;

  return (
    <footer className="bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo className="h-8 w-8 text-primary" />
              <span className="font-headline font-bold text-xl">{settings.site_name}</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">{settings.tagline}</p>
            <div className="flex gap-4 mt-6">
              <Button asChild variant="ghost" size="icon">
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <a href="#" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon">
                 <a href={`tel:${settings.phone_number}`} aria-label="Call us">
                  <Phone className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-headline font-semibold text-foreground">Shop</h3>
              <ul className="mt-4 space-y-2">
                {footerNav.shop.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-semibold text-foreground">Company</h3>
              <ul className="mt-4 space-y-2">
                {footerNav.company.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-semibold text-foreground">Visit Us</h3>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>{settings.location_1_address}</p>
                <p>{settings.location_2_address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {settings.site_name}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
