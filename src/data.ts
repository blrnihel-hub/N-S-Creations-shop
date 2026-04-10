import { Product } from './types';

export const products: Product[] = [
  {
    id: '7',
    name: 'Abaya Dentelle 2 Peaces',
    description: 'Elegant two-piece abaya set with delicate lace (dentelle) detailing. High-quality fabric designed for comfort and grace.',
    price: 2500,
    image: '/src/assets/abaya-main.jpg',
    category: 'Prayer Set',
    colors: ['Black', 'Pink', 'Maroon', 'Blue', 'Beige', 'Grey'],
    colorImages: {
      'Black': ['/src/assets/abaya-black.jpg'],
      'Pink': ['/src/assets/abaya-pink.jpg'],
      'Maroon': ['/src/assets/abaya-maroon.jpg'],
      'Blue': ['/src/assets/abaya-blue.jpg'],
      'Beige': ['/src/assets/abaya-beige.jpg'],
      'Grey': ['/src/assets/abaya-grey.jpg']
    }
  },
  {
    id: '1',
    name: 'Hand-Painted Floral Canvas',
    description: 'Original acrylic painting on canvas with delicate gold leaf accents. Perfect for adding a touch of nature to your space.',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800',
    category: 'Art',
    colors: ['White', 'Cream', 'Light Blue']
  },
  {
    id: '2',
    name: 'Premium Velvet Prayer Set',
    description: 'A luxurious prayer set including a soft velvet mat and a matching tasbih. Designed for comfort and elegance.',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800',
    category: 'Prayer Set',
    colors: ['Deep Green', 'Royal Blue', 'Maroon', 'Black']
  },
  {
    id: '3',
    name: 'Handcrafted Silver Moon Necklace',
    description: 'A delicate sterling silver necklace featuring a hand-hammered crescent moon pendant.',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
    category: 'Jewelry',
    colors: ['Silver', 'Gold', 'Rose Gold']
  },
  {
    id: '4',
    name: 'Resin Ocean Wave Wall Art',
    description: 'Stunning resin art piece capturing the essence of ocean waves with real sand and shells.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800',
    category: 'Art',
    colors: ['Deep Blue', 'Turquoise', 'Emerald']
  },
  {
    id: '5',
    name: 'Embroidered Satin Prayer Set',
    description: 'Beautifully embroidered satin prayer mat with a matching carrying pouch. Lightweight and travel-friendly.',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=80&w=800',
    category: 'Prayer Set',
    colors: ['Pink', 'Lavender', 'Mint', 'Gold']
  },
  {
    id: '6',
    name: 'Gold Leaf Resin Earrings',
    description: 'Elegant clear resin earrings embedded with genuine gold leaf flakes and hypoallergenic hooks.',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
    category: 'Jewelry',
    colors: ['Clear/Gold', 'Pink/Gold', 'Blue/Gold']
  }
];
