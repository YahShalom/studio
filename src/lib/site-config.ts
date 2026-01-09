
import { AnnouncementConfig, HeroSliderConfig } from "./types";

export const announcementConfig: AnnouncementConfig = {
  rotateInterval: 6000,
  messages: [
    { text: "NEW DROP: The Latest Styles Just Landed", href: "/products?is_new=true" },
    { text: "SALE PICKS: Up to 40% Off Select Items", href: "/products?on_sale=true" },
    { text: "Reserve Your Size on WhatsApp & Collect In-Store", href: "/contact" },
  ],
};

export const heroSliderConfig: HeroSliderConfig = {
  rotateInterval: 5000,
  slides: [
    {
      title: "Step into Style",
      subtitle: "Discover statement heels that elevate any look, from brunch to night out.",
      categoryName: "Heels",
      imageUrl: "https://images.unsplash.com/photo-1590099033615-77535a093392?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxmYXNoaW9uJTIwaGVlbHN8ZW58MHx8fHwxNzE4MzA3NjMxfDA&ixlib=rb-4.0.3&q=80&w=1920",
      imageHint: "fashion heels",
      primaryCta: { label: "Shop Heels", href: "/products?category=heels" },
      secondaryCta: { label: "View All", href: "/products" },
    },
    {
      title: "Summer Essentials",
      subtitle: "Effortless style from beach to street with our latest collection of sandals.",
      categoryName: "Sandals",
      imageUrl: "https://images.unsplash.com/photo-1603487742131-4114194581aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxmYXNoaW9uJTIwc2FuZGFsc3xlbnwwfHx8fDE3MTgzMDc2NjV8MA&ixlib=rb-4.0.3&q=80&w=1920",
      imageHint: "fashion sandals",
      primaryCta: { label: "Shop Sandals", href: "/products?category=sandals" },
      secondaryCta: { label: "View All", href: "/products" },
    },
    {
      title: "The Perfect Carryall",
      subtitle: "Find your new favorite bag. Totes, crossbodies, and clutches for every occasion.",
      categoryName: "Bags",
      imageUrl: "https://images.unsplash.com/photo-1590779032545-9e658f330b6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxmYXNoaW9uJTIwYmFnc3xlbnwwfHx8fDE3MTgzMDc3MDh8MA&ixlib=rb-4.0.3&q=80&w=1920",
      imageHint: "fashion bags",
      primaryCta: { label: "Shop Bags", href: "/products?category=bags" },
      secondaryCta: { label: "View All", href: "/products" },
    },
    {
      title: "Fresh Kicks",
      subtitle: "Upgrade your sneaker game with the latest drops and timeless classics.",
      categoryName: "Sneakers",
      imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxmYXNoaW9uJTIwc25lYWtlcnN8ZW58MHx8fHwxNzE4MzA3NzM0fDA&ixlib=rb-4.0.3&q=80&w=1920",
      imageHint: "fashion sneakers",
      primaryCta: { label: "Shop Sneakers", href: "/products?category=sneakers" },
      secondaryCta: { label: "View All", href: "/products" },
    },
    {
      title: "Finishing Touches",
      subtitle: "Complete your look with our curated collection of must-have accessories.",
      categoryName: "Accessories",
      imageUrl: [
        "https://images.unsplash.com/photo-1619948544722-b131a7d7/photo.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxmYXNoaW9uJTIwYWNjZXNzb3JpZXN8ZW58MHx8fHwxNzE4MzA3NzYwfDA&ixlib=rb-4.0.3&q=80&w=1920",
        "https://images.unsplash.com/photo-1572804013427-4d714e28059i?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxzdW5nbGFzc2VzJTIwZGV0YWlsfGVufDB8fHx8MTc2Nzg1Njc1OXww&ixlib=rb-4.0.3&q=80&w=1920",
        "https://images.unsplash.com/photo-1606525442425-4b95c95a4358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxiZWF1dHklMjBwcm9kdWN0fGVufDB8fHx8MTc2Nzg1NzA0Nnww&ixlib=rb-4.0.3&q=80&w=1920"
      ],
      imageHint: "fashion accessories",
      primaryCta: { label: "Shop Accessories", href: "/products?category=accessories" },
      secondaryCta: { label: "View All", href: "/products" },
    }
  ]
};
