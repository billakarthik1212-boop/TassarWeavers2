import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiMaximize2, FiHeart, FiStar, FiImage, FiAward } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import { getHomeLayoutSettings } from './AdminDashboard';
import pit_loom from '../assets/therawpitloom.jpeg';
import PHeritage from '../assets/PreservingHeritage.jpeg';

export default function Home() {
  const [layout, setLayout] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const syncDatabaseBanners = async () => {
      const cloudHomeLayout = await getHomeLayoutSettings();
      if (cloudHomeLayout) {
        setLayout({
          curatedTitle: cloudHomeLayout.curated_title,
          curatedSubtitle: cloudHomeLayout.curated_subtitle,
          curatedSlots: cloudHomeLayout.curated_slots || [],
          newArrivalsTitle: cloudHomeLayout.new_arrivals_title,
          newArrivalsSubtitle: cloudHomeLayout.new_arrivals_subtitle,
          newArrivalSlots: cloudHomeLayout.new_arrival_slots || []
        });
      }
    };
    syncDatabaseBanners();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const navigateToShopProduct = (productId) => navigate('/shop', { state: { highlightProductId: Number(productId) } });
  const navigateToShopCategory = (categoryName) => navigate('/shop', { state: { autoFilterCategory: categoryName } });

  if (!layout) return <div className="min-h-screen bg-mart-stone" />;

  return (
    <motion.div initial="hidden" animate="visible" className="bg-mart-stone relative">

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center pt-24 w-full">
          <div className="lg:col-span-7 text-left">
            <motion.span variants={fadeUp} className="text-xs uppercase tracking-[0.3em] text-mart-emerald font-bold mb-4 block">
              ✦ Authentic Rural Indian Craftsmanship
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-display text-mart-dark font-medium leading-[1.1]">
              Tradition in <br />
              <span className="font-serif italic text-mart-emerald font-light">every single</span> Thread.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-base text-mart-dark/80 font-sans leading-relaxed max-w-lg">
              Every thread of wild silk is harvested, spun, and interlaced on heritage pit-looms to create individual masterpieces.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex gap-4">
              <Link to="/shop">
                <button className="px-8 py-4 bg-mart-dark text-mart-stone font-bold tracking-widest text-xs uppercase hover:bg-mart-emerald transition-colors shadow-lg">
                  Explore Collection
                </button>
              </Link>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-5 w-full max-w-sm mx-auto">
            <div className="aspect-[4/5] bg-mart-dark p-8 flex flex-col justify-between text-mart-stone shadow-2xl relative overflow-hidden group border border-mart-soft">
              <img src={pit_loom} alt="Pit Loom" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
              <div className="relative z-10 flex justify-between items-start">
                <span className="font-display italic text-base">The Artisan Craft</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CURATED CATALOG */}
      <section className="py-20 px-6 bg-white border-t border-mart-soft overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-mart-emerald font-bold">{layout.curatedTitle}</span>
          <h2 className="text-4xl font-display text-mart-dark mt-1 mb-10">{layout.curatedSubtitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {layout.curatedSlots.map((slot) => (
              <div key={slot.id} onClick={() => navigateToShopCategory(slot.targetCategory)} className="aspect-video bg-mart-stone border border-mart-soft relative group cursor-pointer p-8 flex flex-col justify-end">
                <img src={slot.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-mart-dark/90 to-transparent" />
                <h4 className="relative z-20 font-display text-2xl font-bold text-mart-stone">{slot.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEW ARRIVALS */}
      <section className="py-20 px-6 bg-mart-dark text-mart-stone overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-display mb-10">{layout.newArrivalsSubtitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {layout.newArrivalSlots.map((item) => (
              <div key={item.id} onClick={() => navigateToShopProduct(item.targetProductId)} className="group cursor-pointer border border-mart-emerald/30 p-4 bg-mart-dark/50 hover:bg-mart-emerald/10 transition-all">
                <div className="w-full aspect-square bg-mart-soft/20 mb-4 overflow-hidden">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                </div>
                <h4 className="font-display text-lg font-bold text-mart-stone">{item.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
