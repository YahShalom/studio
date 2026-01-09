
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { ProductWithRelations } from '@/lib/types';
import { MotionDiv } from '@/components/motion-div';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import React from 'react';

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const ProductCard = ({ product }: { product: ProductWithRelations }) => {
  const firstMedia = product.product_media?.[0];
  const placeholder = PlaceHolderImages.find(p => p.id === 'product-placeholder') || { imageUrl: 'https://picsum.photos/seed/1/600/800', imageHint: 'fashion product' };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [0, 400], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 300], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(150);
    mouseY.set(200);
  };

  return (
    <MotionDiv
      variants={variants}
      className="w-full"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <MotionDiv
        className="h-full"
        style={{ rotateX, rotateY }}
      >
        <Card className="overflow-hidden h-full w-full group transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Link href={`/products/${product.slug}`}>
                <Image
                  src={firstMedia?.url || placeholder.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={placeholder.imageHint}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  loading="lazy"
                />
              </Link>
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.is_new && <Badge variant="default" className='bg-primary/90'>New</Badge>}
                {product.on_sale && <Badge variant="destructive">Sale</Badge>}
                {product.featured && <Badge variant="secondary" className='text-accent-foreground bg-accent/80'>Hot</Badge>}
              </div>
              <Button variant="secondary" size="icon" className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
              <h3 className="font-headline font-medium text-lg leading-tight truncate">
                <Link href={`/products/${product.slug}`}>{product.name}</Link>
              </h3>
              <p className="text-primary font-semibold mt-1">TTD ${product.price_ttd.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>
    </MotionDiv>
  );
};
