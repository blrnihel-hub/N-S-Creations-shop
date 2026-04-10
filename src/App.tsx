/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGesture } from '@use-gesture/react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Instagram,
  Facebook,
  Music,
  Mail,
  Phone,
  Heart,
  Settings,
  PlusCircle,
  Image as ImageIcon,
  ZoomIn,
  MessageCircle,
  MapPin,
  Flower2,
  Sparkles,
  Music2,
  ChevronLeft,
  ChevronRight,
  Share2,
  Copy,
  Check
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { auth, db, storage } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, deleteDoc, onSnapshot, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { handleFirestoreError, OperationType } from './lib/firestoreUtils';
import { loadStripe } from '@stripe/stripe-js';
import { GoogleGenAI, Type } from '@google/genai';

const stripePromise = loadStripe((import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

import { products as initialProducts } from './data';
import { Product, CartItem } from './types';
import { Language, translations } from './translations';

const WILAYAS = [
  { id: '01', name: 'Adrar', price: 800 },
  { id: '02', name: 'Chlef', price: 600 },
  { id: '03', name: 'Laghouat', price: 700 },
  { id: '04', name: 'Oum El Bouaghi', price: 600 },
  { id: '05', name: 'Batna', price: 600 },
  { id: '06', name: 'Béjaïa', price: 600 },
  { id: '07', name: 'Biskra', price: 700 },
  { id: '08', name: 'Béchar', price: 800 },
  { id: '09', name: 'Blida', price: 500 },
  { id: '10', name: 'Bouira', price: 500 },
  { id: '11', name: 'Tamanrasset', price: 1000 },
  { id: '12', name: 'Tébessa', price: 600 },
  { id: '13', name: 'Tlemcen', price: 500 },
  { id: '14', name: 'Tiaret', price: 600 },
  { id: '15', name: 'Tizi Ouzou', price: 600 },
  { id: '16', name: 'Alger', price: 500 },
  { id: '17', name: 'Djelfa', price: 600 },
  { id: '18', name: 'Jijel', price: 600 },
  { id: '19', name: 'Sétif', price: 600 },
  { id: '20', name: 'Saïda', price: 500 },
  { id: '21', name: 'Skikda', price: 600 },
  { id: '22', name: 'Sidi Bel Abbès', price: 400 },
  { id: '23', name: 'Annaba', price: 600 },
  { id: '24', name: 'Guelma', price: 600 },
  { id: '25', name: 'Constantine', price: 600 },
  { id: '26', name: 'Médéa', price: 500 },
  { id: '27', name: 'Mostaganem', price: 400 },
  { id: '28', name: "M'Sila", price: 600 },
  { id: '29', name: 'Mascara', price: 400 },
  { id: '30', name: 'Ouargla', price: 800 },
  { id: '31', name: 'Oran', price: 300 },
  { id: '32', name: 'El Bayadh', price: 700 },
  { id: '33', name: 'Illizi', price: 1000 },
  { id: '34', name: 'Bordj Bou Arréridj', price: 600 },
  { id: '35', name: 'Boumerdès', price: 500 },
  { id: '36', name: 'El Tarf', price: 600 },
  { id: '37', name: 'Tindouf', price: 1000 },
  { id: '38', name: 'Tissemsilt', price: 600 },
  { id: '39', name: 'El Oued', price: 800 },
  { id: '40', name: 'Khenchela', price: 600 },
  { id: '41', name: 'Souk Ahras', price: 600 },
  { id: '42', name: 'Tipaza', price: 500 },
  { id: '43', name: 'Mila', price: 600 },
  { id: '44', name: 'Aïn Defla', price: 500 },
  { id: '45', name: 'Naâma', price: 700 },
  { id: '46', name: 'Aïn Témouchent', price: 400 },
  { id: '47', name: 'Ghardaïa', price: 800 },
  { id: '48', name: 'Relizane', price: 500 },
  { id: '49', name: "El M'Ghair", price: 800 },
  { id: '50', name: 'El Meniaa', price: 800 },
  { id: '51', name: 'Ouled Djellal', price: 800 },
  { id: '52', name: 'Bordj Baji Mokhtar', price: 1200 },
  { id: '53', name: 'Béni Abbès', price: 900 },
  { id: '54', name: 'Timimoun', price: 900 },
  { id: '55', name: 'Touggourt', price: 800 },
  { id: '56', name: 'Djanet', price: 1200 },
  { id: '57', name: 'In Salah', price: 1000 },
  { id: '58', name: 'In Guezzam', price: 1200 },
];

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1 .05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
  </svg>
);

const saveVideo = async (id: string, file: File) => {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open('ns-creations-videos', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos');
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('videos', 'readwrite');
      const store = transaction.objectStore('videos');
      const putRequest = store.put(file, id);
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    };
    request.onerror = () => reject(request.error);
  });
};

const getVideo = async (id: string) => {
  return new Promise<Blob | null>((resolve, reject) => {
    const request = indexedDB.open('ns-creations-videos', 1);
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('videos')) {
        resolve(null);
        return;
      }
      const transaction = db.transaction('videos', 'readonly');
      const store = transaction.objectStore('videos');
      const getRequest = store.get(id);
      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
    };
    request.onerror = () => reject(request.error);
  });
};

const SmartVideo = React.forwardRef<HTMLVideoElement, { url: string, className?: string } & any>(({ url, className, ...props }, ref) => {
  const [resolvedUrl, setResolvedUrl] = useState('');
  const isYoutube = url && (url.includes('youtube.com') || url.includes('youtu.be'));

  useEffect(() => {
    if (!url) return;
    let currentBlobUrl = '';

    if (url.startsWith('local-video:')) {
      const id = url.replace('local-video:', '');
      getVideo(id).then(blob => {
        if (blob) {
          currentBlobUrl = URL.createObjectURL(blob);
          setResolvedUrl(currentBlobUrl);
        }
      });
    } else {
      setResolvedUrl(url);
    }
    
    return () => {
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [url]);

  if (!url) return null;

  if (isYoutube) {
    const videoId = url.split('v=')[1] || url.split('/').pop();
    const hasControls = props.controls !== false;
    const isMuted = props.muted ? 1 : 0;
    const isLoop = props.loop ? 1 : 0;
    const isAutoplay = props.autoPlay ? 1 : 0;
    
    let embedUrl = `https://www.youtube.com/embed/${videoId}?controls=${hasControls ? 1 : 0}&mute=${isMuted}&autoplay=${isAutoplay}`;
    if (isLoop) {
      embedUrl += `&loop=1&playlist=${videoId}`;
    }

    return (
      <iframe 
        src={embedUrl || undefined}
        className={className}
        allowFullScreen
        allow="autoplay; encrypted-media"
        title="Video"
      />
    );
  }

  return (
    <video 
      ref={ref}
      src={resolvedUrl || undefined} 
      className={className}
      {...props}
    />
  );
});
SmartVideo.displayName = 'SmartVideo';

const defaultSettings = {
  siteName: 'N&S Creations',
  videoUrl: '',
  heroImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2000",
  heroTitle: {
    en: 'Crafting Beauty in Every Detail',
    fr: 'L\'Art de la Beauté dans Chaque Détail',
    ar: 'صناعة الجمال في كل التفاصيل'
  },
  heroSubtitle: {
    en: 'Est. 2024 • Handmade with Love',
    fr: 'Est. 2024 • Fait Main avec Amour',
    ar: 'تأسست عام 2024 • صنع بكل حب'
  },
  heroDescription: {
    en: 'Discover our curated collection of handcrafted jewelry, custom apparel, and soulful home decor designed to inspire your everyday life.',
    fr: 'Découvrez notre collection de bijoux artisanaux, de vêtements personnalisés et de décoration d\'intérieur conçus pour inspirer votre quotidien.',
    ar: 'اكتشف مجموعتنا المختارة من المجوهرات المصنوعة يدويًا، والملابس المخصصة، وديكور المنزل الروحي المصمم لإلهام حياتك اليومية.'
  },
  footerDescription: {
    en: 'We believe in the power of handmade. Every piece in our shop is crafted with intention, quality materials, and a touch of magic.',
    fr: 'Nous croyons au pouvoir du fait main. Chaque pièce de notre boutique est conçue avec intention, des matériaux de qualité et une touche de magie.',
    ar: 'نحن نؤمن بقوة العمل اليدوي. كل قطعة في متجرنا مصنوعة بنية ومواد عالية الجودة ولمسة من السحر.'
  },
  socialLinks: {
    instagram: '',
    facebook: '',
    tiktok: '',
    messenger: ''
  },
  email: '',
  phone: '',
  logoImage: '',
  logoSize: 48,
  logoFit: 'cover' as 'cover' | 'contain',
  logoBg: 'rgba(255, 255, 255, 0.2)',
  logoBlur: 4,
  logoBgOpacity: 0.2,
  logoBgEnabled: true,
  logoTransparent: {
    nav: false,
    hero: false
  },
  logoPadding: 8,
  navBg: 'rgba(253, 242, 244, 0.8)',
  heroLogoOpacity: 1,
  marqueePosition: 'none' as 'top' | 'bottom' | 'none',
  marqueeText: '',
  imageMarqueeUrls: '',
  imageMarqueePosition: 'none' as 'top' | 'bottom' | 'none',
  imageMarqueeDirection: 'left' as 'left' | 'right',
  forcePrepayCategories: [] as string[],
  coworkers: [] as string[],
  logoColors: {
    n: '#E07A8D',
    amp: '#5C3D46',
    s: 'rgba(92, 61, 70, 0.6)'
  },
  checkoutDirectly: false,
  copyrightText: {
    en: 'N&S Creations 2024 • All rights reserved.',
    fr: 'N&S Creations 2024 • Tous droits réservés.',
    ar: 'N&S Creations 2024 • جميع الحقوق محفوظة.'
  },
  deliveryPrices: {
    bureau: 400,
    domicile: 600,
    retour: 200
  },
  wilayaPrices: WILAYAS.reduce((acc, w) => ({ 
    ...acc, 
    [w.id]: { 
      bureau: w.price - 100, 
      domicile: w.price + 100, 
      retour: 200 
    } 
  }), {} as Record<string, { bureau: number, domicile: number, retour: number }>),
  colorMap: {
    'Pink': '#FFD1DC',
    'Rose': '#E07A8D',
    'Ink': '#5C3D46',
    'White': '#FFFFFF',
    'Black': '#000000',
    'Gold': '#D4AF37',
    'Silver': '#C0C0C0'
  } as Record<string, string>,
  colors: {
    pinkLight: '#fdf2f4',
    pink: '#FFD1DC',
    rose: '#E07A8D',
    ink: '#5C3D46'
  }
};

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  const Marquee = ({ position }: { position: 'top' | 'bottom' }) => {
    if (siteSettings.marqueePosition !== position) return null;
    return (
      <div className={`w-full bg-brand-rose text-white py-3 overflow-hidden whitespace-nowrap relative z-50 ${position === 'top' ? 'border-b' : 'border-t'} border-white/10`}>
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          {Array(10).fill(0).map((_, i) => (
            <span key={i} className="text-[11px] uppercase tracking-[0.3em] font-bold px-8">
              {siteSettings.marqueeText || t.heroSubtitle[language]}
            </span>
          ))}
        </motion.div>
      </div>
    );
  };

  const ImageMarquee = ({ position }: { position: 'top' | 'bottom' }) => {
    if (siteSettings.imageMarqueePosition !== position) return null;
    const images = siteSettings.imageMarqueeUrls.split(',').map(u => u.trim()).filter(u => u);
    if (images.length === 0) return null;

    return (
      <div className={`w-full bg-white/80 backdrop-blur-md py-3 overflow-hidden whitespace-nowrap relative z-40 ${position === 'top' ? 'border-b' : 'border-t'} border-brand-rose/10`}>
        <motion.div
          animate={{ x: siteSettings.imageMarqueeDirection === 'left' ? [0, -2000] : [-2000, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-0"
        >
          {Array(10).fill(0).map((_, i) => (
            <React.Fragment key={i}>
              {images.map((url, idx) => (
                <img 
                  key={`${i}-${idx}`} 
                  src={url} 
                  alt="Marquee" 
                  className="h-32 w-auto object-cover border-r border-brand-rose/5"
                  referrerPolicy="no-referrer"
                />
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    );
  };

  useEffect(() => {
    if (showSplash && isDataLoaded) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        setIsAppReady(true);
      }, 2000); // Reduced to 2s since we also wait for data
      return () => clearTimeout(timer);
    }
  }, [showSplash, isDataLoaded]);

  const playCheckoutSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playTone = (freq: number, start: number, duration: number) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime + start);
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime + start);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + start + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + start + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start(audioCtx.currentTime + start);
        oscillator.stop(audioCtx.currentTime + start + duration);
      };

      // Soft bell sound (two tones)
      playTone(880, 0, 0.5); // A5
      playTone(1108.73, 0.1, 0.4); // C#6
    } catch (e) {
      console.error('Sound failed', e);
    }
  };

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const [siteSettings, setSiteSettings] = useState(defaultSettings);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [isOrdersViewOpen, setIsOrdersViewOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isMasterAdmin = user && user.email === 'bnihel38@gmail.com' && user.emailVerified;
      const isCoworker = user && siteSettings.coworkers?.includes(user.email || '') && user.emailVerified;
      
      if (isMasterAdmin || isCoworker) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, [siteSettings.coworkers]);

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const mergeLocalized = (defaultValue: Record<string, string>, parsedValue: any) => {
          if (typeof parsedValue === 'string') return defaultValue;
          return { ...defaultValue, ...parsedValue };
        };
        setSiteSettings({
          ...defaultSettings,
          ...data,
          heroTitle: mergeLocalized(defaultSettings.heroTitle, data.heroTitle),
          heroSubtitle: mergeLocalized(defaultSettings.heroSubtitle, data.heroSubtitle),
          heroDescription: mergeLocalized(defaultSettings.heroDescription, data.heroDescription),
          copyrightText: mergeLocalized(defaultSettings.copyrightText, data.copyrightText),
          footerDescription: mergeLocalized(defaultSettings.footerDescription, data.footerDescription),
          logoColors: { ...defaultSettings.logoColors, ...(data.logoColors || {}) },
          logoTransparent: { ...defaultSettings.logoTransparent, ...(data.logoTransparent || {}) },
          colors: { ...defaultSettings.colors, ...(data.colors || {}) },
          colorMap: { ...defaultSettings.colorMap, ...(data.colorMap || {}) },
          socialLinks: { ...defaultSettings.socialLinks, ...(data.socialLinks || {}) },
          deliveryPrices: { ...defaultSettings.deliveryPrices, ...(data.deliveryPrices || {}) },
          wilayaPrices: data.wilayaPrices || defaultSettings.wilayaPrices,
          coworkers: data.coworkers || defaultSettings.coworkers,
          logoBgEnabled: data.logoBgEnabled !== undefined ? data.logoBgEnabled : defaultSettings.logoBgEnabled
        });
        setIsDataLoaded(true);
      } else {
        // Just use default settings in state if not in Firestore yet
        setSiteSettings(defaultSettings);
        setIsDataLoaded(true);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/main');
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const loadedProducts = snapshot.docs.map(doc => doc.data() as Product);
        setProducts(loadedProducts);
      } else {
        // Just use initial products in state if not in Firestore yet
        setProducts(initialProducts);
      }
      setIsDataLoaded(true);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'products');
    });

    let unsubOrders: (() => void) | undefined;
    if (isAdmin) {
      unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
        const loadedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(loadedOrders.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'orders');
      });
    }

    return () => {
      unsubSettings();
      unsubProducts();
      if (unsubOrders) unsubOrders();
    };
  }, [isAdmin]);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const seedDatabase = async () => {
      if (isAdmin && isDataLoaded) {
        try {
          // Check if settings exist
          const settingsSnap = await getDocs(collection(db, 'settings')).catch(error => {
            handleFirestoreError(error, OperationType.LIST, 'settings');
            throw error;
          });
          if (settingsSnap.empty) {
            await setDoc(doc(db, 'settings', 'main'), defaultSettings).catch(error => {
              handleFirestoreError(error, OperationType.WRITE, 'settings/main');
              throw error;
            });
          }

          // Check if products exist
          const productsSnap = await getDocs(collection(db, 'products')).catch(error => {
            handleFirestoreError(error, OperationType.LIST, 'products');
            throw error;
          });
          if (productsSnap.empty) {
            for (const p of initialProducts) {
              await setDoc(doc(db, 'products', p.id), p).catch(error => {
                handleFirestoreError(error, OperationType.WRITE, `products/${p.id}`);
                throw error;
              });
            }
          }
        } catch (error) {
          console.error('Failed to seed database:', error);
        }
      }
    };
    seedDatabase();
  }, [isAdmin, isDataLoaded]);

  const randomizeVideo = () => {
    if (siteSettings.videoUrl) {
      const urls = siteSettings.videoUrl.split(',').map(u => u.trim()).filter(u => u);
      if (urls.length > 1) {
        setCurrentVideoIndex(prevIndex => {
          let nextIndex = Math.floor(Math.random() * urls.length);
          if (nextIndex === prevIndex) {
            nextIndex = (prevIndex + 1) % urls.length;
          }
          return nextIndex;
        });
      }
    }
  };

  useEffect(() => {
    randomizeVideo();
  }, [siteSettings.videoUrl]);

  const currentVideoUrl = useMemo(() => {
    if (!siteSettings.videoUrl) return '';
    const urls = siteSettings.videoUrl.split(',').map(u => u.trim()).filter(u => u);
    return urls[currentVideoIndex] || urls[0] || '';
  }, [siteSettings.videoUrl, currentVideoIndex]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ns-creations-cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cart, clearing corrupted data', e);
        localStorage.removeItem('ns-creations-cart');
      }
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [productColors, setProductColors] = useState<Record<string, string>>({});

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleAdminToggle = async () => {
    if (isAdmin) {
      await signOut(auth);
    } else {
      if (isLoggingIn) return;
      setIsLoggingIn(true);
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (error: any) {
        if (error.code === 'auth/cancelled-popup-request') {
          console.log('Login request already in progress');
          return;
        }
        if (error.code === 'auth/popup-closed-by-user') {
          console.log('Login popup closed by user');
          return;
        }
        if (error.code === 'auth/popup-blocked') {
          showNotification('Login popup was blocked by your browser. Please allow popups for this site.', 'error');
          return;
        }
        console.error('Login failed', error);
        showNotification(`Login failed: ${error.message}`, 'error');
      } finally {
        setIsLoggingIn(false);
      }
    }
  };
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [zoomedImages, setZoomedImages] = useState<string[]>([]);
  const [zoomedImageIndex, setZoomedImageIndex] = useState(0);
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [selectedDimension, setSelectedDimension] = useState<Record<string, string>>({});
  const [customDimensions, setCustomDimensions] = useState<Record<string, string>>({});
  const [customDescription, setCustomDescription] = useState<Record<string, string>>({});
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    wilaya: '',
    deliveryType: 'domicile' as 'bureau' | 'domicile' | 'retour' | 'none'
  });
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomOffset, setZoomOffset] = useState({ x: 0, y: 0 });

  const bind = useGesture(
    {
      onPinch: ({ offset: [d] }) => {
        setZoomScale(d);
      },
      onPinchEnd: () => {
        setZoomScale(1);
        setZoomOffset({ x: 0, y: 0 });
      },
      onDrag: ({ offset: [x, y], pinching, cancel }) => {
        if (pinching) return cancel();
        if (zoomScale > 1) {
          setZoomOffset({ x, y });
        } else {
          setZoomOffset({ x: 0, y: 0 });
        }
      },
      onDragEnd: () => {
        if (zoomScale <= 1) {
          setZoomOffset({ x: 0, y: 0 });
        }
      }
    },
    {
      pinch: { scaleBounds: { min: 1, max: 8 }, from: () => [zoomScale, 0] },
      drag: { from: () => [zoomOffset.x, zoomOffset.y] },
    }
  );

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const handleSettingsSave = async () => {
    if (isAdmin) {
      try {
        await setDoc(doc(db, 'settings', 'main'), siteSettings);
        showNotification(language === 'ar' ? 'تم حفظ الإعدادات بنجاح!' : language === 'fr' ? 'Paramètres enregistrés avec succès !' : 'Settings saved successfully!', 'success');
      } catch (error) {
        console.error('Error saving settings:', error);
        showNotification('Failed to save settings', 'error');
      }
    }
    setIsSettingsOpen(false);
  };

  useEffect(() => {
    // Apply colors to CSS variables
    const root = document.documentElement;
    if (siteSettings.colors) {
      root.style.setProperty('--color-brand-pink-light', siteSettings.colors.pinkLight || '#fdf2f4');
      root.style.setProperty('--color-brand-pink', siteSettings.colors.pink || '#FFD1DC');
      root.style.setProperty('--color-brand-rose', siteSettings.colors.rose || '#E07A8D');
      root.style.setProperty('--color-brand-ink', siteSettings.colors.ink || '#5C3D46');
      // Also update shadcn primary if needed
      root.style.setProperty('--primary', siteSettings.colors.rose || '#E07A8D');
    }
  }, [siteSettings]);

  // New product form state
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    localizedName: { en: '', fr: '', ar: '' },
    localizedDescription: { en: '', fr: '', ar: '' },
    price: 0,
    category: 'Art',
    image: '',
    colors: [],
    colorImages: {}
  });

  // Initialize default colors for new products only
  useEffect(() => {
    setProductColors(prev => {
      const newDefaults = { ...prev };
      let changed = false;
      products.forEach(p => {
        if (p.colors && p.colors.length > 0 && !newDefaults[p.id]) {
          newDefaults[p.id] = p.colors[0];
          changed = true;
        }
      });
      return changed ? newDefaults : prev;
    });
  }, [products]);

  // Save products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ns-creations-products', JSON.stringify(products));
    } catch (e: any) {
      console.error('Failed to save products to localStorage', e);
      if (e.name === 'QuotaExceededError' || e.message.includes('quota')) {
        showNotification(
          language === 'ar' ? 'مساحة التخزين ممتلئة. يرجى حذف بعض المنتجات أو الصور.' : 
          language === 'fr' ? 'Espace de stockage plein. Veuillez supprimer certains produits ou images.' : 
          'Storage quota exceeded. Please delete some products or images.', 
          'error'
        );
      }
    }
  }, [products]);

  // Save cart to localStorage
  const [isCopied, setIsCopied] = useState(false);

  const generateCartShareLink = () => {
    if (cart.length === 0) return '';
    const cartData = cart.map(item => ({
      id: item.id,
      q: item.quantity,
      c: item.selectedColor,
      d: item.selectedDimension,
      cd: item.customDimensions,
      desc: item.customDescription
    }));
    const encoded = btoa(JSON.stringify(cartData));
    return `${window.location.origin}?cart=${encoded}`;
  };

  const handleShareCart = async () => {
    const link = generateCartShareLink();
    if (!link) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: siteSettings.siteName,
          text: language === 'ar' ? 'تحقق من سلة التسوق الخاصة بي!' : language === 'fr' ? 'Regardez mon panier !' : 'Check out my cart!',
          url: link
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(link);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        showNotification(language === 'ar' ? 'تم نسخ الرابط!' : language === 'fr' ? 'Lien copié !' : 'Link copied!', 'success');
      } catch (err) {
        console.error('Error copying:', err);
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cartParam = params.get('cart');
    if (cartParam) {
      try {
        const decoded = JSON.parse(atob(cartParam));
        const newItems: CartItem[] = [];
        
        decoded.forEach((item: any) => {
          const product = products.find(p => p.id === item.id);
          if (product) {
            newItems.push({
              ...product,
              quantity: item.q,
              selectedColor: item.c,
              selectedDimension: item.d,
              customDimensions: item.cd,
              customDescription: item.desc
            });
          }
        });

        if (newItems.length > 0) {
          setCart(prev => {
            const merged = [...prev];
            newItems.forEach(newItem => {
              const existingIndex = merged.findIndex(i => i.id === newItem.id && i.selectedColor === newItem.selectedColor);
              if (existingIndex > -1) {
                merged[existingIndex].quantity += newItem.quantity;
              } else {
                merged.push(newItem);
              }
            });
            return merged;
          });
          
          // Clear URL param without refreshing
          window.history.replaceState({}, '', window.location.pathname);
          showNotification(language === 'ar' ? 'تمت إضافة المنتجات من الرابط!' : language === 'fr' ? 'Articles ajoutés depuis le lien !' : 'Items added from shared link!', 'success');
          setIsCartOpen(true);
        }
      } catch (err) {
        console.error('Error parsing shared cart:', err);
      }
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('ns-creations-cart', JSON.stringify(cart));
    } catch (e: any) {
      console.error('Failed to save cart to localStorage', e);
      if (e.name === 'QuotaExceededError' || e.message.includes('quota')) {
        showNotification(
          language === 'ar' ? 'مساحة التخزين ممتلئة. لا يمكن حفظ سلة التسوق.' : 
          language === 'fr' ? 'Espace de stockage plein. Impossible d\'enregistrer le panier.' : 
          'Storage quota exceeded. Cannot save cart.', 
          'error'
        );
      }
    }
  }, [cart]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      showNotification(language === 'ar' ? 'تم الدفع بنجاح! شكراً لطلبك.' : language === 'fr' ? 'Paiement réussi ! Merci pour votre commande.' : 'Payment successful! Thank you for your order.', 'success');
      setCart([]);
      // Clear URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (query.get('canceled')) {
      showNotification(language === 'ar' ? 'تم إلغاء الدفع.' : language === 'fr' ? 'Paiement annulé.' : 'Payment canceled.', 'info');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [language]);

  const t = translations[language];

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  const subCategories = useMemo(() => {
    if (!selectedCategory) return [];
    return Array.from(new Set(products.filter(p => p.category === selectedCategory && p.subCategory).map(p => p.subCategory!)));
  }, [products, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const name = (product.localizedName?.[language] || product.name).toLowerCase();
      const desc = (product.localizedDescription?.[language] || product.description).toLowerCase();
      const query = searchQuery.toLowerCase();
      
      // Also search in other languages for better UX
      const otherNames = Object.values(product.localizedName || {}).join(' ').toLowerCase();
      const otherDescs = Object.values(product.localizedDescription || {}).join(' ').toLowerCase();

      const matchesSearch = name.includes(query) || desc.includes(query) || 
                          otherNames.includes(query) || otherDescs.includes(query);
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchesSubCategory = selectedSubCategory ? product.subCategory === selectedSubCategory : true;
      return matchesSearch && matchesCategory && matchesSubCategory;
    });
  }, [products, searchQuery, selectedCategory, selectedSubCategory, language]);

  const [cartParticles, setCartParticles] = useState<{ id: number; x: number; y: number; type: 'flower' | 'glitter' }[]>([]);

  const addToCart = (product: Product, e?: React.MouseEvent) => {
    if (product.isSoldOut) {
      showNotification(language === 'ar' ? 'عذراً، هذا المنتج غير متوفر حالياً.' : language === 'fr' ? 'Désolé, cet article est épuisé.' : 'Sorry, this item is sold out.', 'info');
      return;
    }

    const selectedColor = productColors[product.id];
    const dimension = selectedDimension[product.id];
    const customDim = customDimensions[product.id];
    const customDesc = customDescription[product.id];

    const colorImgs = selectedColor && product.colorImages ? product.colorImages[selectedColor] : null;
    const itemImage = colorImgs 
      ? (Array.isArray(colorImgs) ? colorImgs[0] : colorImgs) 
      : product.image;

    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedColor === selectedColor && 
        item.selectedDimension === dimension &&
        item.customDimensions === customDim &&
        item.customDescription === customDesc
      );
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && 
           item.selectedColor === selectedColor && 
           item.selectedDimension === dimension &&
           item.customDimensions === customDim &&
           item.customDescription === customDesc) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { 
        ...product, 
        image: itemImage, 
        quantity: 1, 
        selectedColor,
        selectedDimension: dimension,
        customDimensions: customDim,
        customDescription: customDesc
      }];
    });
    
    // Trigger animation
    const x = e ? e.clientX : window.innerWidth / 2;
    const y = e ? e.clientY : window.innerHeight / 2;
    
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      type: (Math.random() > 0.3 ? 'flower' : 'glitter') as 'flower' | 'glitter'
    }));
    
    setCartParticles(prev => [...prev, ...newParticles]);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, selectedColor?: string) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.selectedColor === selectedColor)));
  };

  const updateQuantity = (productId: string, selectedColor: string | undefined, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId && item.selectedColor === selectedColor) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleCheckout = () => {
    setCurrentOrderId(`NS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
    setIsCheckoutFormOpen(true);
  };

  const confirmOrder = async () => {
    const selectedWilaya = WILAYAS.find(w => w.id === customerInfo.wilaya);
    const deliveryPrice = customerInfo.deliveryType === 'none' ? 0 : (siteSettings.wilayaPrices[customerInfo.wilaya]?.[customerInfo.deliveryType as 'bureau' | 'domicile' | 'retour'] || 0);
    
    try {
      // Play sound
      playCheckoutSound();

      // Save order to Firestore
      const orderData = {
        customerInfo: {
          ...customerInfo,
          wilayaName: selectedWilaya?.name || customerInfo.wilaya
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.localizedName?.[language] || item.name,
          price: item.price,
          quantity: item.quantity,
          color: item.selectedColor || null,
          dimension: item.selectedDimension || null,
          customDimensions: item.customDimensions || null,
          customDescription: item.customDescription || null
        })),
        total: cartTotal + deliveryPrice,
        deliveryPrice,
        status: 'pending',
        createdAt: serverTimestamp(),
        orderId: currentOrderId
      };

      await addDoc(collection(db, 'orders'), orderData);

      showNotification(
        language === 'ar' 
          ? 'تم تسجيل طلبك بنجاح! سنتصل بك قريباً للتأكيد.' 
          : language === 'fr' 
          ? 'Votre commande a été enregistrée ! Nous vous appellerons bientôt pour confirmer.' 
          : 'Order placed successfully! We will call you soon to confirm.', 
        'success'
      );

      setCart([]);
      setIsCheckoutFormOpen(false);
      setIsCartOpen(false);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'orders');
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, field: string, isEditing: boolean = false, isSiteSetting: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        showNotification(language === 'ar' ? 'جاري رفع الصورة...' : language === 'fr' ? 'Téléchargement de l\'image...' : 'Uploading image...', 'info');
        
        const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        if (isSiteSetting) {
          setSiteSettings(prev => ({ ...prev, [field]: downloadURL }));
          showNotification(language === 'ar' ? 'تم الرفع بنجاح!' : language === 'fr' ? 'Téléchargement réussi !' : 'Upload successful!', 'success');
          return;
        }

        if (isEditing && editingProduct) {
          if (field === 'image') {
            setEditingProduct(prev => prev ? ({ ...prev, image: downloadURL }) : null);
          } else {
            setEditingProduct(prev => {
              if (!prev) return null;
              const current = prev.colorImages?.[field] || [];
              const imagesArray = Array.isArray(current) ? current : [current];
              return {
                ...prev,
                colorImages: { ...prev.colorImages, [field]: [...imagesArray, downloadURL] }
              };
            });
          }
        } else if (!isEditing) {
          if (field === 'image') {
            setNewProduct(prev => ({ ...prev, image: downloadURL }));
          } else {
            setNewProduct(prev => {
              const current = prev.colorImages?.[field] || [];
              const imagesArray = Array.isArray(current) ? current : [current];
              return {
                ...prev,
                colorImages: { ...prev.colorImages, [field]: [...imagesArray, downloadURL] }
              };
            });
          }
        }
        showNotification(language === 'ar' ? 'تم الرفع بنجاح!' : language === 'fr' ? 'Téléchargement réussi !' : 'Upload successful!', 'success');
      } catch (err: any) {
        console.error(err);
        showNotification(language === 'ar' ? 'فشل الرفع.' : language === 'fr' ? 'Échec du téléchargement.' : 'Upload failed: ' + err.message, 'error');
      }
    }
  };

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleAutoFillAI = async (isEditing: boolean) => {
    const targetProduct = isEditing ? editingProduct : newProduct;
    if (!targetProduct?.image) {
      showNotification(language === 'ar' ? 'يرجى إضافة صورة أولاً ليتمكن الذكاء الاصطناعي من وصفها.' : language === 'fr' ? 'Veuillez d\'abord ajouter une image pour que l\'IA puisse la décrire.' : 'Please add an image first so the AI can describe it.', 'error');
      return;
    }

    setIsGeneratingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let imagePart;
      if (targetProduct.image.startsWith('data:image')) {
        const mimeType = targetProduct.image.split(';')[0].split(':')[1];
        const base64Data = targetProduct.image.split(',')[1];
        imagePart = {
          inlineData: {
            mimeType,
            data: base64Data
          }
        };
      } else {
        const response = await fetch(targetProduct.image);
        const blob = await response.blob();
        const base64Data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(blob);
        });
        imagePart = {
          inlineData: {
            mimeType: blob.type,
            data: base64Data
          }
        };
      }

      const prompt = `Analyze this product image and generate a catchy, elegant name and a detailed, appealing description for an e-commerce store. 
      The store sells artistic creations, clothing, and accessories.
      Provide the name and description in English, French, and Arabic.
      Return the response as a JSON object with the following structure:
      {
        "name": { "en": "...", "fr": "...", "ar": "..." },
        "description": { "en": "...", "fr": "...", "ar": "..." }
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.OBJECT,
                properties: {
                  en: { type: Type.STRING },
                  fr: { type: Type.STRING },
                  ar: { type: Type.STRING }
                }
              },
              description: {
                type: Type.OBJECT,
                properties: {
                  en: { type: Type.STRING },
                  fr: { type: Type.STRING },
                  ar: { type: Type.STRING }
                }
              }
            }
          }
        }
      });

      const result = JSON.parse(response.text?.trim() || "{}");
      
      if (isEditing && editingProduct) {
        setEditingProduct({
          ...editingProduct,
          name: result.name?.en || editingProduct.name,
          description: result.description?.en || editingProduct.description,
          localizedName: result.name || editingProduct.localizedName,
          localizedDescription: result.description || editingProduct.localizedDescription
        });
      } else {
        setNewProduct(prev => ({
          ...prev,
          name: result.name?.en || prev.name,
          description: result.description?.en || prev.description,
          localizedName: result.name || prev.localizedName,
          localizedDescription: result.description || prev.localizedDescription
        }));
      }
      
      showNotification(language === 'ar' ? 'تم التوليد بنجاح!' : language === 'fr' ? 'Généré avec succès !' : 'Generated successfully!', 'success');
    } catch (error) {
      console.error('AI Generation error:', error);
      showNotification(language === 'ar' ? 'فشل التوليد. يرجى المحاولة مرة أخرى.' : language === 'fr' ? 'Échec de la génération. Veuillez réessayer.' : 'Generation failed. Please try again.', 'error');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || newProduct.price === undefined || !newProduct.image) {
      showNotification(language === 'ar' ? 'يرجى ملء الاسم والسعر والصورة.' : language === 'fr' ? 'Veuillez remplir le nom, le prix et l\'image.' : 'Please fill in Name, Price, and Image.', 'error');
      return;
    }
    
    const productToAdd: Product = {
      ...newProduct as Product,
      id: Date.now().toString(),
    };

    try {
      await setDoc(doc(db, 'products', productToAdd.id), productToAdd);
      setIsAddDialogOpen(false);
      setNewProduct({
        name: '',
        price: 0,
        category: 'Art',
        description: '',
        image: '',
        measure: '',
        age: '',
        subCategory: '',
        colors: [],
        colorImages: {},
        isSoldOut: false,
        availableDimensions: [],
        requiresCustomDimensions: false,
        requiresDescription: false
      });
      showNotification(language === 'ar' ? 'تمت إضافة المنتج بنجاح!' : language === 'fr' ? 'Produit ajouté avec succès !' : 'Product added successfully!', 'success');
    } catch (error) {
      console.error('Error adding product:', error);
      showNotification('Failed to add product', 'error');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !editingProduct.name || editingProduct.price === undefined || !editingProduct.image) {
      showNotification(language === 'ar' ? 'يرجى ملء الاسم والسعر والصورة.' : language === 'fr' ? 'Veuillez remplir le nom, le prix et l\'image.' : 'Please fill in Name, Price, and Image.', 'error');
      return;
    }
    
    try {
      await setDoc(doc(db, 'products', editingProduct.id), editingProduct);
      setIsEditDialogOpen(false);
      showNotification(language === 'ar' ? 'تم تحديث المنتج بنجاح!' : language === 'fr' ? 'Produit mis à jour avec succès !' : 'Product updated successfully!', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${editingProduct.id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProductToDelete(null);
      showNotification(language === 'ar' ? 'تم حذف المنتج بنجاح!' : language === 'fr' ? 'Produit supprimé avec succès !' : 'Product deleted successfully!', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const getColorHex = (colorName: string) => {
    return siteSettings.colorMap[colorName] || siteSettings.colorMap[colorName.charAt(0).toUpperCase() + colorName.slice(1).toLowerCase()] || '#cccccc';
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-pink-light">
      <Marquee position="top" />
      <ImageMarquee position="top" />
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center max-w-md w-full"
            >
              <div className={`w-40 h-40 flex items-center justify-center mb-8 mx-auto overflow-hidden border-2 border-brand-rose/20 shadow-2xl rounded-full`}
                style={{ 
                  backgroundColor: siteSettings.logoBgEnabled ? siteSettings.logoBg : 'transparent',
                  backdropFilter: siteSettings.logoBgEnabled ? `blur(${siteSettings.logoBlur}px)` : 'none'
                }}
              >
                {siteSettings.logoImage ? (
                  <img 
                    src={siteSettings.logoImage || undefined} 
                    alt="Logo" 
                    className={`w-full h-full object-${siteSettings.logoFit} rounded-full`} 
                    style={{ padding: `${siteSettings.logoPadding}px` }}
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <div className="w-full h-full bg-brand-rose/10 flex items-center justify-center">
                    <span className="text-4xl font-serif text-brand-rose font-bold">N&S</span>
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-brand-ink mb-3 tracking-tight">
                {siteSettings.siteName}
              </h1>
              <p className="text-brand-rose font-medium tracking-[0.3em] uppercase text-[10px] mb-12">
                {language === 'ar' ? 'إبداعات يدوية راقية' : language === 'fr' ? 'Créations Artisanales' : 'Artisan Creations'}
              </p>
              
              <div className="mt-16 flex gap-2 justify-center">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                    className="w-2.5 h-2.5 bg-brand-rose/40 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Animation Particles */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        <AnimatePresence>
          {cartParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 0, x: p.x, y: p.y }}
              animate={{ 
                opacity: 0, 
                scale: [0, 1.2, 1], 
                x: p.x + (Math.random() - 0.5) * 400, 
                y: p.y - 400 - Math.random() * 300,
                rotate: Math.random() * 1080
              }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              exit={{ opacity: 0 }}
              className="absolute"
            >
              {p.type === 'flower' ? (
                <Flower2 className="w-8 h-8 text-brand-rose fill-brand-rose/30" />
              ) : (
                <Sparkles className="w-5 h-5 text-brand-rose/40" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Particle Cleanup */}
      {(() => {
        useEffect(() => {
          if (cartParticles.length > 0) {
            const timer = setTimeout(() => {
              setCartParticles([]);
            }, 3000);
            return () => clearTimeout(timer);
          }
        }, [cartParticles]);
        return null;
      })()}

      {/* Navigation */}
      <nav 
        className="sticky top-0 z-50 backdrop-blur-md border-b border-brand-rose/10 px-6 py-4"
        style={{ backgroundColor: siteSettings.navBg || 'rgba(253, 242, 244, 0.8)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              dir="ltr"
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubCategory(null);
                randomizeVideo();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div 
                className={`w-10 h-10 flex items-center justify-center shadow-sm border border-brand-rose/10 overflow-hidden rounded-full`}
                style={{ 
                  backgroundColor: siteSettings.logoBgEnabled 
                    ? (siteSettings.logoTransparent.nav ? 'transparent' : siteSettings.logoBg) 
                    : 'transparent',
                  backdropFilter: siteSettings.logoBgEnabled && !siteSettings.logoTransparent.nav ? `blur(${siteSettings.logoBlur}px)` : 'none'
                }}
              >
                {siteSettings.logoImage ? (
                  <img src={siteSettings.logoImage || undefined} alt="Logo" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <span className="font-bold text-xl" style={{ color: siteSettings.logoColors.n }}>{siteSettings.siteName.charAt(0)}</span>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline leading-none">
                  <span className="font-bold text-2xl tracking-tighter" style={{ color: siteSettings.logoColors.n }}>{siteSettings.siteName.charAt(0)}</span>
                  <span className="font-bold text-2xl tracking-tighter" style={{ color: siteSettings.logoColors.amp }}>&</span>
                  <span className="font-bold text-2xl tracking-tighter" style={{ color: siteSettings.logoColors.s }}>{siteSettings.siteName.split(/[& ]/)[1]?.charAt(0) || ''}</span>
                </div>
                <span className="font-light italic text-[10px] text-brand-ink/80 tracking-[0.2em] uppercase -mt-1">
                  {siteSettings.siteName.split(/[& ]/).slice(siteSettings.siteName.includes('&') ? 2 : 1).join(' ')}
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium uppercase tracking-widest text-brand-ink/60">
              <button 
                onClick={() => { 
                  setSelectedCategory(null); 
                  setSelectedSubCategory(null); 
                  randomizeVideo();
                }}
                className={`hover:text-brand-rose transition-colors ${!selectedCategory ? 'text-brand-rose' : ''}`}
              >
                {t.shopAll}
              </button>
              {categories.map(cat => (
                <div key={cat} className="relative group">
                  <button 
                    onClick={() => { setSelectedCategory(cat); setSelectedSubCategory(null); }}
                    className={`hover:text-brand-rose transition-colors ${selectedCategory === cat ? 'text-brand-rose' : ''}`}
                  >
                    {t[cat.toLowerCase().replace(/ /g, '') as keyof typeof t] || cat}
                  </button>
                  {selectedCategory === cat && subCategories.length > 0 && (
                    <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-xl p-2 min-w-[150px] border border-brand-rose/10 flex flex-col gap-1">
                      {subCategories.map(sub => (
                        <button
                          key={sub}
                          onClick={() => setSelectedSubCategory(sub)}
                          className={`text-left px-3 py-2 rounded-lg text-xs hover:bg-brand-pink-light transition-colors ${selectedSubCategory === sub ? 'text-brand-rose bg-brand-pink-light' : 'text-brand-ink/60'}`}
                        >
                          {t[sub.toLowerCase().replace(/ /g, '') as keyof typeof t] || sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isAdmin && (
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center gap-2 text-brand-rose hover:text-brand-rose/80 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  {t.siteSettings}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-brand-rose/5 rounded-full px-1 py-1 border border-brand-rose/10">
              {(['en', 'fr', 'ar'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-all ${
                    language === lang 
                      ? 'bg-brand-rose text-white shadow-sm' 
                      : 'text-brand-ink/40 hover:text-brand-rose'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'fr' ? 'FR' : 'AR'}
                </button>
              ))}
            </div>

            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-ink/40" />
              <Input 
                placeholder={t.searchPlaceholder} 
                className="pl-10 bg-white/50 border-brand-rose/20 focus:border-brand-rose w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  className="border-brand-rose text-brand-rose hover:bg-brand-rose/5"
                  onClick={() => setIsOrdersViewOpen(true)}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {t.viewOrders}
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger render={<Button variant="outline" className="border-brand-rose text-brand-rose hover:bg-brand-rose/5" />}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    {t.addArticle}
                  </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-brand-pink-light h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                  <div className="p-6 pb-2 shrink-0">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-serif text-brand-ink">{t.addNewArticle}</DialogTitle>
                    </DialogHeader>
                  </div>
                  <div className="flex-1 overflow-y-auto px-6">
                    <div className="grid gap-4 py-4 pb-20">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="name">{t.articleName} (Default)</Label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-[10px] bg-brand-rose/10 text-brand-rose border-brand-rose/20 hover:bg-brand-rose hover:text-white"
                          onClick={() => handleAutoFillAI(false)}
                          disabled={isGeneratingAI}
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          {isGeneratingAI ? 'Generating...' : 'Auto-Fill with AI'}
                        </Button>
                      </div>
                      <div className="grid gap-2">
                        <Input 
                          id="name" 
                          value={newProduct.name} 
                          onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Abaya Dentelle"
                        />
                      </div>

                      <div className="space-y-4 p-4 bg-brand-rose/5 rounded-xl border border-brand-rose/10">
                        <Label className="text-brand-rose font-bold uppercase tracking-widest text-[10px]">{language === 'ar' ? 'الأسماء المترجمة' : language === 'fr' ? 'Noms Localisés' : 'Localized Names'}</Label>
                        {(['en', 'fr', 'ar'] as const).map(lang => (
                          <div key={lang} className="grid gap-1.5">
                            <Label className="text-[10px] opacity-60">{lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'Arabic'}</Label>
                            <Input 
                              value={newProduct.localizedName?.[lang] || ''}
                              onChange={(e) => setNewProduct(prev => ({ 
                                ...prev, 
                                localizedName: { ...prev.localizedName, [lang]: e.target.value } 
                              }))}
                              placeholder={`${t.articleName} (${lang})`}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 p-3 bg-brand-rose/5 rounded-xl border border-brand-rose/10">
                          <input 
                            type="checkbox" 
                            id="isSoldOut"
                            checked={newProduct.isSoldOut}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, isSoldOut: e.target.checked }))}
                            className="w-4 h-4 rounded border-brand-rose/20 text-brand-rose focus:ring-brand-rose"
                          />
                          <Label htmlFor="isSoldOut" className="text-xs font-bold">{t.isSoldOut}</Label>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-brand-rose/5 rounded-xl border border-brand-rose/10">
                          <input 
                            type="checkbox" 
                            id="requiresCustomDimensions"
                            checked={newProduct.requiresCustomDimensions}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, requiresCustomDimensions: e.target.checked }))}
                            className="w-4 h-4 rounded border-brand-rose/20 text-brand-rose focus:ring-brand-rose"
                          />
                          <Label htmlFor="requiresCustomDimensions" className="text-xs font-bold">{t.requiresCustomDimensions}</Label>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-brand-rose/5 rounded-xl border border-brand-rose/10">
                          <input 
                            type="checkbox" 
                            id="requiresDescription"
                            checked={newProduct.requiresDescription}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, requiresDescription: e.target.checked }))}
                            className="w-4 h-4 rounded border-brand-rose/20 text-brand-rose focus:ring-brand-rose"
                          />
                          <Label htmlFor="requiresDescription" className="text-xs font-bold">{t.requiresDescription}</Label>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="availableDimensions">{t.availableDimensions} (Comma separated)</Label>
                        <Input 
                          id="availableDimensions" 
                          value={newProduct.availableDimensions?.join(', ') || ''} 
                          onChange={(e) => setNewProduct(prev => ({ ...prev, availableDimensions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                          placeholder="30x40cm, 50x70cm, 100x120cm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="price">{t.price} (DZD)</Label>
                          <Input 
                            id="price" 
                            type="number"
                            value={newProduct.price} 
                            onChange={(e) => setNewProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category">{t.category}</Label>
                          <select 
                            id="category"
                            className="flex h-10 w-full rounded-md border border-brand-rose/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose"
                            value={newProduct.category}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value as any }))}
                          >
                            <option value="Art">Art</option>
                            <option value="Prayer Set">Prayer Set</option>
                            <option value="Jewelry">Jewelry</option>
                          </select>
                        </div>
                        {newProduct.category === 'Prayer Set' && (
                          <div className="grid gap-2">
                            <Label htmlFor="subCategory">{t.subCategory}</Label>
                            <select 
                              id="subCategory"
                              className="flex h-10 w-full rounded-md border border-brand-rose/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose"
                              value={newProduct.subCategory || ''}
                              onChange={(e) => setNewProduct(prev => ({ ...prev, subCategory: e.target.value }))}
                            >
                              <option value="">None</option>
                              <option value="Abayas">Abayas</option>
                              <option value="Prayer Set Box">Prayer Set Box</option>
                              <option value="Prayer Fit">Prayer Fit</option>
                            </select>
                          </div>
                        )}
                        {newProduct.category === 'Art' && (
                          <div className="grid gap-2">
                            <Label htmlFor="measure">{t.measure}</Label>
                            <Input 
                              id="measure"
                              value={newProduct.measure}
                              onChange={(e) => setNewProduct(prev => ({ ...prev, measure: e.target.value }))}
                              placeholder="e.g. 50x70 cm"
                            />
                          </div>
                        )}
                        {newProduct.subCategory === 'Prayer Fit' && (
                          <div className="grid gap-2">
                            <Label htmlFor="age">{t.age}</Label>
                            <Input 
                              id="age"
                              value={newProduct.age}
                              onChange={(e) => setNewProduct(prev => ({ ...prev, age: e.target.value }))}
                              placeholder="e.g. 6-12 years"
                            />
                          </div>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="image">{t.mainImage}</Label>
                        <p className="text-[10px] text-brand-ink/50 italic leading-tight">
                          {language === 'ar' ? 'للحصول على أفضل جودة وتجنب حدود التخزين، قم بلصق روابط الصور (مثل Imgur) بدلاً من الرفع.' : language === 'fr' ? 'Pour une meilleure qualité et éviter les limites, collez des liens d\'images (ex: Imgur) au lieu de télécharger.' : 'For best quality and to avoid storage limits, paste image URLs (e.g. from Imgur) instead of uploading.'}
                        </p>
                        <div className="flex gap-2">
                          <Input 
                            id="image" 
                            value={newProduct.image} 
                            onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                            placeholder="URL or upload..."
                            className="flex-1"
                          />
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer w-10"
                              onChange={(e) => handleImageUpload(e, 'image')}
                            />
                            <Button variant="outline" size="icon" className="w-10 border-brand-rose/20">
                              <ImageIcon className="w-4 h-4 text-brand-rose" />
                            </Button>
                          </div>
                        </div>
                        {newProduct.image && (
                          <div className="mt-2 w-20 h-20 rounded-md overflow-hidden border border-brand-rose/10">
                            <img src={newProduct.image || undefined} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">{t.description} (Default)</Label>
                        <Textarea 
                          id="description" 
                          value={newProduct.description} 
                          onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Tell us about this creation..."
                        />
                      </div>

                      <div className="space-y-4 p-4 bg-brand-rose/5 rounded-xl border border-brand-rose/10">
                        <Label className="text-brand-rose font-bold uppercase tracking-widest text-[10px]">{language === 'ar' ? 'الأوصاف المترجمة' : language === 'fr' ? 'Descriptions Localisées' : 'Localized Descriptions'}</Label>
                        {(['en', 'fr', 'ar'] as const).map(lang => (
                          <div key={lang} className="grid gap-1.5">
                            <Label className="text-[10px] opacity-60">{lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'Arabic'}</Label>
                            <Textarea 
                              value={newProduct.localizedDescription?.[lang] || ''}
                              onChange={(e) => setNewProduct(prev => ({ 
                                ...prev, 
                                localizedDescription: { ...prev.localizedDescription, [lang]: e.target.value } 
                              }))}
                              placeholder={`${t.description} (${lang})`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="colors">{t.colors}</Label>
                        <Input 
                          id="colors" 
                          value={newProduct.colors?.join(', ') || ''} 
                          onChange={(e) => setNewProduct(prev => ({ ...prev, colors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                          placeholder="Black, Pink, Maroon"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>{t.colorImages}</Label>
                        <div className="space-y-3">
                          {newProduct.colors && newProduct.colors.length > 0 ? (
                            <div className="grid gap-2">
                              {newProduct.colors.map(color => (
                                <div key={color} className="flex flex-col gap-2 p-3 bg-white rounded-md border border-brand-rose/10">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div 
                                        className="w-3 h-3 rounded-full border border-black/10 shadow-sm" 
                                        style={{ backgroundColor: getColorHex(color) }}
                                      />
                                      <span className="text-sm font-medium">{color}</span>
                                    </div>
                                    <div className="flex gap-2">
                                      <div className="relative">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="absolute inset-0 opacity-0 cursor-pointer w-8"
                                          onChange={(e) => handleImageUpload(e, color)}
                                        />
                                        <Button variant="ghost" size="icon" className="w-8 h-8 text-brand-rose">
                                          <Plus className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {newProduct.colorImages?.[color] && Array.isArray(newProduct.colorImages[color]) && newProduct.colorImages[color].map((img, idx) => (
                                      <div key={idx} className="relative w-12 h-12 rounded overflow-hidden border border-brand-rose/10 group">
                                        <img src={img || undefined} alt={`${color} ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        <button 
                                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                          onClick={() => {
                                            const current = [...(newProduct.colorImages?.[color] || [])];
                                            current.splice(idx, 1);
                                            setNewProduct(prev => ({
                                              ...prev,
                                              colorImages: { ...prev.colorImages, [color]: current }
                                            }));
                                          }}
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                    <div className="flex items-center gap-2 w-full">
                                      <Input 
                                        placeholder={language === 'ar' ? 'الصق الرابط للإضافة...' : language === 'fr' ? 'Coller l\'URL pour ajouter...' : 'Paste URL to add...'}
                                        className="h-8 text-xs flex-1"
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            const url = (e.target as HTMLInputElement).value;
                                            if (url) {
                                              const current = Array.isArray(newProduct.colorImages?.[color]) ? [...(newProduct.colorImages?.[color] || [])] : [];
                                              setNewProduct(prev => ({
                                                ...prev,
                                                colorImages: { ...prev.colorImages, [color]: [...current, url] }
                                              }));
                                              (e.target as HTMLInputElement).value = '';
                                            }
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-brand-ink/40 italic">{language === 'ar' ? 'أضف ألوانًا أعلاه لتحميل صور محددة لها.' : language === 'fr' ? 'Ajoutez des couleurs ci-dessus pour télécharger des images spécifiques.' : 'Add colors above to upload specific images for them.'}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 pt-2 bg-brand-pink-light border-t border-brand-rose/10 shrink-0">
                    <DialogFooter>
                      <Button 
                        className="w-full bg-brand-rose text-white h-12 rounded-full font-bold uppercase tracking-widest text-xs"
                        onClick={handleAddProduct}
                      >
                        {t.addArticle}
                      </Button>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger 
                render={
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="w-6 h-6 text-brand-ink" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center bg-brand-rose text-white">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                }
              />
              <SheetContent className="w-full sm:max-w-md flex flex-col bg-brand-pink-light">
                <SheetHeader className="pb-6">
                  <SheetTitle className="text-2xl font-serif text-brand-ink">{t.cart}</SheetTitle>
                </SheetHeader>
                
                <ScrollArea className="flex-1 -mx-6 px-6">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-brand-ink/40">
                      <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                      <p className="font-serif italic">{t.cartEmpty}</p>
                      <Button 
                        variant="link" 
                        className="mt-2 text-brand-rose"
                        onClick={() => setIsCartOpen(false)}
                      >
                        {t.startShopping}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-white shrink-0 border border-brand-rose/10">
                            <img 
                              src={item.image || undefined} 
                              alt={item.localizedName?.[language] || item.name} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <h4 className="font-medium text-sm leading-tight text-brand-ink">{item.localizedName?.[language] || item.name}</h4>
                              <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                                {item.selectedColor && (
                                  <p className="text-[9px] text-brand-rose uppercase tracking-wider">{language === 'ar' ? 'اللون' : language === 'fr' ? 'Couleur' : 'Color'}: {item.selectedColor}</p>
                                )}
                                {item.selectedDimension && (
                                  <p className="text-[9px] text-brand-rose uppercase tracking-wider">{t.dimensions}: {item.selectedDimension}</p>
                                )}
                                {item.customDimensions && (
                                  <p className="text-[9px] text-brand-rose uppercase tracking-wider">{t.customDimensions}: {item.customDimensions}</p>
                                )}
                              </div>
                              {item.customDescription && (
                                <p className="text-[9px] text-brand-ink/60 italic mt-1 line-clamp-1">"{item.customDescription}"</p>
                              )}
                              <p className="text-xs text-brand-ink/60 mt-1">{item.price.toLocaleString()} DZD</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center border border-brand-rose/20 rounded-md">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.selectedColor, -1)}
                                  className="p-1 hover:bg-brand-rose/5 transition-colors text-brand-ink"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-3 text-xs font-medium text-brand-ink">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.selectedColor, 1)}
                                  className="p-1 hover:bg-brand-rose/5 transition-colors text-brand-ink"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <button 
                                onClick={() => removeFromCart(item.id, item.selectedColor)}
                                className="text-brand-ink/40 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {cart.length > 0 && (
                  <SheetFooter className="pt-6 border-t border-brand-rose/10">
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-serif text-brand-ink">
                          <span>{t.total}</span>
                          <span className="font-bold ml-2">{cartTotal.toLocaleString()} DZD</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShareCart}
                          className="border-brand-rose text-brand-rose hover:bg-brand-rose/5 rounded-full"
                        >
                          {isCopied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                          {language === 'ar' ? 'مشاركة' : language === 'fr' ? 'Partager' : 'Share'}
                        </Button>
                      </div>
                      <Button 
                        className="w-full bg-brand-rose hover:bg-brand-rose/90 text-white py-6 text-lg group"
                        onClick={handleCheckout}
                      >
                        {t.checkout}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </SheetFooter>
                )}
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden text-brand-ink" />}>
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent side={language === 'ar' ? 'right' : 'left'} className="bg-brand-pink-light border-none">
                <SheetHeader className="text-left mb-8">
                  <SheetTitle className="flex items-center gap-3">
                    <div 
                      className={`flex items-center justify-center shrink-0 bg-brand-pink-light rounded-full overflow-hidden`}
                      style={{ width: `${siteSettings.logoSize * 0.8}px`, height: `${siteSettings.logoSize * 0.8}px` }}
                    >
                      {siteSettings.logoImage ? (
                        <img 
                          src={siteSettings.logoImage || undefined} 
                          alt="Logo" 
                          className={`w-full h-full object-${siteSettings.logoFit} rounded-full`} 
                          referrerPolicy="no-referrer" 
                        />
                      ) : (
                        <div className="w-full h-full bg-brand-pink rounded-full flex items-center justify-center shadow-sm border border-brand-rose/10 overflow-hidden">
                          <span className="font-bold text-xl" style={{ color: siteSettings.logoColors.n }}>N</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-baseline leading-none">
                        <span className="font-bold text-2xl tracking-tighter" style={{ color: siteSettings.logoColors.n }}>{siteSettings.siteName.charAt(0)}</span>
                        <span className="font-bold text-2xl tracking-tighter" style={{ color: siteSettings.logoColors.amp }}>&</span>
                        <span className="font-bold text-2xl tracking-tighter" style={{ color: siteSettings.logoColors.s }}>{siteSettings.siteName.split(/[& ]/)[1]?.charAt(0) || ''}</span>
                      </div>
                      <span className="font-light italic text-[10px] text-brand-ink/80 tracking-[0.2em] uppercase -mt-1">
                        {siteSettings.siteName.split(/[& ]/).slice(siteSettings.siteName.includes('&') ? 2 : 1).join(' ')}
                      </span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 text-lg font-medium uppercase tracking-widest text-brand-ink/60">
                  {isAdmin && (
                    <button 
                      onClick={() => setIsSettingsOpen(true)}
                      className="text-left text-brand-rose font-bold flex items-center gap-2"
                    >
                      <Settings className="w-5 h-5" />
                      {t.siteSettings}
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setSelectedCategory(null);
                    }}
                    className={`text-left hover:text-brand-rose transition-colors ${!selectedCategory ? 'text-brand-rose' : ''}`}
                  >
                    {t.shopAll}
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                      }}
                      className={`text-left hover:text-brand-rose transition-colors ${selectedCategory === cat ? 'text-brand-rose' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                  {isAdmin && (
                    <button 
                      onClick={() => setIsSettingsOpen(true)}
                      className="flex items-center gap-2 text-brand-rose hover:text-brand-rose/80 transition-colors text-left"
                    >
                      <Settings className="w-5 h-5" />
                      {t.siteSettings}
                    </button>
                  )}
                  <Separator className="bg-brand-rose/10" />
                  <div className="flex items-center gap-4">
                    {(['en', 'fr', 'ar'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tighter transition-all ${
                          language === lang 
                            ? 'bg-brand-rose text-white shadow-sm' 
                            : 'text-brand-ink/40 hover:text-brand-rose'
                        }`}
                      >
                        {lang === 'en' ? 'EN' : lang === 'fr' ? 'FR' : 'AR'}
                      </button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        {!selectedCategory && !searchQuery && (
          <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-brand-rose/10 py-20">
            <div className="absolute inset-0 z-0">
              <img 
                src={siteSettings.heroImage || undefined} 
                alt="Artisan workspace" 
                className="w-full h-full object-cover opacity-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {isAdmin && (
              <div className="absolute top-4 right-4 z-20 flex flex-wrap gap-2 justify-end">
                <label className="relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handleImageUpload(e, 'heroImage', false, true)}
                  />
                  <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 bg-white/80 backdrop-blur-sm text-brand-rose shadow-lg hover:bg-white/90">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'تغيير الصورة' : language === 'fr' ? 'Changer l\'image' : 'Change Hero Image'}
                  </div>
                </label>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="bg-white/80 backdrop-blur-sm text-brand-rose shadow-lg"
                  onClick={() => {
                    const url = prompt('Enter image URL:');
                    if (url) setSiteSettings(prev => ({ ...prev, heroImage: url }));
                  }}
                >
                  {language === 'ar' ? 'لصق الرابط' : language === 'fr' ? 'Coller URL' : 'Paste URL'}
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="bg-white/80 backdrop-blur-sm text-brand-rose shadow-lg"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تعديل النصوص' : language === 'fr' ? 'Modifier les textes' : 'Edit Hero Text'}
                </Button>
              </div>
            )}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Hero Logo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="mb-8 flex justify-center"
                >
                  {siteSettings.logoImage ? (
                    <div 
                      className="flex items-center justify-center rounded-full overflow-hidden"
                      style={{ 
                        width: `${Math.min(siteSettings.logoSize * 2.5, 200)}px`, 
                        height: `${Math.min(siteSettings.logoSize * 2.5, 200)}px`,
                        backgroundColor: siteSettings.logoTransparent.hero ? 'transparent' : siteSettings.logoBg.replace(/[^,]+(?=\))/, siteSettings.logoBgOpacity.toString()),
                        backdropFilter: `blur(${siteSettings.logoBlur}px)`,
                        padding: `${siteSettings.logoPadding}px`
                      }}
                    >
                      <img 
                        src={siteSettings.logoImage || undefined} 
                        alt="Logo" 
                        className={`w-full h-full object-${siteSettings.logoFit} rounded-full`} 
                        style={{ opacity: siteSettings.heroLogoOpacity }}
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-brand-pink rounded-full flex items-center justify-center shadow-2xl border border-brand-rose/20">
                      <span className="font-bold text-4xl" style={{ color: siteSettings.logoColors.n }}>{siteSettings.siteName.charAt(0)}</span>
                    </div>
                  )}
                </motion.div>

                <span className="text-xs font-bold uppercase tracking-[0.3em] text-white drop-shadow-lg mb-4 block">
                  {siteSettings.heroSubtitle[language]}
                </span>
                <h2 className="text-6xl md:text-8xl font-serif leading-tight mb-8 text-white drop-shadow-2xl">
                  {siteSettings.heroTitle[language]}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                  {siteSettings.heroDescription[language]}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    size="lg" 
                    className="bg-brand-rose hover:bg-brand-rose/90 text-white px-8 py-7 text-lg rounded-full shadow-xl"
                    onClick={() => {
                      const el = document.getElementById('shop');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {t.shopCollection}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 px-8 py-7 text-lg rounded-full shadow-xl"
                    onClick={() => setIsStoryOpen(true)}
                  >
                    {t.ourStory}
                  </Button>
                </div>
              </motion.div>
            </div>
            
            {/* Floating elements */}
            <motion.div 
              className={`absolute bottom-10 ${language === 'ar' ? 'right-10' : 'left-10'} hidden lg:block`}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className={`bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-brand-rose/10 shadow-xl ${language === 'ar' ? 'rotate-[6deg]' : 'rotate-[-6deg]'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-rose/10 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-brand-rose fill-brand-rose" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-tighter text-brand-ink">{t.unique}</p>
                    <p className="text-[10px] text-brand-ink/60">{t.oneOfAKind}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* Product Grid Section */}
        <section id="shop" className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h3 className="text-4xl font-serif mb-2 text-brand-ink">
                {selectedCategory || t.allCreations}
              </h3>
              <p className="text-brand-ink/60 italic">
                {filteredProducts.length} {t.itemsFound}
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                <Button 
                  variant={selectedCategory === null ? "default" : "outline"}
                  className={selectedCategory === null ? "bg-brand-rose" : "border-brand-rose/20 text-brand-ink/60"}
                  onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); }}
                  size="sm"
                >
                  {language === 'ar' ? 'الكل' : language === 'fr' ? 'Tout' : 'All'}
                </Button>
                {categories.map(cat => (
                  <Button 
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className={selectedCategory === cat ? "bg-brand-rose" : "border-brand-rose/20 text-brand-ink/60"}
                    onClick={() => { setSelectedCategory(cat); setSelectedSubCategory(null); }}
                    size="sm"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              
              {/* Subcategories */}
              {selectedCategory && subCategories.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                  <Button 
                    variant={selectedSubCategory === null ? "default" : "outline"}
                    className={selectedSubCategory === null ? "bg-brand-rose/80" : "border-brand-rose/20 text-brand-ink/60"}
                    onClick={() => setSelectedSubCategory(null)}
                    size="sm"
                  >
                    {language === 'ar' ? 'الكل' : language === 'fr' ? 'Tout' : 'All'}
                  </Button>
                  {subCategories.map(sub => (
                    <Button 
                      key={sub}
                      variant={selectedSubCategory === sub ? "default" : "outline"}
                      className={selectedSubCategory === sub ? "bg-brand-rose/80" : "border-brand-rose/20 text-brand-ink/60"}
                      onClick={() => setSelectedSubCategory(sub)}
                      size="sm"
                    >
                      {sub}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-xl font-serif italic text-brand-ink/40">No products found matching your criteria.</p>
              <Button 
                variant="link" 
                className="mt-4 text-brand-rose"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              <AnimatePresence mode="popLayout">
                {filteredProducts.flatMap((product, index) => {
                  const urls = siteSettings.videoUrl.split(',').map(u => u.trim()).filter(u => u);
                  const showVideoAd = urls.length > 0 && (index + 1) % 6 === 0;
                  const adUrl = urls[Math.floor(Math.random() * urls.length)];
                  
                  const productElement = (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Card className="group border-none bg-transparent shadow-none">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-white border border-brand-rose/5 cursor-zoom-in">
                          {product.isSoldOut && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                              <Badge className="bg-red-500 text-white px-6 py-2 text-lg font-serif italic shadow-xl">
                                {t.soldOut}
                              </Badge>
                            </div>
                          )}
                              <div className="relative w-full h-full overflow-hidden group/carousel">
                                <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                  {(() => {
                                    const selectedColor = productColors[product.id];
                                    const colorImgs = selectedColor && product.colorImages ? product.colorImages[selectedColor] : null;
                                    const imgs = colorImgs 
                                      ? (Array.isArray(colorImgs) ? colorImgs : [colorImgs]) 
                                      : [product.image];
                                    
                                    return imgs.map((img, idx) => (
                                      <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                                        <img 
                                          src={img || undefined} 
                                          alt={`${product.localizedName?.[language] || product.name} - ${idx + 1}`} 
                                          className="w-full h-full object-cover"
                                          referrerPolicy="no-referrer"
                                          onContextMenu={(e) => e.preventDefault()}
                                          draggable="false"
                                          onClick={() => {
                                            setZoomedImages(imgs);
                                            setZoomedImageIndex(idx);
                                          }}
                                        />
                                      </div>
                                    ));
                                  })()}
                                </div>
                                {/* Pagination Dots */}
                                {(() => {
                                  const selectedColor = productColors[product.id];
                                  const colorImgs = selectedColor && product.colorImages ? product.colorImages[selectedColor] : null;
                                  const imgs = colorImgs 
                                    ? (Array.isArray(colorImgs) ? colorImgs : [colorImgs]) 
                                    : [product.image];
                                  
                                  if (imgs.length <= 1) return null;
                                  return (
                                    <div className="absolute top-4 right-4 flex gap-1 z-20 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                      {imgs.map((_, i) => (
                                        <div 
                                          key={i} 
                                          className="w-1.5 h-1.5 rounded-full bg-white shadow-sm"
                                        />
                                      ))}
                                    </div>
                                  );
                                })()}
                                <div 
                                  className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center pointer-events-none"
                                >
                                  {/* Removed magnifying glass as requested */}
                                </div>
                              </div>
                          <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 flex gap-2 ${
                            isAdmin 
                              ? 'translate-y-0 opacity-100' 
                              : 'translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100'
                          }`}>
                            <Button 
                              className={`flex-1 bg-white text-brand-ink hover:bg-brand-pink-light border-none shadow-lg py-6 ${product.isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={(e) => !product.isSoldOut && addToCart(product, e)}
                              disabled={product.isSoldOut}
                            >
                              {product.isSoldOut ? t.soldOut : t.addToCart}
                            </Button>
                            {isAdmin && (
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline"
                                  className="bg-white text-brand-rose hover:bg-brand-rose/5 border-none shadow-lg py-6 px-4"
                                  onClick={() => {
                                    console.log('Edit button clicked');
                                    setEditingProduct(product);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Settings className="w-5 h-5" />
                                </Button>
                                <Button 
                                  variant="destructive"
                                  className="bg-red-500 hover:bg-red-600 text-white border-none shadow-lg py-6 px-4"
                                  onClick={() => setProductToDelete(product.id)}
                                >
                                  <Trash2 className="w-5 h-5" />
                                </Button>
                              </div>
                            )}
                          </div>
                          <Badge className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-brand-rose border-none uppercase tracking-widest text-[10px] px-3 py-1 flex flex-col items-start gap-0.5">
                            <span>{product.category}</span>
                            {product.subCategory && (
                              <span className="text-[8px] opacity-60 lowercase italic">{product.subCategory}</span>
                            )}
                          </Badge>
                        </div>
                        <CardContent className="pt-6 px-0">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-serif leading-tight group-hover:text-brand-rose transition-colors text-brand-ink">
                              {product.localizedName?.[language] || product.name}
                            </h4>
                            <span className="font-medium text-brand-rose">{product.price.toLocaleString()} DZD</span>
                          </div>
                          
                          {product.colors && product.colors.length > 0 && (
                            <div className="space-y-2 mb-4">
                              <p className="text-[10px] uppercase tracking-widest text-brand-ink/40 font-bold">{t.selectColor}</p>
                              <div className="flex flex-wrap gap-2">
                                {product.colors.map(color => (
                                  <button
                                    key={color}
                                    onClick={() => setProductColors(prev => ({ ...prev, [product.id]: color }))}
                                    className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-full border transition-all ${
                                      productColors[product.id] === color 
                                        ? 'text-white border-transparent shadow-sm' 
                                        : 'bg-white text-brand-ink/60 border-brand-rose/10 hover:border-brand-rose/30'
                                    }`}
                                    style={productColors[product.id] === color ? { backgroundColor: getColorHex(color) } : {}}
                                  >
                                    <span 
                                      className="w-2 h-2 rounded-full border border-white/20" 
                                      style={{ backgroundColor: getColorHex(color) }}
                                    />
                                    {color}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {product.availableDimensions && product.availableDimensions.length > 0 && (
                            <div className="space-y-2 mb-4">
                              <p className="text-[10px] uppercase tracking-widest text-brand-ink/40 font-bold">{t.availableDimensions}</p>
                              <div className="flex flex-wrap gap-2">
                                {product.availableDimensions.map(dim => (
                                  <button
                                    key={dim}
                                    onClick={() => setSelectedDimension(prev => ({ ...prev, [product.id]: dim }))}
                                    className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-full border transition-all ${
                                      selectedDimension[product.id] === dim 
                                        ? 'bg-brand-rose text-white border-transparent shadow-sm' 
                                        : 'bg-white text-brand-ink/60 border-brand-rose/10 hover:border-brand-rose/30'
                                    }`}
                                  >
                                    {dim}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {product.requiresCustomDimensions && (
                            <div className="space-y-2 mb-4">
                              <p className="text-[10px] uppercase tracking-widest text-brand-ink/40 font-bold">{t.customDimensions}</p>
                              <Input 
                                placeholder={t.customDimensionsPlaceholder}
                                value={customDimensions[product.id] || ''}
                                onChange={(e) => setCustomDimensions(prev => ({ ...prev, [product.id]: e.target.value }))}
                                className="h-8 text-xs border-brand-rose/10 focus:border-brand-rose/30"
                              />
                            </div>
                          )}

                          {product.requiresDescription && (
                            <div className="space-y-2 mb-4">
                              <p className="text-[10px] uppercase tracking-widest text-brand-ink/40 font-bold">{t.paintingDescription}</p>
                              <Textarea 
                                placeholder={t.paintingDescriptionPlaceholder}
                                value={customDescription[product.id] || ''}
                                onChange={(e) => setCustomDescription(prev => ({ ...prev, [product.id]: e.target.value }))}
                                className="text-xs border-brand-rose/10 focus:border-brand-rose/30 min-h-[60px]"
                              />
                            </div>
                          )}

                          <p className="text-sm text-brand-ink/60 line-clamp-2 font-light leading-relaxed">
                            {product.localizedDescription?.[language] || product.description}
                          </p>

                          {(product.measure || product.age) && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {product.measure && (
                                <Badge variant="outline" className="bg-brand-rose/5 text-brand-rose border-brand-rose/10 text-[9px] uppercase tracking-widest">
                                  {t.measure}: {product.measure}
                                </Badge>
                              )}
                              {product.age && (
                                <Badge variant="outline" className="bg-brand-rose/5 text-brand-rose border-brand-rose/10 text-[9px] uppercase tracking-widest">
                                  {t.age}: {product.age}
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );

                  if (showVideoAd) {
                    return [
                      productElement,
                      <motion.div
                        key={`ad-${product.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="col-span-1 sm:col-span-2 lg:col-span-3 py-8"
                      >
                        <div className="aspect-video rounded-3xl overflow-hidden shadow-xl border-4 border-brand-rose/10">
                          <SmartVideo 
                            url={adUrl}
                            className="w-full h-full object-cover"
                            loop
                            muted
                            autoPlay
                            playsInline
                          />
                        </div>
                      </motion.div>
                    ];
                  }

                  return [productElement];
                })}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Final Cinematic Video Section */}
        {currentVideoUrl && (
          <section className="overflow-hidden">
            <motion.div 
              className="w-full h-[90vh] relative"
              onViewportEnter={() => randomizeVideo()}
              viewport={{ amount: 0.1, once: false }}
            >
              <SmartVideo 
                url={currentVideoUrl}
                key={currentVideoUrl} // Force re-render when URL changes
                className="w-full h-full object-cover"
                loop
                muted
                autoPlay
                playsInline
              />
            </motion.div>
          </section>
        )}

        {/* Reviews & Social Section */}
        {!selectedCategory && !searchQuery && (
          <section className="py-16 px-6 bg-brand-pink-light/30 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-rose/20 to-transparent" />
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Heart key={star} className="w-5 h-5 text-brand-rose fill-brand-rose" />
                  ))}
                </div>
                
                <h2 className="text-3xl md:text-5xl font-serif text-brand-ink leading-tight">
                  {t.reviewsTitle}
                </h2>
                
                <p className="text-lg text-brand-ink/70 font-light leading-relaxed max-w-2xl mx-auto italic">
                  "{t.reviewsSubtitle}"
                </p>

                <div className="pt-6">
                  <span className="text-brand-rose font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">
                    {language === 'ar' ? 'انضم إلى عائلتنا' : language === 'fr' ? 'Rejoignez notre famille' : 'Join our family'}
                  </span>
                  
                  <div className="flex flex-wrap justify-center gap-3">
                    {siteSettings.socialLinks.instagram && (
                      <Button 
                        variant="outline"
                        className="border-brand-rose text-brand-rose hover:bg-brand-rose hover:text-white rounded-full px-8 py-5 transition-all duration-500 text-xs uppercase tracking-widest font-bold"
                        onClick={() => window.open(siteSettings.socialLinks.instagram, '_blank')}
                      >
                        <Instagram className="w-4 h-4 mr-2" />
                        Instagram
                      </Button>
                    )}
                    {siteSettings.socialLinks.facebook && (
                      <Button 
                        variant="outline"
                        className="border-brand-rose text-brand-rose hover:bg-brand-rose hover:text-white rounded-full px-8 py-5 transition-all duration-500 text-xs uppercase tracking-widest font-bold"
                        onClick={() => window.open(siteSettings.socialLinks.facebook, '_blank')}
                      >
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </Button>
                    )}
                    {siteSettings.socialLinks.tiktok && (
                      <Button 
                        variant="outline"
                        className="border-brand-rose text-brand-rose hover:bg-brand-rose hover:text-white rounded-full px-8 py-5 transition-all duration-500 text-xs uppercase tracking-widest font-bold"
                        onClick={() => window.open(siteSettings.socialLinks.tiktok, '_blank')}
                      >
                        <Music2 className="w-4 h-4 mr-2" />
                        TikTok
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className={`fixed bottom-8 left-1/2 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px] border ${
                notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                'bg-brand-ink border-brand-rose/20 text-white'
              }`}
            >
              {notification.type === 'success' && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
              {notification.type === 'error' && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
              <p className="text-sm font-medium">{notification.message}</p>
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-auto h-6 w-6 rounded-full hover:bg-black/5"
                onClick={() => setNotification(null)}
              >
                <X className="w-3 h-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoomed Image Modal */}
        <AnimatePresence>
          {zoomedImages.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-10"
              onClick={() => {
                setZoomedImages([]);
                setZoomScale(1);
              }}
            >
              <div className="absolute top-4 right-4 z-[101] flex gap-2">
                {zoomedImages.length > 1 && (
                  <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold mr-4">
                    {zoomedImageIndex + 1} / {zoomedImages.length}
                  </div>
                )}
                {zoomScale > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-full px-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomScale(1);
                      setZoomOffset({ x: 0, y: 0 });
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t.resetZoom}
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10 rounded-full"
                  onClick={() => {
                    setZoomedImages([]);
                    setZoomScale(1);
                    setZoomOffset({ x: 0, y: 0 });
                  }}
                >
                  <X className="w-8 h-8" />
                </Button>
              </div>

              {/* Image content */}
              <div className="relative w-full h-full overflow-hidden flex items-center justify-center no-scrollbar touch-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={zoomedImageIndex}
                    {...bind()}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{
                      scale: zoomScale,
                      x: zoomOffset.x,
                      y: zoomOffset.y,
                      opacity: 1
                    }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="relative flex items-center justify-center cursor-grab active:cursor-grabbing"
                    onClick={(e) => e.stopPropagation()}
                    drag={zoomScale === 1 ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (zoomScale === 1) {
                        if (info.offset.x < -50 && zoomedImageIndex < zoomedImages.length - 1) {
                          setZoomedImageIndex(prev => prev + 1);
                        } else if (info.offset.x > 50 && zoomedImageIndex > 0) {
                          setZoomedImageIndex(prev => prev - 1);
                        }
                      }
                    }}
                  >
                    <img 
                      src={zoomedImages[zoomedImageIndex] || undefined} 
                      alt="Zoomed view" 
                      className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl select-none pointer-events-none"
                      onContextMenu={(e) => e.preventDefault()}
                      draggable="false"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {zoomedImages.length > 1 && zoomScale === 1 && (
                  <>
                    {zoomedImageIndex > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 text-white hover:bg-white/10 rounded-full hidden md:flex"
                        onClick={(e) => {
                          e.stopPropagation();
                          setZoomedImageIndex(prev => prev - 1);
                        }}
                      >
                        <ChevronLeft className="w-10 h-10" />
                      </Button>
                    )}
                    {zoomedImageIndex < zoomedImages.length - 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 text-white hover:bg-white/10 rounded-full hidden md:flex"
                        onClick={(e) => {
                          e.stopPropagation();
                          setZoomedImageIndex(prev => prev + 1);
                        }}
                      >
                        <ChevronRight className="w-10 h-10" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checkout Form Dialog */}
        <Dialog open={isCheckoutFormOpen} onOpenChange={setIsCheckoutFormOpen}>
          <DialogContent className="sm:max-w-[450px] bg-white rounded-2xl border-none shadow-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-brand-ink text-center">{t.completeYourInfo}</DialogTitle>
              <div className="flex flex-col items-center gap-2 mt-2">
                <div className="flex items-center gap-2 text-brand-rose text-xs font-medium uppercase tracking-widest">
                  <MapPin className="w-3 h-3" />
                  {t.weAreFromOran}
                </div>
                <Badge variant="outline" className="bg-brand-rose/5 text-brand-rose border-brand-rose/20 text-[10px] font-mono">
                  ID: {currentOrderId}
                </Badge>
              </div>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              <div className="grid gap-2">
                <Label htmlFor="fullName">{t.fullName}</Label>
                <Input 
                  id="fullName"
                  value={customerInfo.fullName}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="e.g. Sarah Ben"
                  className="rounded-xl border-brand-rose/20 focus:border-brand-rose"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">{t.phone}</Label>
                <Input 
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g. 0555 12 34 56"
                  className="rounded-xl border-brand-rose/20 focus:border-brand-rose"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="wilaya">{t.wilaya}</Label>
                <select 
                  id="wilaya"
                  value={customerInfo.wilaya}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, wilaya: e.target.value }))}
                  className="w-full h-10 rounded-xl border border-brand-rose/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/20"
                >
                  <option value="">Select Wilaya</option>
                  {WILAYAS.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.id} - {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="deliveryType">{t.deliveryType}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(['bureau', 'domicile', 'retour', 'none'] as const).map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={customerInfo.deliveryType === type ? 'default' : 'outline'}
                      onClick={() => setCustomerInfo(prev => ({ ...prev, deliveryType: type }))}
                      className={`text-[10px] h-auto py-2 px-1 ${customerInfo.deliveryType === type ? 'bg-brand-rose text-white' : 'border-brand-rose/20 text-brand-ink'}`}
                    >
                      {t[type === 'none' ? 'noDelivery' : ('delivery' + type.charAt(0).toUpperCase() + type.slice(1)) as keyof typeof t]}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-brand-rose/5 p-4 rounded-2xl border border-brand-rose/10 space-y-2">
                <div className="flex justify-between text-sm text-brand-ink/60">
                  <span>Subtotal:</span>
                  <span>{cartTotal.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-sm text-brand-ink/60">
                  <span>{t.deliveryPrice}:</span>
                  <span>{customerInfo.deliveryType === 'none' ? '0' : (siteSettings.wilayaPrices[customerInfo.wilaya]?.[customerInfo.deliveryType as 'bureau' | 'domicile' | 'retour'] || 0).toLocaleString()} DZD</span>
                </div>
                <Separator className="bg-brand-rose/10" />
                <div className="flex justify-between text-lg font-serif text-brand-ink font-bold">
                  <span>Total:</span>
                  <span>{(cartTotal + (customerInfo.deliveryType === 'none' ? 0 : (siteSettings.wilayaPrices[customerInfo.wilaya]?.[customerInfo.deliveryType as 'bureau' | 'domicile' | 'retour'] || 0))).toLocaleString()} DZD</span>
                </div>
              </div>

              <Button 
                onClick={confirmOrder}
                disabled={!customerInfo.fullName || !customerInfo.phone || !customerInfo.wilaya}
                className="w-full bg-brand-rose hover:bg-brand-rose/90 text-white py-6 text-lg rounded-xl shadow-lg shadow-brand-rose/20"
              >
                {t.saveChanges}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Site Settings Dialog */}
        <Dialog open={isStoryOpen} onOpenChange={setIsStoryOpen}>
        <DialogContent className="max-w-2xl rounded-[32px] border-brand-rose/10 p-0 overflow-hidden">
          <div className="relative h-48 bg-brand-rose/10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <img 
                src={siteSettings.heroImage || undefined} 
                alt="Story Background" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 border-4 border-brand-rose/20">
                <Flower2 className="w-10 h-10 text-brand-rose" />
              </div>
              <DialogTitle className="text-2xl font-serif text-brand-ink">{t.storyTitle}</DialogTitle>
            </div>
          </div>
          <div className="p-8 md:p-12 bg-white">
            <div className="prose prose-brand max-w-none">
              <p className="text-lg text-brand-ink/80 leading-relaxed font-light italic mb-8 text-center">
                "{language === 'ar' ? 'صُنع بكل حب' : language === 'fr' ? 'Fait avec amour' : 'Made with love'}"
              </p>
              <p className="text-brand-ink/70 leading-loose text-justify whitespace-pre-wrap">
                {t.storyContent}
              </p>
            </div>
            <div className="mt-10 flex justify-center">
              <Button 
                onClick={() => setIsStoryOpen(false)}
                className="bg-brand-rose hover:bg-brand-rose/90 text-white rounded-full px-10 py-6"
              >
                {language === 'ar' ? 'شكراً لكم' : language === 'fr' ? 'Merci' : 'Thank You'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

        {/* Orders View Dialog */}
        <Dialog open={isOrdersViewOpen} onOpenChange={setIsOrdersViewOpen}>
          <DialogContent className="max-w-4xl bg-white rounded-2xl border-none shadow-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="text-2xl font-serif text-brand-ink">{t.orders}</DialogTitle>
                  <DialogDescription>
                    {language === 'ar' ? 'عرض وإدارة طلبات الزبائن' : language === 'fr' ? 'Voir et gérer les commandes des clients' : 'View and manage customer orders'}
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {language === 'ar' ? 'مزامنة فورية' : language === 'fr' ? 'Sync en direct' : 'Live Sync'}
                  </span>
                </div>
              </div>
            </DialogHeader>
            <div className="py-4">
              {orders.length === 0 ? (
                <div className="text-center py-10 text-brand-ink/40 italic">
                  {t.noOrders}
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="border-brand-rose/10 overflow-hidden">
                      <div className="bg-brand-rose/5 p-4 flex justify-between items-center border-b border-brand-rose/10">
                        <div className="flex items-center gap-4">
                          <Badge className="bg-brand-rose text-white">{order.orderId}</Badge>
                          <span className="text-xs text-brand-ink/60">
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'Just now'}
                          </span>
                        </div>
                        <Badge variant="outline" className="border-brand-rose text-brand-rose uppercase text-[10px]">
                          {order.status}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <h6 className="text-[10px] uppercase tracking-widest text-brand-ink/40 font-bold">{t.customer}</h6>
                            <p className="text-sm font-medium text-brand-ink">{order.customerInfo.fullName}</p>
                            <p className="text-sm text-brand-ink/70">{order.customerInfo.phone}</p>
                            <p className="text-sm text-brand-ink/70">{order.customerInfo.wilayaName} - {order.customerInfo.deliveryType}</p>
                          </div>
                          <div className="space-y-2">
                            <h6 className="text-[10px] uppercase tracking-widest text-brand-ink/40 font-bold">{t.items}</h6>
                            <ul className="space-y-1">
                              {order.items.map((item: any, idx: number) => (
                                <li key={idx} className="text-sm text-brand-ink/70 flex justify-between">
                                  <span>{item.quantity}x {item.name} {item.color ? `(${item.color})` : ''}</span>
                                  <span className="font-medium">{item.price * item.quantity} DZD</span>
                                </li>
                              ))}
                            </ul>
                            <div className="pt-2 border-t border-brand-rose/5 flex justify-between items-center">
                              <span className="text-sm font-bold text-brand-ink">{t.total}</span>
                              <span className="text-lg font-bold text-brand-rose">{order.total} DZD</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-brand-pink-light/20 p-4 flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs border-brand-rose/20"
                          onClick={() => {
                            const status = order.status === 'pending' ? 'confirmed' : order.status === 'confirmed' ? 'shipped' : 'delivered';
                            updateDoc(doc(db, 'orders', order.id), { status });
                          }}
                        >
                          {language === 'ar' ? 'تحديث الحالة' : language === 'fr' ? 'Mettre à jour le statut' : 'Update Status'}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="text-xs bg-red-500 hover:bg-red-600"
                          onClick={() => deleteDoc(doc(db, 'orders', order.id))}
                        >
                          {t.delete}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl border-none shadow-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-brand-ink">{t.siteSettings}</DialogTitle>
              <DialogDescription>
                {t.sitePersonalization}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-brand-rose uppercase tracking-widest border-b pb-2">{language === 'ar' ? 'فيديو ترويجي' : language === 'fr' ? 'Vidéo Promotionnelle' : 'Vidéo Promotionnelle'}</h4>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>{language === 'ar' ? 'روابط الفيديو (افصل بينها بفاصلة للتبديل العشوائي)' : language === 'fr' ? 'Liens Vidéo (séparés par virgule pour aléatoire)' : 'Video URLs (comma separated for random rotation)'}</Label>
                    <div className="flex gap-2">
                      <Textarea 
                        value={siteSettings.videoUrl}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, videoUrl: e.target.value }))}
                        placeholder="https://youtube.com/..., https://..."
                        className="min-h-[100px] flex-1"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-auto"
                        onClick={() => setSiteSettings(prev => ({ ...prev, videoUrl: '' }))}
                        title={language === 'ar' ? 'مسح الكل' : language === 'fr' ? 'Tout effacer' : 'Clear all'}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>{language === 'ar' ? 'إضافة فيديو من المعرض' : language === 'fr' ? 'Ajouter une vidéo depuis la galerie' : 'Add video from gallery'}</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="file"
                        accept="video/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Limit to 50MB for IndexedDB safety
                            if (file.size > 50 * 1024 * 1024) {
                              showNotification(
                                language === 'ar' 
                                  ? 'حجم الفيديو كبير جداً (الحد الأقصى 50 ميجابايت). يرجى استخدام رابط YouTube للفيديوهات الأكبر.' 
                                  : language === 'fr' 
                                  ? 'La vidéo est trop volumineuse (max 50 Mo). Veuillez utiliser un lien YouTube pour les vidéos plus grandes.' 
                                  : 'Video is too large (max 50MB). Please use a YouTube link for larger videos.',
                                'error'
                              );
                              return;
                            }

                            const videoId = `vid-${Date.now()}`;
                            try {
                              await saveVideo(videoId, file);
                              const newUrl = `local-video:${videoId}`;
                              setSiteSettings(prev => ({ 
                                ...prev, 
                                videoUrl: prev.videoUrl ? `${prev.videoUrl}, ${newUrl}` : newUrl 
                              }));
                              showNotification(
                                language === 'ar' ? 'تمت إضافة الفيديو بنجاح' : language === 'fr' ? 'Vidéo ajoutée avec succès' : 'Video added successfully',
                                'success'
                              );
                            } catch (err) {
                              showNotification(
                                language === 'ar' ? 'فشل في حفظ الفيديو.' : language === 'fr' ? 'Échec de l\'enregistrement de la vidéo.' : 'Failed to save video.',
                                'error'
                              );
                            }
                          }
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-brand-rose uppercase tracking-widest border-b pb-2">{language === 'ar' ? 'معلومات عامة' : language === 'fr' ? 'Informations Générales' : 'General Info'}</h4>
                <div className="grid gap-2">
                  <Label>{t.siteName}</Label>
                  <Input 
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    placeholder="e.g. N&S Creations"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-brand-rose uppercase tracking-widest border-b pb-2">{t.heroSection}</h4>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>{language === 'ar' ? 'صورة الهيرو (رابط)' : language === 'fr' ? 'Image Hero (URL)' : 'Hero Image (URL)'}</Label>
                    <Input 
                      value={siteSettings.heroImage}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, heroImage: e.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  {(['en', 'fr', 'ar'] as const).map(lang => (
                    <div key={lang} className="grid gap-2 p-3 bg-brand-rose/5 rounded-lg border border-brand-rose/10">
                      <Label className="text-[10px] uppercase tracking-widest text-brand-rose">{lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'Arabic'}</Label>
                      <div className="grid gap-2">
                        <Label className="text-xs">{t.heroTitle}</Label>
                        <Input 
                          value={siteSettings.heroTitle[lang]}
                          onChange={(e) => setSiteSettings(prev => ({ ...prev, heroTitle: { ...prev.heroTitle, [lang]: e.target.value } }))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs">{t.heroSubtitle}</Label>
                        <Input 
                          value={siteSettings.heroSubtitle[lang]}
                          onChange={(e) => setSiteSettings(prev => ({ ...prev, heroSubtitle: { ...prev.heroSubtitle, [lang]: e.target.value } }))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs">{t.heroDescription}</Label>
                        <Textarea 
                          value={siteSettings.heroDescription[lang]}
                          onChange={(e) => setSiteSettings(prev => ({ ...prev, heroDescription: { ...prev.heroDescription, [lang]: e.target.value } }))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-brand-rose uppercase tracking-widest border-b pb-2">{t.footerSocial}</h4>
                <div className="grid gap-4">
                  {(['en', 'fr', 'ar'] as const).map(lang => (
                    <div key={lang} className="grid gap-2 p-3 bg-brand-rose/5 rounded-lg border border-brand-rose/10">
                      <Label className="text-[10px] uppercase tracking-widest text-brand-rose">{lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'Arabic'}</Label>
                      <div className="grid gap-2">
                        <Label className="text-xs">{t.footerDescription}</Label>
                        <Textarea 
                          value={siteSettings.footerDescription[lang]}
                          onChange={(e) => setSiteSettings(prev => ({ ...prev, footerDescription: { ...prev.footerDescription, [lang]: e.target.value } }))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid gap-2">
                    <Label>{t.instagramUrl}</Label>
                    <Input 
                      value={siteSettings.socialLinks.instagram}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, instagram: e.target.value } }))}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t.facebookUrl}</Label>
                    <Input 
                      value={siteSettings.socialLinks.facebook}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, facebook: e.target.value } }))}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t.tiktokUrl}</Label>
                    <Input 
                      value={siteSettings.socialLinks.tiktok}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, tiktok: e.target.value } }))}
                      placeholder="https://tiktok.com/@..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t.messengerUrl}</Label>
                    <Input 
                      value={siteSettings.socialLinks.messenger}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, messenger: e.target.value } }))}
                      placeholder="https://m.me/..."
                    />
                    <p className="text-[10px] text-brand-rose italic">{t.messengerHint}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>{t.email}</Label>
                    <Input 
                      value={siteSettings.email}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="contact@nscreations.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t.phone}</Label>
                    <Input 
                      value={siteSettings.phone}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-brand-rose uppercase tracking-widest border-b pb-2">{language === 'ar' ? 'تخصيص الشعار' : language === 'fr' ? 'Personnalisation du Logo' : 'Logo Customization'}</h4>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>{t.logoImage}</Label>
                    <div className="flex items-center gap-4">
                      {siteSettings.logoImage && (
                        <img src={siteSettings.logoImage || undefined} alt="Logo" className="w-12 h-12 rounded-full object-cover border border-brand-rose/10" />
                      )}
                      <Button 
                        variant="outline" 
                        className="border-brand-rose/20 text-brand-ink"
                        onClick={() => document.getElementById('logo-upload-settings')?.click()}
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        {t.upload}
                      </Button>
                      <input 
                        id="logo-upload-settings"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'logoImage', false, true)}
                      />
                    </div>
                    <Label className="text-xs mt-2">{t.logoImage} (URL)</Label>
                    <Input 
                      value={siteSettings.logoImage}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, logoImage: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-xs">{t.logoColorN}</Label>
                      <Input 
                        type="color"
                        value={siteSettings.logoColors.n}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, logoColors: { ...prev.logoColors, n: e.target.value } }))}
                        className="h-10 p-1"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs">{t.logoColorAmp}</Label>
                      <Input 
                        type="color"
                        value={siteSettings.logoColors.amp}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, logoColors: { ...prev.logoColors, amp: e.target.value } }))}
                        className="h-10 p-1"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs">{t.logoColorS}</Label>
                      <Input 
                        type="color"
                        value={siteSettings.logoColors.s}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, logoColors: { ...prev.logoColors, s: e.target.value } }))}
                        className="h-10 p-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-xs">{language === 'ar' ? 'خلفية الشعار' : language === 'fr' ? 'Arrière-plan du Logo' : 'Logo Background'}</Label>
                      <Input 
                        type="color"
                        value={siteSettings.logoBg.startsWith('rgba') ? '#ffffff' : siteSettings.logoBg}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, logoBg: e.target.value }))}
                        className="h-10 p-1"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs">{language === 'ar' ? 'شفافية خلفية الشعار' : language === 'fr' ? 'Opacité fond du Logo' : 'Logo Bg Opacity'} ({Math.round(siteSettings.logoBgOpacity * 100)}%)</Label>
                      <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={siteSettings.logoBgOpacity}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, logoBgOpacity: parseFloat(e.target.value) }))}
                        className="w-full h-2 bg-brand-rose/20 rounded-lg appearance-none cursor-pointer accent-brand-rose"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs">{language === 'ar' ? 'تمويه الخلفية' : language === 'fr' ? 'Flou d\'arrière-plan' : 'Background Blur'} ({siteSettings.logoBlur}px)</Label>
                      <input 
                        type="range"
                        min="0"
                        max="20"
                        value={siteSettings.logoBlur}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, logoBlur: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-brand-rose/20 rounded-lg appearance-none cursor-pointer accent-brand-rose"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs">{language === 'ar' ? 'هوامش الشعار' : language === 'fr' ? 'Marge du Logo' : 'Logo Padding'} ({siteSettings.logoPadding}px)</Label>
                      <input 
                        type="range"
                        min="0"
                        max="40"
                        value={siteSettings.logoPadding}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, logoPadding: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-brand-rose/20 rounded-lg appearance-none cursor-pointer accent-brand-rose"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs">{t.logoSize} ({siteSettings.logoSize}px)</Label>
                      <input 
                        type="range"
                        min="24"
                        max="120"
                        value={siteSettings.logoSize}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, logoSize: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-brand-rose/20 rounded-lg appearance-none cursor-pointer accent-brand-rose"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={siteSettings.logoTransparent.nav}
                          onChange={(e) => setSiteSettings(prev => ({ ...prev, logoTransparent: { ...prev.logoTransparent, nav: e.target.checked } }))}
                        />
                        <Label className="text-xs">Transparent Nav Logo</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={siteSettings.logoTransparent.hero}
                          onChange={(e) => setSiteSettings(prev => ({ ...prev, logoTransparent: { ...prev.logoTransparent, hero: e.target.checked } }))}
                        />
                        <Label className="text-xs">Transparent Hero Logo</Label>
                      </div>
                    </div>
                    <div className="grid gap-2 mt-4">
                      <Label className="text-xs">{language === 'ar' ? 'شفافية شعار الهيرو' : language === 'fr' ? 'Opacité du Logo Hero' : 'Hero Logo Opacity'} ({Math.round(siteSettings.heroLogoOpacity * 100)}%)</Label>
                      <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={siteSettings.heroLogoOpacity}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, heroLogoOpacity: parseFloat(e.target.value) }))}
                        className="w-full h-2 bg-brand-rose/20 rounded-lg appearance-none cursor-pointer accent-brand-rose"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs">{t.logoFit}</Label>
                      <div className="flex gap-2">
                        <Button 
                          variant={siteSettings.logoFit === 'cover' ? 'default' : 'outline'}
                          size="xs"
                          className="flex-1"
                          onClick={() => setSiteSettings(prev => ({ ...prev, logoFit: 'cover' }))}
                        >
                          {t.cover}
                        </Button>
                        <Button 
                          variant={siteSettings.logoFit === 'contain' ? 'default' : 'outline'}
                          size="xs"
                          className="flex-1"
                          onClick={() => setSiteSettings(prev => ({ ...prev, logoFit: 'contain' }))}
                        >
                          {t.contain}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <input 
                        type="checkbox" 
                        id="logoBgEnabled"
                        checked={siteSettings.logoBgEnabled}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, logoBgEnabled: e.target.checked }))}
                      />
                      <Label htmlFor="logoBgEnabled" className="text-xs">{t.logoBgEnabled}</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-brand-rose uppercase tracking-widest border-b pb-2">{language === 'ar' ? 'إدارة الفريق' : language === 'fr' ? 'Gestion d\'Équipe' : 'Team Management'}</h4>
                <div className="grid gap-2">
                  <Label>{t.coworkers}</Label>
                  <Textarea 
                    value={siteSettings.coworkers?.join(', ')}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, coworkers: e.target.value.split(',').map(email => email.trim()).filter(email => email) }))}
                    placeholder="coworker1@gmail.com, coworker2@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-brand-rose uppercase tracking-widest border-b pb-2">{language === 'ar' ? 'شريط التنقل' : language === 'fr' ? 'Barre de Navigation' : 'Navigation Bar'}</h4>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs">{language === 'ar' ? 'لون خلفية شريط التنقل' : language === 'fr' ? 'Fond de la barre de navigation' : 'Nav Bar Background'}</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color"
                        value={siteSettings.navBg.startsWith('rgba') ? '#fdf2f4' : siteSettings.navBg}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, navBg: e.target.value }))}
                        className="w-12 h-10 p-1"
                      />
                      <Input 
                        value={siteSettings.navBg}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, navBg: e.target.value }))}
                        className="flex-1"
                        placeholder="rgba(253, 242, 244, 0.8)"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setSiteSettings(prev => ({ ...prev, navBg: 'rgba(253, 242, 244, 0.8)' }))}
                        title={language === 'ar' ? 'إعادة ضبط' : language === 'fr' ? 'Réinitialiser' : 'Reset'}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-brand-rose uppercase tracking-widest border-b pb-2">{language === 'ar' ? 'خيارات الطلب' : language === 'fr' ? 'Options de Commande' : 'Order Options'}</h4>
                <div className="flex items-center gap-2 p-3 bg-brand-rose/5 rounded-lg border border-brand-rose/10">
                  <input 
                    type="checkbox" 
                    id="checkoutDirectly"
                    checked={siteSettings.checkoutDirectly}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, checkoutDirectly: e.target.checked }))}
                    className="w-4 h-4 rounded border-brand-rose/20 text-brand-rose focus:ring-brand-rose"
                  />
                  <div className="grid gap-0.5">
                    <Label htmlFor="checkoutDirectly" className="text-xs font-bold">{t.checkoutDirectly}</Label>
                    <p className="text-[10px] text-brand-ink/60">{t.checkoutDirectlyHint}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-brand-rose uppercase tracking-widest border-b pb-2">{language === 'ar' ? 'إعدادات الشريط المتحرك' : language === 'fr' ? 'Paramètres du Bandeau' : 'Marquee Settings'}</h4>
                <div className="grid gap-4">
                  <div className="grid gap-2 p-3 bg-brand-rose/5 rounded-lg border border-brand-rose/10">
                    <Label className="text-xs font-bold">{language === 'ar' ? 'شريط النصوص' : language === 'fr' ? 'Bandeau de Texte' : 'Text Marquee'}</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {(['top', 'bottom', 'none'] as const).map(pos => (
                        <Button
                          key={pos}
                          variant={siteSettings.marqueePosition === pos ? 'default' : 'outline'}
                          size="xs"
                          onClick={() => setSiteSettings(prev => ({ ...prev, marqueePosition: pos }))}
                        >
                          {pos.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                    <Input 
                      className="mt-2"
                      value={siteSettings.marqueeText}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, marqueeText: e.target.value }))}
                      placeholder={language === 'ar' ? 'نص الشريط...' : language === 'fr' ? 'Texte du bandeau...' : 'Marquee text...'}
                    />
                  </div>

                  <div className="grid gap-2 p-3 bg-brand-rose/5 rounded-lg border border-brand-rose/10">
                    <Label className="text-xs font-bold">{language === 'ar' ? 'شريط الصور' : language === 'fr' ? 'Bandeau d\'Images' : 'Image Marquee'}</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {(['top', 'bottom', 'none'] as const).map(pos => (
                        <Button
                          key={pos}
                          variant={siteSettings.imageMarqueePosition === pos ? 'default' : 'outline'}
                          size="xs"
                          onClick={() => setSiteSettings(prev => ({ ...prev, imageMarqueePosition: pos }))}
                        >
                          {pos.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant={siteSettings.imageMarqueeDirection === 'left' ? 'default' : 'outline'}
                        size="xs"
                        className="flex-1"
                        onClick={() => setSiteSettings(prev => ({ ...prev, imageMarqueeDirection: 'left' }))}
                      >
                        LEFT
                      </Button>
                      <Button
                        variant={siteSettings.imageMarqueeDirection === 'right' ? 'default' : 'outline'}
                        size="xs"
                        className="flex-1"
                        onClick={() => setSiteSettings(prev => ({ ...prev, imageMarqueeDirection: 'right' }))}
                      >
                        RIGHT
                      </Button>
                    </div>
                    <div className="grid gap-2 mt-2">
                      <Label className="text-[10px]">{language === 'ar' ? 'رفع صور للشريط' : language === 'fr' ? 'Uploader des images pour le bandeau' : 'Upload images for marquee'}</Label>
                      <Input 
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              showNotification('Uploading...', 'info');
                              const storageRef = ref(storage, `marquee/${Date.now()}-${file.name}`);
                              const snapshot = await uploadBytes(storageRef, file);
                              const url = await getDownloadURL(snapshot.ref);
                              setSiteSettings(prev => ({ 
                                ...prev, 
                                imageMarqueeUrls: prev.imageMarqueeUrls ? `${prev.imageMarqueeUrls}, ${url}` : url 
                              }));
                              showNotification('Uploaded!', 'success');
                            } catch (err) {
                              showNotification('Upload failed', 'error');
                            }
                          }
                        }}
                      />
                    </div>
                    <Textarea 
                      className="mt-2 min-h-[80px]"
                      value={siteSettings.imageMarqueeUrls}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, imageMarqueeUrls: e.target.value }))}
                      placeholder="Image URLs (comma separated)..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-brand-rose uppercase tracking-widest border-b pb-2">{t.copyrightText}</h4>
                <div className="grid gap-4">
                  {(['en', 'fr', 'ar'] as const).map(lang => (
                    <div key={lang} className="grid gap-2 p-3 bg-brand-rose/5 rounded-lg border border-brand-rose/10">
                      <Label className="text-[10px] uppercase tracking-widest text-brand-rose">{lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'Arabic'}</Label>
                      <Input 
                        value={siteSettings.copyrightText[lang]}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, copyrightText: { ...prev.copyrightText, [lang]: e.target.value } }))}
                        placeholder="e.g. N&S Creations 2024 • All rights reserved."
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-brand-rose uppercase tracking-widest border-b pb-2">{t.deliveryPrices}</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs">{t.deliveryBureau}</Label>
                    <Input 
                      type="number"
                      value={siteSettings.deliveryPrices.bureau}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, deliveryPrices: { ...prev.deliveryPrices, bureau: parseInt(e.target.value) || 0 } }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs">{t.deliveryDomicile}</Label>
                    <Input 
                      type="number"
                      value={siteSettings.deliveryPrices.domicile}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, deliveryPrices: { ...prev.deliveryPrices, domicile: parseInt(e.target.value) || 0 } }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs">{t.deliveryRetour}</Label>
                    <Input 
                      type="number"
                      value={siteSettings.deliveryPrices.retour}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, deliveryPrices: { ...prev.deliveryPrices, retour: parseInt(e.target.value) || 0 } }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-brand-rose uppercase tracking-widest border-b pb-2">{t.colorShades}</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(siteSettings.colorMap).map(([name, hex]) => (
                    <div key={name} className="flex items-center gap-2 p-2 bg-brand-rose/5 rounded-lg border border-brand-rose/10">
                      <Input 
                        type="color"
                        value={hex}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, colorMap: { ...prev.colorMap, [name]: e.target.value } }))}
                        className="w-8 h-8 p-1 rounded-md"
                      />
                      <Input 
                        value={name}
                        onChange={(e) => {
                          const newMap = { ...siteSettings.colorMap };
                          delete newMap[name];
                          newMap[e.target.value] = hex;
                          setSiteSettings(prev => ({ ...prev, colorMap: newMap }));
                        }}
                        className="h-8 text-xs"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-brand-rose"
                        onClick={() => {
                          const newMap = { ...siteSettings.colorMap };
                          delete newMap[name];
                          setSiteSettings(prev => ({ ...prev, colorMap: newMap }));
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="h-10 border-dashed border-brand-rose/20 text-brand-rose text-xs"
                    onClick={() => setSiteSettings(prev => ({ ...prev, colorMap: { ...prev.colorMap, 'New Color': '#000000' } }))}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Color
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-brand-rose uppercase tracking-widest border-b pb-2">{t.wilayaPrices}</h4>
                <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto p-2 border border-brand-rose/10 rounded-xl bg-brand-rose/5">
                  {WILAYAS.map(w => (
                    <div key={w.id} className="p-3 bg-white rounded-lg border border-brand-rose/10 space-y-3">
                      <div className="flex items-center justify-between border-b border-brand-rose/5 pb-2">
                        <Label className="font-bold text-brand-ink">{w.id} - {w.name}</Label>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="grid gap-1">
                          <Label className="text-[10px] uppercase text-brand-ink/60">{t.bureauPrice}</Label>
                          <Input 
                            type="number"
                            className="h-8 text-xs"
                            value={siteSettings.wilayaPrices[w.id]?.bureau || 0}
                            onChange={(e) => setSiteSettings(prev => ({ 
                              ...prev, 
                              wilayaPrices: { 
                                ...prev.wilayaPrices, 
                                [w.id]: { ...prev.wilayaPrices[w.id], bureau: parseInt(e.target.value) || 0 } 
                              } 
                            }))}
                          />
                        </div>
                        <div className="grid gap-1">
                          <Label className="text-[10px] uppercase text-brand-ink/60">{t.domicilePrice}</Label>
                          <Input 
                            type="number"
                            className="h-8 text-xs"
                            value={siteSettings.wilayaPrices[w.id]?.domicile || 0}
                            onChange={(e) => setSiteSettings(prev => ({ 
                              ...prev, 
                              wilayaPrices: { 
                                ...prev.wilayaPrices, 
                                [w.id]: { ...prev.wilayaPrices[w.id], domicile: parseInt(e.target.value) || 0 } 
                              } 
                            }))}
                          />
                        </div>
                        <div className="grid gap-1">
                          <Label className="text-[10px] uppercase text-brand-ink/60">{t.retourPrice}</Label>
                          <Input 
                            type="number"
                            className="h-8 text-xs"
                            value={siteSettings.wilayaPrices[w.id]?.retour || 0}
                            onChange={(e) => setSiteSettings(prev => ({ 
                              ...prev, 
                              wilayaPrices: { 
                                ...prev.wilayaPrices, 
                                [w.id]: { ...prev.wilayaPrices[w.id], retour: parseInt(e.target.value) || 0 } 
                              } 
                            }))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-brand-rose uppercase tracking-widest border-b pb-2">{t.brandColors}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>{language === 'ar' ? 'الخلفية (وردي فاتح)' : language === 'fr' ? 'Arrière-plan (Rose Clair)' : 'Background (Light Pink)'}</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        className="w-12 h-10 p-1"
                        value={siteSettings.colors.pinkLight}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, colors: { ...prev.colors, pinkLight: e.target.value } }))}
                      />
                      <Input 
                        value={siteSettings.colors.pinkLight}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, colors: { ...prev.colors, pinkLight: e.target.value } }))}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>{language === 'ar' ? 'تأكيد (وردي)' : language === 'fr' ? 'Accent (Rose)' : 'Accent (Pink)'}</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        className="w-12 h-10 p-1"
                        value={siteSettings.colors.pink}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, colors: { ...prev.colors, pink: e.target.value } }))}
                      />
                      <Input 
                        value={siteSettings.colors.pink}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, colors: { ...prev.colors, pink: e.target.value } }))}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>{language === 'ar' ? 'أساسي (وردي غامق)' : language === 'fr' ? 'Primaire (Rose)' : 'Primary (Rose)'}</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        className="w-12 h-10 p-1"
                        value={siteSettings.colors.rose}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, colors: { ...prev.colors, rose: e.target.value } }))}
                      />
                      <Input 
                        value={siteSettings.colors.rose}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, colors: { ...prev.colors, rose: e.target.value } }))}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>{language === 'ar' ? 'نص (حبري)' : language === 'fr' ? 'Texte (Encre)' : 'Text (Ink)'}</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        className="w-12 h-10 p-1"
                        value={siteSettings.colors.ink}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, colors: { ...prev.colors, ink: e.target.value } }))}
                      />
                      <Input 
                        value={siteSettings.colors.ink}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, colors: { ...prev.colors, ink: e.target.value } }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-brand-rose uppercase tracking-widest border-b pb-2">{language === 'ar' ? 'شريط الإعلانات المتحرك' : language === 'fr' ? 'Bandeau Défilant' : 'Marquee Banner'}</h4>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>{language === 'ar' ? 'موقع الشريط' : language === 'fr' ? 'Position du bandeau' : 'Marquee Position'}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['none', 'top', 'bottom'] as const).map(pos => (
                        <Button
                          key={pos}
                          variant={siteSettings.marqueePosition === pos ? 'default' : 'outline'}
                          onClick={() => setSiteSettings(prev => ({ ...prev, marqueePosition: pos }))}
                          className="text-[10px]"
                        >
                          {pos.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>{language === 'ar' ? 'نص الشريط' : language === 'fr' ? 'Texte du bandeau' : 'Marquee Text'}</Label>
                    <Input 
                      value={siteSettings.marqueeText}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, marqueeText: e.target.value }))}
                      placeholder="Free delivery on orders over 5000 DZD!"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-brand-rose uppercase tracking-widest border-b pb-2">{language === 'ar' ? 'قواعد الدفع' : language === 'fr' ? 'Règles de Paiement' : 'Payment Rules'}</h4>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>{language === 'ar' ? 'الفئات التي تتطلب دفع مسبق' : language === 'fr' ? 'Catégories nécessitant un paiement à l\'avance' : 'Categories requiring pre-payment'}</Label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <Button
                          key={cat}
                          variant={siteSettings.forcePrepayCategories.includes(cat) ? 'default' : 'outline'}
                          onClick={() => {
                            setSiteSettings(prev => {
                              const exists = prev.forcePrepayCategories.includes(cat);
                              return {
                                ...prev,
                                forcePrepayCategories: exists 
                                  ? prev.forcePrepayCategories.filter(c => c !== cat)
                                  : [...prev.forcePrepayCategories, cat]
                              };
                            });
                          }}
                          className="text-[10px]"
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-brand-rose uppercase tracking-widest border-b pb-2">{language === 'ar' ? 'حالة التخزين' : language === 'fr' ? 'État du Stockage' : 'Storage Status'}</h4>
                <div className="bg-brand-rose/5 p-4 rounded-xl border border-brand-rose/10">
                  {(() => {
                    const productsSize = JSON.stringify(products).length;
                    const settingsSize = JSON.stringify(siteSettings).length;
                    const totalSize = productsSize + settingsSize;
                    const limit = 1000000; // 1MB limit for safety in Firestore
                    const percentage = Math.min(100, (totalSize / limit) * 100);
                    
                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-brand-ink/60">
                          <span>{language === 'ar' ? 'استهلاك البيانات' : language === 'fr' ? 'Consommation de données' : 'Data Consumption'}</span>
                          <span>{Math.round(totalSize / 1024)} KB / 1024 KB</span>
                        </div>
                        <div className="w-full h-2 bg-brand-rose/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-orange-500' : 'bg-brand-rose'}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-brand-ink/40 italic">
                          {language === 'ar' ? 'ملاحظة: استخدام روابط الصور (URL) بدلاً من الرفع المباشر يقلل من استهلاك التخزين بشكل كبير.' : language === 'fr' ? 'Note : L\'utilisation d\'URL d\'images au lieu de les télécharger réduit considérablement l\'utilisation du stockage.' : 'Note: Using image URLs instead of direct uploads significantly reduces storage usage.'}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSettingsSave} className="bg-brand-rose text-white">
                {t.saveSettings}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
          <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-brand-ink text-center">{t.deleteArticle}</DialogTitle>
            </DialogHeader>
            <div className="py-6 text-center">
              <p className="text-brand-ink/70 text-lg">{language === 'ar' ? 'هل أنت متأكد أنك تريد حذف هذا المقال؟' : language === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cet article ?' : 'Are you sure you want to delete this article?'}</p>
              <p className="text-brand-ink/40 text-sm mt-2 font-light italic">{language === 'ar' ? 'لا يمكن التراجع عن هذا الإجراء.' : language === 'fr' ? 'Cette action ne peut pas être annulée.' : 'This action cannot be undone.'}</p>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                variant="outline" 
                onClick={() => setProductToDelete(null)} 
                className="flex-1 h-12 rounded-full border-brand-rose/20 text-brand-ink hover:bg-brand-rose/5"
              >
                {t.cancel}
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => productToDelete && deleteProduct(productToDelete)} 
                className="flex-1 h-12 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
              >
                {t.deleteArticle}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
        }}>
          <DialogContent className="sm:max-w-[500px] bg-brand-pink-light h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
            <div className="p-6 pb-2 shrink-0">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif text-brand-ink">{t.editArticle}</DialogTitle>
              </DialogHeader>
            </div>
            {editingProduct && (
              <div className="flex-1 overflow-y-auto px-6">
                <div className="grid gap-4 py-4 pb-20">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="edit-name">{t.articleName} (Default)</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 text-[10px] bg-brand-rose/10 text-brand-rose border-brand-rose/20 hover:bg-brand-rose hover:text-white"
                      onClick={() => handleAutoFillAI(true)}
                      disabled={isGeneratingAI}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      {isGeneratingAI ? 'Generating...' : 'Auto-Fill with AI'}
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Input 
                      id="edit-name" 
                      value={editingProduct.name} 
                      onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                    />
                  </div>

                  <div className="space-y-4 p-4 bg-brand-rose/5 rounded-xl border border-brand-rose/10">
                    <Label className="text-brand-rose font-bold uppercase tracking-widest text-[10px]">{language === 'ar' ? 'الأسماء المترجمة' : language === 'fr' ? 'Noms Localisés' : 'Localized Names'}</Label>
                    {(['en', 'fr', 'ar'] as const).map(lang => (
                      <div key={lang} className="grid gap-1.5">
                        <Label className="text-[10px] opacity-60">{lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'Arabic'}</Label>
                        <Input 
                          value={editingProduct.localizedName?.[lang] || ''}
                          onChange={(e) => setEditingProduct(prev => prev ? ({ 
                            ...prev, 
                            localizedName: { ...(prev.localizedName || {}), [lang]: e.target.value } 
                          }) : null)}
                          placeholder={`${t.articleName} (${lang})`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-price">{t.price} (DZD)</Label>
                      <Input 
                        id="edit-price" 
                        type="number"
                        value={editingProduct.price} 
                        onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, price: Number(e.target.value) }) : null)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-category">{t.category}</Label>
                      <select 
                        id="edit-category"
                        className="flex h-10 w-full rounded-md border border-brand-rose/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose"
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, category: e.target.value as any }) : null)}
                      >
                        <option value="Art">Art</option>
                        <option value="Prayer Set">Prayer Set</option>
                        <option value="Jewelry">Jewelry</option>
                      </select>
                    </div>
                    {editingProduct.category === 'Prayer Set' && (
                      <div className="grid gap-2">
                        <Label htmlFor="edit-subCategory">{t.subCategory}</Label>
                        <select 
                          id="edit-subCategory"
                          className="flex h-10 w-full rounded-md border border-brand-rose/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose"
                          value={editingProduct.subCategory || ''}
                          onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, subCategory: e.target.value }) : null)}
                        >
                          <option value="">None</option>
                          <option value="Abayas">Abayas</option>
                          <option value="Prayer Set Box">Prayer Set Box</option>
                          <option value="Prayer Fit">Prayer Fit</option>
                        </select>
                      </div>
                    )}
                    {editingProduct.category === 'Art' && (
                      <div className="grid gap-2">
                        <Label htmlFor="edit-measure">{t.measure}</Label>
                        <Input 
                          id="edit-measure"
                          value={editingProduct.measure || ''}
                          onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, measure: e.target.value }) : null)}
                          placeholder="e.g. 50x70 cm"
                        />
                      </div>
                    )}
                    {editingProduct.subCategory === 'Prayer Fit' && (
                      <div className="grid gap-2">
                        <Label htmlFor="edit-age">{t.age}</Label>
                        <Input 
                          id="edit-age"
                          value={editingProduct.age || ''}
                          onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, age: e.target.value }) : null)}
                          placeholder="e.g. 6-12 years"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-brand-rose/5 rounded-xl border border-brand-rose/10">
                      <input 
                        type="checkbox" 
                        id="edit-isSoldOut"
                        checked={editingProduct.isSoldOut || false}
                        onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, isSoldOut: e.target.checked }) : null)}
                        className="w-4 h-4 rounded border-brand-rose/20 text-brand-rose focus:ring-brand-rose"
                      />
                      <Label htmlFor="edit-isSoldOut" className="text-xs font-bold">{t.isSoldOut}</Label>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-brand-rose/5 rounded-xl border border-brand-rose/10">
                      <input 
                        type="checkbox" 
                        id="edit-requiresCustomDimensions"
                        checked={editingProduct.requiresCustomDimensions || false}
                        onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, requiresCustomDimensions: e.target.checked }) : null)}
                        className="w-4 h-4 rounded border-brand-rose/20 text-brand-rose focus:ring-brand-rose"
                      />
                      <Label htmlFor="edit-requiresCustomDimensions" className="text-xs font-bold">{t.requiresCustomDimensions}</Label>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-brand-rose/5 rounded-xl border border-brand-rose/10">
                      <input 
                        type="checkbox" 
                        id="edit-requiresDescription"
                        checked={editingProduct.requiresDescription || false}
                        onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, requiresDescription: e.target.checked }) : null)}
                        className="w-4 h-4 rounded border-brand-rose/20 text-brand-rose focus:ring-brand-rose"
                      />
                      <Label htmlFor="edit-requiresDescription" className="text-xs font-bold">{t.requiresDescription}</Label>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit-availableDimensions">{t.availableDimensions} (Comma separated)</Label>
                    <Input 
                      id="edit-availableDimensions" 
                      value={editingProduct.availableDimensions?.join(', ') || ''} 
                      onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, availableDimensions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }) : null)}
                      placeholder="30x40cm, 50x70cm, 100x120cm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-image">{t.mainImage}</Label>
                    <p className="text-[10px] text-brand-ink/50 italic leading-tight">
                      {language === 'ar' ? 'للحصول على أفضل جودة وتجنب حدود التخزين، قم بلصق روابط الصور (مثل Imgur) بدلاً من الرفع.' : language === 'fr' ? 'Pour une meilleure qualité et éviter les limites, collez des liens d\'images (ex: Imgur) au lieu de télécharger.' : 'For best quality and to avoid storage limits, paste image URLs (e.g. from Imgur) instead of uploading.'}
                    </p>
                    <div className="flex gap-2">
                      <Input 
                        id="edit-image" 
                        value={editingProduct.image} 
                        onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, image: e.target.value }) : null)}
                        className="flex-1"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer w-10"
                          onChange={(e) => handleImageUpload(e, 'image', true)}
                        />
                        <Button variant="outline" size="icon" className="w-10 border-brand-rose/20">
                          <ImageIcon className="w-4 h-4 text-brand-rose" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">{t.description} (Default)</Label>
                    <Textarea 
                      id="edit-description" 
                      value={editingProduct.description} 
                      onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                    />
                  </div>

                  <div className="space-y-4 p-4 bg-brand-rose/5 rounded-xl border border-brand-rose/10">
                    <Label className="text-brand-rose font-bold uppercase tracking-widest text-[10px]">{language === 'ar' ? 'الأوصاف المترجمة' : language === 'fr' ? 'Descriptions Localisées' : 'Localized Descriptions'}</Label>
                    {(['en', 'fr', 'ar'] as const).map(lang => (
                      <div key={lang} className="grid gap-1.5">
                        <Label className="text-[10px] opacity-60">{lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'Arabic'}</Label>
                        <Textarea 
                          value={editingProduct.localizedDescription?.[lang] || ''}
                          onChange={(e) => setEditingProduct(prev => prev ? ({ 
                            ...prev, 
                            localizedDescription: { ...(prev.localizedDescription || {}), [lang]: e.target.value } 
                          }) : null)}
                          placeholder={`${t.description} (${lang})`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-colors">{t.colors}</Label>
                    <Input 
                      id="edit-colors" 
                      value={editingProduct.colors?.join(', ') || ''} 
                      onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, colors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }) : null)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t.colorImages}</Label>
                    <div className="space-y-3">
                      {editingProduct.colors && editingProduct.colors.length > 0 ? (
                        <div className="grid gap-2">
                          {editingProduct.colors.map(color => (
                            <div key={color} className="flex flex-col gap-2 p-3 bg-white rounded-md border border-brand-rose/10">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full border border-black/10 shadow-sm" 
                                    style={{ backgroundColor: getColorHex(color) }}
                                  />
                                  <span className="text-sm font-medium">{color}</span>
                                </div>
                                <div className="flex gap-2">
                                  <div className="relative">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="absolute inset-0 opacity-0 cursor-pointer w-8"
                                      onChange={(e) => handleImageUpload(e, color, true)}
                                    />
                                    <Button variant="ghost" size="icon" className="w-8 h-8 text-brand-rose">
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {editingProduct.colorImages?.[color] && Array.isArray(editingProduct.colorImages[color]) && editingProduct.colorImages[color].map((img, idx) => (
                                  <div key={idx} className="relative w-12 h-12 rounded overflow-hidden border border-brand-rose/10 group">
                                    <img src={img || undefined} alt={`${color} ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    <button 
                                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                      onClick={() => {
                                        const current = [...(editingProduct.colorImages?.[color] || [])];
                                        current.splice(idx, 1);
                                        setEditingProduct(prev => prev ? ({
                                          ...prev,
                                          colorImages: { ...prev.colorImages, [color]: current }
                                        }) : null);
                                      }}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                                <div className="flex items-center gap-2 w-full">
                                  <Input 
                                    placeholder={language === 'ar' ? 'الصق الرابط للإضافة...' : language === 'fr' ? 'Coller l\'URL pour ajouter...' : 'Paste URL to add...'}
                                    className="h-8 text-xs flex-1"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        const url = (e.target as HTMLInputElement).value;
                                        if (url) {
                                          const current = Array.isArray(editingProduct.colorImages?.[color]) ? [...(editingProduct.colorImages?.[color] || [])] : [];
                                          setEditingProduct(prev => prev ? ({
                                            ...prev,
                                            colorImages: { ...prev.colorImages, [color]: [...current, url] }
                                          }) : null);
                                          (e.target as HTMLInputElement).value = '';
                                        }
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-brand-ink/40 italic">{language === 'ar' ? 'أضف ألوانًا أعلاه لتحميل صور محددة لها.' : language === 'fr' ? 'Ajoutez des couleurs ci-dessus pour télécharger des images spécifiques.' : 'Add colors above to upload specific images for them.'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="p-6 pt-2 bg-brand-pink-light border-t border-brand-rose/10 shrink-0">
              <DialogFooter>
                <Button 
                  className="w-full bg-brand-rose text-white h-12 rounded-full font-bold uppercase tracking-widest text-xs"
                  onClick={handleUpdateProduct}
                >
                  {t.saveChanges}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Newsletter / CTA */}
        <section className="bg-brand-rose text-white py-24 px-6 mt-20">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-4xl md:text-5xl font-serif mb-6 italic">{t.followUsTitle}</h3>
            <p className="text-white/70 mb-10 text-lg font-light">
              {t.followUsSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {siteSettings.socialLinks.instagram && (
                <Button 
                  className="bg-white text-brand-rose hover:bg-brand-pink-light h-14 rounded-full px-8 font-bold uppercase tracking-widest text-xs w-full sm:w-auto"
                  onClick={() => window.open(siteSettings.socialLinks.instagram, '_blank')}
                >
                  <Instagram className="w-5 h-5 mr-2" />
                  {t.followOnInsta}
                </Button>
              )}
              {siteSettings.socialLinks.facebook && (
                <Button 
                  className="bg-white/10 text-white hover:bg-white/20 border border-white/20 h-14 rounded-full px-8 font-bold uppercase tracking-widest text-xs w-full sm:w-auto"
                  onClick={() => window.open(siteSettings.socialLinks.facebook, '_blank')}
                >
                  <Facebook className="w-5 h-5 mr-2" />
                  {t.followOnFacebook}
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-brand-rose/10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4" dir="ltr">
                <div 
                  className="flex items-center justify-center shrink-0 rounded-full overflow-hidden"
                  style={{ 
                    width: `${siteSettings.logoSize}px`, 
                    height: `${siteSettings.logoSize}px`, 
                    backgroundColor: siteSettings.logoBgEnabled ? siteSettings.logoBg : 'transparent',
                    backdropFilter: siteSettings.logoBgEnabled ? `blur(${siteSettings.logoBlur}px)` : 'none'
                  }}
                >
                  {siteSettings.logoImage ? (
                    <img 
                      src={siteSettings.logoImage || undefined} 
                      alt="Logo" 
                      className={`w-full h-full object-${siteSettings.logoFit} rounded-full`} 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <div className="w-full h-full bg-brand-pink rounded-full flex items-center justify-center shadow-sm border border-brand-rose/10 overflow-hidden">
                      <span className="font-bold text-2xl" style={{ color: siteSettings.logoColors.n }}>{siteSettings.siteName.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline leading-none">
                    <span className="font-bold text-3xl tracking-tighter" style={{ color: siteSettings.logoColors.n }}>{siteSettings.siteName.charAt(0)}</span>
                    <span className="font-bold text-3xl tracking-tighter" style={{ color: siteSettings.logoColors.amp }}>&</span>
                    <span className="font-bold text-3xl tracking-tighter" style={{ color: siteSettings.logoColors.s }}>{siteSettings.siteName.split(/[& ]/)[1]?.charAt(0) || ''}</span>
                  </div>
                  <span className="font-light italic text-xs text-brand-ink/80 tracking-[0.2em] uppercase -mt-1">
                    {siteSettings.siteName.split(/[& ]/).slice(siteSettings.siteName.includes('&') ? 2 : 1).join(' ')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-8 text-brand-rose/60 text-[10px] uppercase tracking-widest font-medium">
                <MapPin className="w-3 h-3" />
                <span>{t.weAreFromOran}</span>
              </div>
              <p className="text-brand-ink/60 max-w-sm mb-8 leading-relaxed">
                {siteSettings.footerDescription[language]}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                {siteSettings.socialLinks.instagram && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-brand-rose/5 text-brand-rose"
                    onClick={() => window.open(siteSettings.socialLinks.instagram, '_blank')}
                  >
                    <Instagram className="w-5 h-5" />
                  </Button>
                )}
                {siteSettings.socialLinks.facebook && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-brand-rose/5 text-brand-rose"
                    onClick={() => window.open(siteSettings.socialLinks.facebook, '_blank')}
                  >
                    <Facebook className="w-5 h-5" />
                  </Button>
                )}
                {siteSettings.socialLinks.tiktok && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-brand-rose/5 text-brand-rose"
                    onClick={() => window.open(siteSettings.socialLinks.tiktok, '_blank')}
                  >
                    <TikTokIcon className="w-5 h-5" />
                  </Button>
                )}
                {siteSettings.socialLinks.messenger && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-brand-rose/5 text-brand-rose"
                    onClick={() => window.open(siteSettings.socialLinks.messenger, '_blank')}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                )}
                {siteSettings.email && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-brand-rose/5 text-brand-rose"
                    onClick={() => window.open(`mailto:${siteSettings.email}`, '_blank')}
                  >
                    <Mail className="w-5 h-5" />
                  </Button>
                )}
                {siteSettings.phone && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-brand-rose/5 text-brand-rose"
                    onClick={() => window.open(`tel:${siteSettings.phone}`, '_blank')}
                  >
                    <Phone className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
            
            <div>
              <h5 className="font-bold uppercase tracking-widest text-xs mb-6 text-brand-ink">{language === 'ar' ? 'المتجر' : language === 'fr' ? 'Boutique' : 'Shop'}</h5>
              <ul className="space-y-4 text-sm text-brand-ink/60">
                <li><button onClick={() => setSelectedCategory(null)} className="hover:text-brand-rose transition-colors">{t.allCreations}</button></li>
                {categories.map(cat => (
                  <li key={cat}><button onClick={() => setSelectedCategory(cat)} className="hover:text-brand-rose transition-colors">{cat}</button></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-widest text-xs mb-6 text-brand-ink">{t.support}</h5>
              <ul className="space-y-4 text-sm text-brand-ink/60">
                <li><button className="hover:text-brand-rose transition-colors">{t.shippingPolicy}</button></li>
                <li><button className="hover:text-brand-rose transition-colors">{t.returnsExchanges}</button></li>
                <li><button className="hover:text-brand-rose transition-colors">{t.contactUs}</button></li>
                <li><button className="hover:text-brand-rose transition-colors">{t.faqs}</button></li>
              </ul>
            </div>
          </div>
        </div>
        
        <ImageMarquee position="bottom" />
        <Marquee position="bottom" />

        <div className="max-w-7xl mx-auto px-6">
            <p>{siteSettings.copyrightText[language] || siteSettings.copyrightText.en}</p>
            <div className="flex items-center gap-6">
              <button 
                onClick={handleAdminToggle}
                disabled={isLoggingIn}
                className={`flex items-center gap-1 transition-colors ${isAdmin ? 'text-brand-rose' : 'hover:text-brand-rose'} ${isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Settings className={`w-3 h-3 ${isLoggingIn ? 'animate-spin' : ''}`} />
                {isLoggingIn ? '...' : (isAdmin ? t.adminModeOn : t.adminMode)}
              </button>
              {isAdmin && (
                <button 
                  onClick={() => setIsOrdersViewOpen(true)}
                  className="hover:text-brand-rose transition-colors flex items-center gap-1"
                >
                  <ShoppingBag className="w-3 h-3" />
                  {t.viewOrders}
                </button>
              )}
              <button className="hover:text-brand-rose transition-colors">{t.privacyPolicy}</button>
              <button className="hover:text-brand-rose transition-colors">{t.termsOfService}</button>
            </div>
          </div>
      </footer>
    </div>
  );
}
