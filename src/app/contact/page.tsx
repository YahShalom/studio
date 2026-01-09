
import { createClient } from '@/lib/supabase/server';
import { SiteSettings } from '@/lib/types';
import PublicHeader from '@/components/layout/public-header';
import PublicFooter from '@/components/layout/public-footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default async function ContactPage() {
  const supabase = createClient();
  let settings: SiteSettings | null = null;
  
  try {
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*')
      .single();
    settings = settingsData;
  } catch (error) {
    console.error('Error fetching settings for contact page:', error);
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
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto space-y-12">
        
          {/* About Section */}
          <section>
            <h1 className="text-3xl md:text-4xl font-headline font-bold mb-4 text-center">About Exclusive Fashions</h1>
            <div className="max-w-3xl mx-auto text-muted-foreground text-center space-y-6">
                <p className="text-lg">
                    Sleek. Modern. Mobile-First. We're Exclusive Fashions, your go-to destination for the latest trends, right here in San Fernando. Our mission is to keep you stylish without breaking the bank.
                </p>
                <p>
                    From statement heels and casual sandals to the perfect sneakers, bags, and accessories, we've got everything you need to complete your look. Our collections are curated for the fashion-forward youth who want authentic, trendy styles.
                </p>
                <ul className="inline-flex flex-col items-center sm:items-start gap-2 text-left">
                    <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-primary"/>
                        <span>Two convenient locations in San Fernando.</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-primary"/>
                        <span>Easy ordering via WhatsApp and Instagram DMs.</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-primary"/>
                        <span>New arrivals dropping weekly to keep your style fresh.</span>
                    </li>
                </ul>
            </div>
          </section>

          {/* Contact Form */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-headline">Get In Touch</CardTitle>
              <CardDescription>
                Have a question or a special request? Fill out the form below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input id="name" placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact" className="text-sm font-medium">Email or Phone</label>
                    <Input id="contact" placeholder="you@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea id="message" placeholder="Your message..." rows={5} />
                </div>
                <div className="text-right">
                  <Button type="submit">Send Message</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <PublicFooter settings={finalSettings} />
    </div>
  );
}
