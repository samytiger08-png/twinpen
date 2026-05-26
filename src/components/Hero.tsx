import { useState } from 'react';
import { Sparkles, Shield, Award, Truck, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import OrderForm from './OrderForm';
import { Order } from '../types';

const PRODUCT_IMAGES = [
  "https://i.ibb.co/bgHytGh0/8-EB496-F8-2602-4-D9-F-A8-D4-1-DA4-B3-EC4120.png",
  "https://i.ibb.co/r91b2zN/733-D2-D7-C-53-C7-48-DD-AD3-D-BF7-D78-C6314-C.png",
  "https://i.ibb.co/tM8vGGmP/AD41-E3-DE-ED79-416-A-BADB-5983-C2211-B07.png",
  "https://i.ibb.co/p5FBt70/F231678-D-AA39-4-F88-9-F0-C-BE2-C70-EE5-CED.png",
  "https://i.ibb.co/BHWLnqMC/2-F7-FB372-0-EE7-4736-8-DC1-3270259-B85-A5.png"
];

const ANGLE_LABELS = [
  "المنظور الرئيسي",
  "تفصيلية الرأس الثاني",
  "وضعية الكتابة الورقية",
  "وضعية استخدام التابلت",
  "التغليف والمظهر العام"
];

interface HeroProps {
  onOrderSuccess: (order: Order) => void;
}

export default function Hero({ onOrderSuccess }: HeroProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % PRODUCT_IMAGES.length);
  };

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length);
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-12 md:pt-10 md:pb-16">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 right-0 -z-10 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />
      <div className="absolute bottom-10 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Core Direct Top Header Copy (Arabic RTL) */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 rounded-full glass-pill px-4 py-1.5 text-xs text-blue-400">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span className="font-semibold font-sans">قلم كلاسيكي وقلم ذكي في جهاز واحد</span>
          </div>

          {/* Simple Direct Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            قلم واحد للورق والشاشة
          </h1>

          {/* Sincere Subheadline */}
          <p className="text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            اكتب على الورق واستعمله على الهاتف والتابلت بسهولة، بدون شحن أو بطارية.
          </p>

          {/* Centered Symmetrical Trust Badges Inline Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300">
              <Truck className="h-3.5 w-3.5 text-blue-400" />
              <span className="font-medium">توصيل متوفر لجميع ولايات الجزائر</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-medium">الدفع عند الاستلام بعد فحص القلم</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300">
              <Award className="h-3.5 w-3.5 text-indigo-400" />
              <span className="font-medium">ضمان الجودة والاستبدال الفوري</span>
            </div>
          </div>
        </div>

        {/* Structured Grid: Gallery First, OrderForm Second */}
        <div id="hero-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1 (RTL Right side on Desktop): Interactive Gallery & Quick Dropdown Info */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Gallery Frame */}
            <div className="relative overflow-hidden rounded-3xl glass-panel p-2 shadow-2xl group border border-white/5">
              <div className="absolute top-3 left-3 z-10 rounded-lg glass-pill px-2.5 py-1 text-[11px] font-mono tracking-wider text-blue-400 border border-white/5">
                صورة حقيقية للمنتج 📸
              </div>

              <div id="gallery-main-container" className="relative aspect-square w-full rounded-2xl bg-black/20 border border-white/5 flex items-center justify-center p-4">
                {/* Symmetrical Centered Premium Slide Buttons */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="group/btn absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-950/65 backdrop-blur-xl border border-white/15 hover:border-blue-400/50 text-white shadow-[0_4px_20px_rgba(0,0,0,0.5),_0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.6),_0_0_25px_rgba(59,130,246,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none cursor-pointer"
                  aria-label="Next Image"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-slate-100 group-hover/btn:text-blue-400 group-hover/btn:-translate-x-0.5 transition-all duration-300" />
                </button>

                <button
                  type="button"
                  onClick={handlePrev}
                  className="group/btn absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-950/65 backdrop-blur-xl border border-white/15 hover:border-blue-400/50 text-white shadow-[0_4px_20px_rgba(0,0,0,0.5),_0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.6),_0_0_25px_rgba(59,130,246,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none cursor-pointer"
                  aria-label="Previous Image"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-slate-100 group-hover/btn:text-blue-400 group-hover/btn:translate-x-0.5 transition-all duration-300" />
                </button>

                <motion.img
                  key={activeImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={PRODUCT_IMAGES[activeImageIndex]}
                  alt={`N1 TWINPEN - ${ANGLE_LABELS[activeImageIndex]}`}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain mx-auto"
                />
              </div>
            </div>

            {/* Thumbnail Images Selector */}
            <div id="gallery-thumbnails" className="grid grid-cols-5 gap-2">
              {PRODUCT_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-square rounded-xl overflow-hidden bg-black/20 border-2 flex items-center justify-center p-1 transition-all ${
                    idx === activeImageIndex
                      ? 'border-blue-500 shadow-md shadow-blue-500/20 scale-105'
                      : 'border-white/10 hover:border-white/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`N1 TWINPEN Thumb ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Compact Pen Info Dropdown Option */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-950/40 backdrop-blur-md hover:bg-slate-900/60 text-white font-bold transition-all duration-300 border border-white/10 group cursor-pointer shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Menu className="h-5 w-5 text-blue-400 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="text-sm">معلومات ومواصفات القلم المقرب</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {isDropdownOpen ? '▲ إغلاق' : '▼ تفاصيل سريعة'}
                </span>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2.5 p-4 rounded-2xl bg-slate-950/60 backdrop-blur-xl border border-blue-500/15 shadow-[0_4px_25px_rgba(59,130,246,0.1)]">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right text-xs text-slate-200">
                        <li className="flex items-center gap-2 justify-start">
                          <span className="text-blue-400 font-bold">✦</span>
                          <span>قلم 4 في 1 متميز</span>
                        </li>
                        <li className="flex items-center gap-2 justify-start">
                          <span className="text-blue-400 font-bold">✦</span>
                          <span>للكتابة السلسة على الورق</span>
                        </li>
                        <li className="flex items-center gap-2 justify-start">
                          <span className="text-blue-400 font-bold">✦</span>
                          <span>رأس لمسي ناعم للشاشات</span>
                        </li>
                        <li className="flex items-center gap-2 justify-start">
                          <span className="text-blue-400 font-bold">✦</span>
                          <span>متوافق مع كل الهواتف والتابلت</span>
                        </li>
                        <li className="flex items-center gap-2 justify-start">
                          <span className="text-blue-400 font-bold">✦</span>
                          <span>يعمل تماماً بدون شحن أو بطارية</span>
                        </li>
                        <li className="flex items-center gap-2 justify-start">
                          <span className="text-blue-400 font-bold">✦</span>
                          <span>تصميم معدني خفيف وسهل الاستعمال</span>
                        </li>
                        <li className="flex items-center gap-2 justify-start">
                          <span className="text-blue-400 font-bold">✦</span>
                          <span>الدفع آمن عند الاستلام</span>
                        </li>
                        <li className="flex items-center gap-2 justify-start">
                          <span className="text-blue-400 font-bold">✦</span>
                          <span>توصيل سريع لكافة ولايات الجزائر</span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Column 2 (RTL Left side on Desktop): Shorter Fast Order Card form */}
          <div className="lg:col-span-7">
            <OrderForm onOrderSuccess={onOrderSuccess} />
          </div>

        </div>

      </div>
    </section>
  );
}
