import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiActivity } from 'react-icons/fi';

// Imports remain unchanged
import step1Img from '../assets/CocoonStory.jpeg';
import step2Img from '../assets/download (1).jpeg';
import step3Img from '../assets/weavingonpitloom.jpeg';
import step4Img from '../assets/dyingcolors.jpeg';
import step5Img from '../assets/spinningthread.jpeg';

export default function Process() {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    { id: 0, phase: "Stage 01", title: "The Cocoon's Story", summary: "Natural gold cocoons growing in the wild.", description: "Our silk starts in the wild jungle. Unlike factory-farmed silk, wild Tassar silkworms thrive on outdoor Asan and Arjun trees, eating fresh leaves directly from nature. This open-air forest life gives the cocoons their famous golden-cream hue. Local families gather these mature cocoons by hand.", imageUrl: step1Img },
    { id: 1, phase: "Stage 02", title: "Spinning the Thread", summary: "Softening and drawing out raw organic yarn.", description: "We boil the cocoons in clean water over a fire to soften the natural binding proteins. Once softened, village artisans gently draw the fine threads together, twisting them by hand to create strong, clean, usable bundles of silk fiber.", imageUrl: step5Img },
    { id: 2, phase: "Stage 03", title: "Dyeing with Forest Colors", summary: "Using natural pigments for permanent, vibrant tones.", description: "We avoid harsh chemicals, choosing instead to extract colors from the forest. Indigo leaves, madder root, pomegranate peels, and pure turmeric create our rich palette. This slow-boil process locks the color deep within the fiber.", imageUrl: step4Img },
    { id: 3, phase: "Stage 04", title: "Preparing the Loom", summary: "Spinning and aligning threads for horizontal weaving.", description: "The dyed yarn is wound onto wooden bobbins and spools. Careful alignment ensures that the horizontal threads glide perfectly through the loom, preventing tangles or snapping during the intensive weaving process.", imageUrl: step2Img },
    { id: 4, phase: "Stage 05", title: "Weaving on the Pit Loom", description: "Threads are stretched onto a traditional pit loom. The master weaver operates the wooden pedals and shuttle with precise rhythm, weaving only two meters a day to ensure every saree is entirely flawless.", imageUrl: step3Img }
  ];

  const scrollToStage = (stageId) => {
    setActiveStage(stageId);
    const targetElement = document.getElementById(`process-stage-${stageId}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-28 bg-mart-stone min-h-screen pb-28 text-mart-dark font-sans">
      
      {/* HEADER */}
      <header className="max-w-7xl mx-auto px-6 mb-16 text-left grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-b border-mart-soft pb-10">
        <div className="md:col-span-8 space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-mart-emerald font-bold flex items-center gap-2">
            <FiActivity className="animate-pulse" /> Traditional Craft Steps
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-mart-dark tracking-tight">How We Make It</h1>
          <p className="text-sm md:text-base text-mart-dark/70 leading-relaxed max-w-xl pt-2">
            See how our artisan families create pure wild silk textiles by hand. No machines, no waste—just human skill passed down through generations.
          </p>
        </div>

        <div className="md:col-span-4 flex flex-wrap gap-2 md:justify-end">
          {stages.map((stg) => (
            <button key={stg.id} onClick={() => scrollToStage(stg.id)} className={`px-3 py-1.5 text-xs font-bold font-mono tracking-wider border transition-all ${activeStage === stg.id ? 'bg-mart-dark text-mart-stone border-mart-dark' : 'bg-white text-mart-dark border-mart-soft hover:border-mart-dark'}`}>
              0{stg.id + 1}
            </button>
          ))}
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* SIDEBAR */}
        <aside className="lg:col-span-4 space-y-4 hidden lg:block sticky top-32 bg-white border border-mart-soft p-6 shadow-sm">
          <span className="text-[10px] font-mono tracking-widest text-mart-emerald uppercase font-bold block border-b border-mart-soft pb-2 mb-4">Workshop Tracking Log</span>
          <div className="space-y-1">
            {stages.map((stg) => (
              <button key={stg.id} onClick={() => scrollToStage(stg.id)} className={`w-full text-left p-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider transition-all ${activeStage === stg.id ? 'bg-mart-stone text-mart-dark font-black border-l-4 border-mart-dark' : 'text-mart-dark/50 hover:text-mart-dark hover:bg-mart-stone/50'}`}>
                <span>0{stg.id + 1}. {stg.title}</span>
                <FiArrowRight className={activeStage === stg.id ? 'text-mart-dark' : 'opacity-0'} />
              </button>
            ))}
          </div>
        </aside>

        {/* STAGES */}
        <section className="lg:col-span-8 space-y-24">
          {stages.map((stage, idx) => (
            <motion.div id={`process-stage-${stage.id}`} key={stage.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-120px" }} onViewportEnter={() => setActiveStage(stage.id)}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white border border-mart-soft p-5 md:p-0 md:border-none shadow-sm md:shadow-none">
              
              <div className={`md:col-span-5 w-full bg-mart-stone border border-mart-soft overflow-hidden ${idx % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                <img src={stage.imageUrl} alt={stage.title} className="w-full h-full object-cover transition-all duration-700 hover:scale-105" />
              </div>

              <div className={`md:col-span-7 text-left space-y-3 ${idx % 2 === 0 ? 'md:order-2 md:pl-4' : 'md:order-1 md:pr-4'}`}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-2 py-0.5 bg-mart-dark text-mart-stone font-bold">{stage.phase}</span>
                  <div className="h-[1px] flex-grow bg-mart-soft" />
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-mart-dark tracking-tight">{stage.title}</h2>
                <p className="text-sm md:text-base text-mart-dark/80 font-sans leading-relaxed">{stage.description}</p>
                {stage.summary && (
                  <div className="text-[11px] uppercase font-mono tracking-wider text-mart-emerald font-bold bg-mart-soft/40 p-2 border-l border-mart-emerald inline-block mt-2">
                    ✦ Key Goal: {stage.summary}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </section>
      </main>
    </motion.div>
  );
}
