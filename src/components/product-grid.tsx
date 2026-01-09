
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts } from '@/app/actions';
import type { ProductWithRelations } from '@/lib/types';
import { ProductCard } from './product-card';
import { Skeleton } from './ui/skeleton';
import { MotionDiv } from './motion-div';
import { AnimatePresence } from 'framer-motion';

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

export function ProductGrid() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<ProductWithRelations[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const observer = useRef<IntersectionObserver>();

    const category = searchParams.get('category') || undefined;
    const on_sale = searchParams.get('on_sale') || undefined;
    const is_new = searchParams.get('is_new') || undefined;
    const sort = searchParams.get('sort') || undefined;

    const resetAndLoadProducts = useCallback(async () => {
        setLoading(true);
        setPage(1);
        setProducts([]);
        setHasMore(true);
        const newProducts = await getProducts({ page: 1, category, on_sale, is_new, sort });
        setProducts(newProducts);
        setHasMore(newProducts.length > 0);
        setLoading(false);
    }, [category, on_sale, is_new, sort]);
    
    useEffect(() => {
        resetAndLoadProducts();
    }, [resetAndLoadProducts]);

    const loadMoreProducts = useCallback(async () => {
        if (loading || loadingMore || !hasMore) return;
        setLoadingMore(true);
        const nextPage = page + 1;
        const newProducts = await getProducts({ page: nextPage, category, on_sale, is_new, sort });
        setProducts((prev) => [...prev, ...newProducts]);
        setPage(nextPage);
        setHasMore(newProducts.length > 0);
        setLoadingMore(false);
    }, [page, hasMore, loading, loadingMore, category, on_sale, is_new, sort]);

    const lastProductElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreProducts();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, loadMoreProducts]);

    if (loading) {
        return <ProductGridSkeleton />;
    }

    return (
        <div>
            <AnimatePresence>
                <MotionDiv 
                    className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.05
                            }
                        }
                    }}
                >
                    {products.map((product, index) => {
                        const card = <ProductCard product={product} />;
                        if (products.length === index + 1) {
                            return (
                                <div ref={lastProductElementRef} key={product.id}>
                                    {card}
                                </div>
                            );
                        }
                        return <div key={product.id}>{card}</div>;
                    })}
                </MotionDiv>
            </AnimatePresence>
            {loadingMore && <ProductGridSkeleton />}
            {!hasMore && products.length > 0 && (
                <p className="col-span-full text-center text-muted-foreground mt-8">
                    You've reached the end of the collection.
                </p>
            )}
            {products.length === 0 && !loading && (
                <p className="col-span-full text-center text-muted-foreground">
                    No products found matching your criteria.
                </p>
            )}
        </div>
    );
}
