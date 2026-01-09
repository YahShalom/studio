
'use server';

import { createClient } from '@/lib/supabase/server';
import { ProductWithRelations } from '@/lib/types';

const PRODUCTS_PER_PAGE = 12;

export async function getProducts({
    page = 1,
    category,
    on_sale,
    is_new,
    sort,
}: {
    page?: number,
    category?: string,
    on_sale?: string,
    is_new?: string,
    sort?: string,
}): Promise<ProductWithRelations[]> {

    const supabase = createClient();
    try {
        let query = supabase
            .from('products')
            .select('*, categories(slug), product_media(*)', { count: 'exact' });

        if (category) {
            query = query.eq('categories.slug', category);
        }
        if (on_sale === 'true') {
            query = query.eq('on_sale', true);
        }
        if (is_new === 'true') {
            query = query.eq('is_new', true);
        }

        if (sort === 'newest') {
            query = query.order('created_at', { ascending: false });
        } else if (sort === 'price-asc') {
            query = query.order('price_ttd', { ascending: true });
        } else if (sort === 'price-desc') {
            query = query.order('price_ttd', { ascending: false });
        } else {
            query = query.order('created_at', { ascending: false });
        }
        
        const from = (page - 1) * PRODUCTS_PER_PAGE;
        const to = from + PRODUCTS_PER_PAGE - 1;

        query = query.range(from, to);

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching products:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return [];
    }
}
