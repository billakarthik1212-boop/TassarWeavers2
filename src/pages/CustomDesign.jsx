import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiUploadCloud, FiCheck, FiInfo, FiSliders, FiCalendar, FiCompass, FiLayers, FiActivity, FiUser } from 'react-icons/fi';
import { supabase } from '../supabaseClient';

export default function CustomDesign() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [designSpecs, setDesignSpecs] = useState({ name: '', phone: '', description: '', colors: '', budget: 15000, timeline: '' });
  const [attachedFile, setAttachedFile] = useState(null);

  const handleInputChange = (e) => setDesignSpecs({ ...designSpecs, [e.target.name]: e.target.value });
  const handleFileChange = (e) => { if (e.target.files && e.target.files[0]) setAttachedFile(e.target.files[0]); };

  const handleCustomFormSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let uploadedImageUrl = 'No image attached';

    try {
      if (attachedFile) {
        const fileExt = attachedFile.name.split('.').pop();
        const fileName = `custom-${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('product-media').upload(filePath, attachedFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('product-media').getPublicUrl(filePath);
        uploadedImageUrl = data.publicUrl;
      }

      const whatsappMessage = `🧵 *Bespoke Custom Design Proposal* 🧵\n\n👤 *Name:* ${designSpecs.name}\n📞 *Phone:* ${designSpecs.phone}\n🎨 *Colors:* ${designSpecs.colors}\n💰 *Budget:* ₹${Number(designSpecs.budget).toLocaleString('en-IN')}\n📅 *Deadline:* ${designSpecs.timeline}\n\n🖼️ *Design Link:* ${uploadedImageUrl}\n\n📝 *Specs:* \n${designSpecs.description}`;
      window.open(`https://wa.me/919505610080?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
      setIsSubmitted(true);
    } catch (error) {
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-28 px-6 max-w-6xl mx-auto min-h-screen bg-mart-stone pb-24 text-mart-dark">
      
      <div className="mb-12 border-b border-mart-soft pb-6">
        <span className="text-xs uppercase tracking-[0.2em] text-mart-emerald font-bold block">✦ BESPOKE WEAVING CONSULTATION</span>
        <h1 className="text-4xl md:text-6xl font-display text-mart-dark font-medium mt-1">Custom Design</h1>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* WORKSHOP GUIDE */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-mart-dark text-mart-stone p-8 border border-mart-emerald/20 shadow-md">
                <h3 className="font-display text-xl mb-6">Loom Blueprinting Stages</h3>
                <div className="space-y-6">
                  {[ {icon: <FiCompass/>, t: "Blueprint Mapping"}, {icon: <FiLayers/>, t: "Yarn Setup"}, {icon: <FiActivity/>, t: "Shuttle Interlace"} ].map((s, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-mart-emerald/20 flex items-center justify-center text-mart-emerald font-bold">{i+1}</div>
                      <div><h4 className="text-sm font-bold flex items-center gap-2">{s.icon} {s.t}</h4></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-white border border-mart-emerald/30 flex items-start gap-3">
                <FiInfo className="text-mart-emerald text-lg shrink-0 mt-0.5" />
                <p className="text-xs text-mart-dark font-sans leading-relaxed">Our coordinator will verify your blueprint personally before locking active operations.</p>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleCustomFormSubmit} className="lg:col-span-8 bg-white border border-mart-soft p-8 shadow-sm space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input name="name" placeholder="Full Name" onChange={handleInputChange} className="w-full bg-mart-stone p-4 text-sm border-none outline-none focus:ring-1 focus:ring-mart-emerald" required />
                <input name="phone" placeholder="Phone Number" onChange={handleInputChange} className="w-full bg-mart-stone p-4 text-sm border-none outline-none focus:ring-1 focus:ring-mart-emerald" required />
              </div>
              <textarea name="description" rows="4" placeholder="Describe your design requirements..." onChange={handleInputChange} className="w-full bg-mart-stone p-4 text-sm outline-none focus:ring-1 focus:ring-mart-emerald" required />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-mart-stone p-6">
                <div>
                  <label className="text-xs font-bold uppercase block mb-2">Budget (₹{Number(designSpecs.budget).toLocaleString('en-IN')})</label>
                  <input type="range" name="budget" min="3000" max="50000" step="500" onChange={handleInputChange} className="w-full accent-mart-emerald" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase block mb-2">Delivery Date</label>
                  <input type="date" name="timeline" onChange={handleInputChange} className="w-full bg-white p-3 text-sm outline-none border border-mart-soft" required />
                </div>
              </div>

              <div className="border-2 border-dashed border-mart-soft p-10 text-center cursor-pointer hover:border-mart-emerald transition-all" onClick={() => document.getElementById('file').click()}>
                <input type="file" id="file" className="hidden" onChange={handleFileChange} />
                <FiUploadCloud className="mx-auto text-3xl text-mart-emerald mb-2" />
                <p className="text-xs font-bold uppercase">{attachedFile ? attachedFile.name : "Upload Sketch Reference"}</p>
              </div>

              <button type="submit" disabled={isUploading} className="w-full bg-mart-dark text-mart-stone py-4 text-xs font-bold tracking-widest uppercase hover:bg-mart-emerald transition-all">
                {isUploading ? 'Processing...' : 'Submit Proposal'}
              </button>
            </form>
          </motion.div>
        ) : (
          <div className="bg-white border border-mart-soft p-16 text-center">
            <h2 className="font-display text-3xl mb-4">Proposal Registered</h2>
            <p className="mb-8 text-mart-dark/70">Our master coordinator will review your design parameters and call you shortly.</p>
            <Link to="/" className="bg-mart-dark text-mart-stone px-8 py-3 text-xs font-bold uppercase">Return Home</Link>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
