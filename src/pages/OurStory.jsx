import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';
import img1 from '../assets/ourstory.jpeg';

export default function OurStory() {
  const textFadeUp = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-28 bg-mart-stone min-h-screen text-mart-dark pb-24">

      {/* HEADER */}
      <header className="max-w-6xl mx-auto px-6 mb-12 text-left border-b border-mart-soft pb-6">
        <span className="text-xs uppercase tracking-[0.2em] text-mart-emerald font-bold block">✦ THE HUMAN LEGACY</span>
        <h1 className="text-4xl md:text-6xl font-display font-medium mt-1 text-mart-dark">Our Story</h1>
      </header>

      {/* STORY BLOCK */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-mart-soft pb-16">

        {/* Narrative */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={textFadeUp} className="lg:col-span-7 space-y-6 text-left">
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight leading-tight text-mart-dark">
            A Dying Thread of Living History
          </h2>

          <div className="space-y-4 text-sm md:text-base font-sans leading-relaxed text-mart-dark/80">
            <p>
              We inherited this sacred pit-loom tradition directly from our ancestors. For generations, the rhythm of intersecting threads was the heartbeat of our community. Every household adapted this culture, transforming wild forest silk filaments into exceptional tapestries.
            </p>
            <p className="font-medium text-mart-emerald border-l-2 border-mart-emerald pl-4 italic bg-white/40 py-2">
              Today, that heritage is challenged. As new generations pursue different paths, fewer hands remain to master these meticulous handloom techniques. Modern machinery has overrun the markets, but we refuse to surrender.
            </p>
            <p>
              Our process remains entirely unhurried and handmade. Now, <strong>fewer than 10 families from our community</strong> carry this knowledge forward. We exist as a final stand to protect their craft, preserve their livelihoods, and deliver true authentic luxury direct to your home.
            </p>
          </div>
        </motion.div>

        {/* Image Container */}
        <div className="lg:col-span-5 w-full aspect-[4/3] bg-white border border-mart-soft relative shadow-sm overflow-hidden group">
          <img src={img1} alt="Our Story Workshop" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-mart-dark/80 to-transparent z-10" />

          <div className="absolute top-4 left-4 right-4 z-20 flex justify-between text-mart-stone/70">
            <span className="font-mono text-[10px] tracking-widest uppercase bg-mart-dark/30 backdrop-blur-sm px-2 py-0.5 border border-mart-stone/10">Visual Record Archive</span>
            <FiAward className="text-xl text-mart-emerald" />
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-20 bg-mart-dark/60 p-4 border border-mart-emerald/20 backdrop-blur-md">
            <h4 className="font-display text-base font-bold text-mart-stone">The Last Remaining Pit Looms</h4>
            <p className="text-[11px] text-mart-stone/90 font-light mt-1">Preserving unhurried craftsmanship from our local cluster.</p>
          </div>
        </div>

      </section>
    </motion.div>
  );
}
