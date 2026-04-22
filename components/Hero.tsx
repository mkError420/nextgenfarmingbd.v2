'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowRight, Sparkles, ShieldCheck, Leaf, ShoppingBag, Plus, Tag, Loader2 } from 'lucide-react';

interface Banner {
  _id: string;
  title: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  position: string;
  order: number;
  isActive: boolean;
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselBanners, setCarouselBanners] = useState<Banner[]>([]);
  const [rightTopBanner, setRightTopBanner] = useState<Banner | null>(null);
  const [rightBottomBanner, setRightBottomBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners?isActive=true');
      const data = await res.json();
      const banners = data.banners || [];
      
      // Filter banners by position
      const carousel = banners
        .filter((b: Banner) => b.position === 'hero-carousel')
        .sort((a: Banner, b: Banner) => a.order - b.order);
      
      const rightTop = banners
        .filter((b: Banner) => b.position === 'hero-right-top')
        .sort((a: Banner, b: Banner) => a.order - b.order)[0] || null;
      
      const rightBottom = banners
        .filter((b: Banner) => b.position === 'hero-right-bottom')
        .sort((a: Banner, b: Banner) => a.order - b.order)[0] || null;
      
      setCarouselBanners(carousel);
      setRightTopBanner(rightTop);
      setRightBottomBanner(rightBottom);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (carouselBanners.length > 0) {
        setCurrentSlide((prev) => (prev + 1) % carouselBanners.length);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [carouselBanners.length]);

  // Fallback slides if no banners from database
  const fallbackSlides = [
    {
      id: 1,
      title: 'বিশুদ্ধতায় অনন্য,',
      highlight: 'স্বাদে সেরা',
      description: 'সরাসরি খামারীদের থেকে সংগৃহীত প্রিমিয়াম কোয়ালিটি পণ্য এখন আপনার হাতের নাগালে।',
      image: 'https://picsum.photos/seed/farm1/1200/800',
      bgColor: 'from-emerald-900 to-emerald-700',
      badge: '১০০% খাঁটি',
      icon: <ShieldCheck className="text-emerald-300" size={24} />,
      link: '/shop'
    },
    {
      id: 2,
      title: 'প্রাকৃতিক স্বাস্থ্য,',
      highlight: 'অর্গানিক মধু',
      description: 'সুন্দরবনের খাঁটি খলিশা ও গরাণ ফুলের মধু সংগ্রহ করুন সরাসরি আমাদের কাছ থেকে।',
      image: 'https://picsum.photos/seed/honey1/1200/800',
      bgColor: 'from-amber-800 to-orange-700',
      badge: 'অর্গানিক',
      icon: <Leaf className="text-amber-300" size={24} />,
      link: '/shop'
    },
    {
      id: 3,
      title: 'নিত্যপ্রয়োজনীয়',
      highlight: 'তাজা বাজার',
      description: 'ঘি, তেল থেকে শুরু করে সব ধরনের নিত্য প্রয়োজনীয় মুদি পণ্য পান এক জায়গায়।',
      image: 'https://picsum.photos/seed/grocery1/1200/800',
      bgColor: 'from-blue-900 to-indigo-700',
      badge: 'প্রিমিয়াম',
      icon: <Sparkles className="text-blue-300" size={24} />,
      link: '/shop'
    }
  ];

  const slides = carouselBanners.length > 0 ? carouselBanners.map((b, i) => ({
    id: b._id,
    title: b.title,
    highlight: b.title_en || '',
    description: b.description || '',
    image: isMobile && b.mobileImage ? b.mobileImage : b.image,
    bgColor: 'from-emerald-900 to-emerald-700',
    badge: 'বিশেষ অফার',
    icon: <ShieldCheck className="text-emerald-300" size={24} />,
    link: b.link
  })) : fallbackSlides;

  return (
    <section className="bg-brand-bg py-4 md:py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Animated Carousel Banner */}
        <div className="md:col-span-8 bg-slate-100 rounded-[2rem] overflow-hidden relative shadow-lg min-h-[350px] md:min-h-[450px] group">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentSlide}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ 
                x: { type: "spring", stiffness: 100, damping: 20 },
                duration: 0.5 
              }}
              className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].bgColor} flex items-center`}
            >
              <div className="absolute inset-0 opacity-20">
                <Image 
                  src={slides[currentSlide].image}
                  alt="Background"
                  fill
                  className="object-cover mix-blend-overlay"
                />
              </div>

              <div className="relative z-10 p-8 md:p-16 space-y-4 md:space-y-6 w-full max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 bg-black/10 backdrop-blur-sm w-fit px-4 py-1.5 rounded-full border border-white/10"
                >
                  {slides[currentSlide].icon}
                  <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-widest">{slides[currentSlide].badge}</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] italic">
                    {slides[currentSlide].title}<br />
                    <span className="text-emerald-300 drop-shadow-lg">{slides[currentSlide].highlight}</span>
                  </h1>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/80 text-sm md:text-lg italic font-medium max-w-sm"
                >
                  {slides[currentSlide].description}
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <Link href={slides[currentSlide].link || '/shop'} className="bg-white text-emerald-900 px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl hover:bg-emerald-50 transition-all flex items-center gap-2 group/btn">
                    এখনই কিনুন
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>

              {/* Decorative elements */}
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mb-20" />
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-16 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </div>
        
        {/* Right Side: Promo Banners */}
        <div className="md:col-span-4 flex flex-col gap-6 h-full min-h-[350px] md:min-h-0">
          {/* Top Banner */}
          <Link href={rightTopBanner?.link || '/offers'} className="flex-1 bg-gradient-to-br from-[#fff7ed] to-[#ffedd5] rounded-[2rem] p-6 relative overflow-hidden group border border-orange-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-center">
            {rightTopBanner ? (
              <>
                <div className="absolute inset-0 opacity-30">
                  <Image 
                    src={isMobile && rightTopBanner.mobileImage ? rightTopBanner.mobileImage : rightTopBanner.image}
                    alt={rightTopBanner.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="relative z-10 space-y-3 md:space-y-4">
                  <span className="bg-orange-500 text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-lg border border-orange-400 w-fit">
                     <Tag size={12} /> Special Offer
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-orange-950 italic leading-tight group-hover:scale-105 transition-transform origin-left">
                    {rightTopBanner.title}<br />
                    {rightTopBanner.title_en && <span className="text-orange-600 drop-shadow-sm">{rightTopBanner.title_en}</span>}
                  </h3>
                  {rightTopBanner.description && (
                    <div className="text-orange-800/80 text-xs md:text-sm font-black italic flex items-center gap-2 group-hover:translate-x-2 transition-transform w-fit bg-orange-500/10 px-4 py-2 rounded-xl">
                      {rightTopBanner.description} <ArrowRight size={16} />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="relative z-10 space-y-3 md:space-y-4">
                  <span className="bg-orange-500 text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-lg border border-orange-400 w-fit">
                     <Tag size={12} /> Super Sale
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-orange-950 italic leading-tight group-hover:scale-105 transition-transform origin-left">
                    গ্রীষ্মের সেরা অফার!<br />
                    <span className="text-orange-600 drop-shadow-sm">৫০% পর্যন্ত ছাড়</span>
                  </h3>
                  <div className="text-orange-800/80 text-xs md:text-sm font-black italic flex items-center gap-2 group-hover:translate-x-2 transition-transform w-fit bg-orange-500/10 px-4 py-2 rounded-xl">
                    বিস্তারিত দেখুন <ArrowRight size={16} />
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 w-40 h-40 md:w-48 md:h-48 opacity-80 group-hover:opacity-100 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                   <Image src="https://picsum.photos/seed/basket/400/400" alt="Sale" fill className="object-contain drop-shadow-2xl" referrerPolicy="no-referrer" />
                </div>
              </>
            )}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/60 blur-3xl rounded-full" />
          </Link>

          {/* Bottom Banner */}
          <Link href={rightBottomBanner?.link || '/shop'} className="flex-1 bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] rounded-[2rem] p-6 relative overflow-hidden group border border-green-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-center">
            {rightBottomBanner ? (
              <>
                <div className="absolute inset-0 opacity-30">
                  <Image 
                    src={isMobile && rightBottomBanner.mobileImage ? rightBottomBanner.mobileImage : rightBottomBanner.image}
                    alt={rightBottomBanner.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="relative z-10 space-y-3 md:space-y-4">
                  <span className="bg-brand-green text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-lg border border-emerald-500 w-fit">
                     <Leaf size={12} /> Fresh Arrival
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-emerald-950 italic leading-tight group-hover:scale-105 transition-transform origin-left">
                    {rightBottomBanner.title}<br />
                    {rightBottomBanner.title_en && <span className="text-brand-green drop-shadow-sm">{rightBottomBanner.title_en}</span>}
                  </h3>
                  {rightBottomBanner.description && (
                    <div className="text-emerald-800/80 text-xs md:text-sm font-black italic flex items-center gap-2 group-hover:translate-x-2 transition-transform w-fit bg-brand-green/10 px-4 py-2 rounded-xl">
                      {rightBottomBanner.description} <ArrowRight size={16} />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="relative z-10 space-y-3 md:space-y-4">
                  <span className="bg-brand-green text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-lg border border-emerald-500 w-fit">
                     <Leaf size={12} /> Fresh Arrival
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-emerald-950 italic leading-tight group-hover:scale-105 transition-transform origin-left">
                    সরাসরি বাগান থেকে<br />
                    <span className="text-brand-green drop-shadow-sm">তাজা ফলমূল</span>
                  </h3>
                  <div className="text-emerald-800/80 text-xs md:text-sm font-black italic flex items-center gap-2 group-hover:translate-x-2 transition-transform w-fit bg-brand-green/10 px-4 py-2 rounded-xl">
                    এখনই কিনুন <ArrowRight size={16} />
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 w-40 h-40 md:w-48 md:h-48 opacity-90 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                   <Image src="https://picsum.photos/seed/fruits2/400/400" alt="Fresh Fruits" fill className="object-cover rounded-full drop-shadow-2xl mix-blend-multiply" referrerPolicy="no-referrer" />
                </div>
              </>
            )}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/60 blur-3xl rounded-full" />
          </Link>
        </div>
      </div>
    </section>
  );
}
