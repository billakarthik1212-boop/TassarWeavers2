import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlusCircle, FiTrash2, FiEdit2, FiCheck, FiX, FiBox, FiCheckCircle, FiXCircle, FiList, FiTrendingUp, FiUploadCloud, FiImage, FiHome, FiShoppingBag, FiLock, FiLogOut, FiArrowLeft, FiTag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export const getLiveCatalog = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error reading catalog from Supabase:", error.message);
    return [];
  }
  return data;
};

export const getHomeLayoutSettings = async () => {
  const { data, error } = await supabase
    .from('home_layout')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    console.error("Error reading home layout from Supabase:", error.message);
    return null;
  }
  return data;
};

export const uploadImageToCloud = async (file) => {
  if (!file) return null;
  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExtension}`;
  const filePath = `uploads/${fileName}`;

  const { data, error } = await supabase.storage
    .from('product-media')
    .upload(filePath, file);

  if (error) {
    console.error("Cloud Asset Storage Error:", error.message);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('product-media')
    .getPublicUrl(filePath);

  return publicUrl;
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [homeLayout, setHomeLayout] = useState(null);

  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [isSubmittingArrival, setIsSubmittingArrival] = useState(false);
  const [isSubmittingCurated, setIsSubmittingCurated] = useState(false);

  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Sarees', desc: '', images: [] });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', price: '', category: '', desc: '', images: [], inStock: true });

  const [newArrivalInput, setNewArrivalInput] = useState({ name: '', targetProductId: '', image: '', fileObj: null });
  const [newCuratedInput, setNewCuratedInput] = useState({ name: '', targetCategory: 'Sarees', image: '', fileObj: null });

  const allowedCategories = ["Sarees", "Plain Cloth", "Shawls", "Dhoti & Pancha"];

  useEffect(() => {
    const checkActiveSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        loadDashboardData();
      }
    };
    checkActiveSession();
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    const liveItems = await getLiveCatalog();
    setProducts(liveItems);

    const liveHome = await getHomeLayoutSettings();
    setHomeLayout(liveHome);

    const { data: liveOrders, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!orderErr && liveOrders) {
      const formattedOrders = liveOrders.map(o => ({
        id: o.id,
        orderId: o.order_id,
        date: new Date(o.created_at).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        customer: { name: o.customer_name, phone: o.customer_phone, address: o.customer_address },
        items: o.items,
        totalAmount: o.total_amount
      }));
      setOrders(formattedOrders);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmailInput,
      password: passwordInput,
    });

    if (error) {
      setAuthError(true);
      setPasswordInput('');
    } else {
      setIsAuthenticated(true);
      setAuthError(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  const handleInputChange = (e) => {
    NewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProductSubmit = async (e) => {
    E.preventDefault();
    const cleanPrice = parseFloat(newProduct.price);
    if (!newProduct.name || isNaN(cleanPrice) || isSubmittingProduct) return;

    SetIsSubmittingProduct(true);
    const uploadedUrls = [];

    for (const file of selectedFiles) {
      const url = await uploadImageToCloud(file);
      if (url) uploadedUrls.push(url);
    }

    const { error } = await supabase.from('products').insert([{
      name: newProduct.name,
      price: cleanPrice,
      category: newProduct.category,
      description: newProduct.desc,
      images: uploadedUrls,
      in_stock: true
    }]);

    IsSubmittingProduct(false);
    if (!error) {
      SetNewProduct({ name: '', price: '', category: 'Sarees', desc: '', images: [] });
      SetSelectedFiles([]);
      LoadDashboardData();
    }
  };

  const handleToggleStock = async (product) => {
    const { error } = await supabase
      .from('products')
      .update({ in_stock: !product.in_stock })
      .Eq('id', product.id);

    if (!error) loadDashboardData();
  };

  const startEditingClick = (product) => {
    SetEditingId(product.id);
    SetEditFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      desc: product.description || '',
      images: product.images || [],
      inStock: product.in_stock
    });
  };

  const handleSaveEditSubmit = async (productId) => {
    const { error } = await supabase
      .from('products')
      .update({
        name: editFormData.name,
        price: parseFloat(editFormData.price),
        category: editFormData.category,
        description: editFormData.desc,
        in_stock: editFormData.inStock
      })
      .Eq('id', productId);

    if (!error) {
      SetEditingId(null);
      LoadDashboardData();
    }
  };

  const handleRemoveProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) loadDashboardData();
  };

  const handleClearOrder = async (orderTableId) => {
    const { error } = await supabase.from('orders').delete().eq('id', orderTableId);
    if (!error) loadDashboardData();
  };

  const handleAddArrivalSlot = async (e) => {
    E.preventDefault();
    if (!newArrivalInput.name || isSubmittingArrival) return;

    SetIsSubmittingArrival(true);
    let publicImageUrl = '';

    if (newArrivalInput.fileObj) {
      PublicImageUrl = await uploadImageToCloud(newArrivalInput.fileObj);
    }

    const slotPayload = {
      id: Date.now(),
      name: newArrivalInput.name,
      targetProductId: newArrivalInput.targetProductId,
      image: publicImageUrl
    };

    const updatedSlots = [...(homeLayout.new_arrival_slots || []), slotPayload];
    const { error } = await supabase
      .from('home_layout')
      .update({ new_arrival_slots: updatedSlots })
      .Eq('id', 1);

    IsSubmittingArrival(false);
    if (!error) {
      SetNewArrivalInput({ name: '', targetProductId: '', image: '', fileObj: null });
      LoadDashboardData();
    }
  };

  const handleAddCuratedSlot = async (e) => {
    E.preventDefault();
    if (!newCuratedInput.name || isSubmittingCurated) return;

    SetIsSubmittingCurated(true);
    let publicImageUrl = '';

    if (newCuratedInput.fileObj) {
      PublicImageUrl = await uploadImageToCloud(newCuratedInput.fileObj);
    }

    const slotPayload = {
      id: Date.now(),
      name: newCuratedInput.name,
      targetCategory: newCuratedInput.targetCategory,
      image: publicImageUrl
    };

    const updatedSlots = [...(homeLayout.curated_slots || []), slotPayload];
    const { error } = await supabase
      .from('home_layout')
      .update({ curated_slots: updatedSlots })
      .Eq('id', 1);

    IsSubmittingCurated(false);
    if (!error) {
      SetNewCuratedInput({ name: '', targetCategory: 'Sarees', image: '', fileObj: null });
      LoadDashboardData();
    }
  };

  const handleRemoveArrivalSlot = async (id) => {
    const filtered = homeLayout.new_arrival_slots.filter(s => s.id !== id);
    const { error } = await supabase.from('home_layout').update({ new_arrival_slots: filtered }).eq('id', 1);
    if (!error) loadDashboardData();
  };

  const handleRemoveCuratedSlot = async (id) => {
    const filtered = homeLayout.curated_slots.filter(s => s.id !== id);
    const { error } = await supabase.from('home_layout').update({ curated_slots: filtered }).eq('id', 1);
    if (!error) loadDashboardData();
  };

  if (!isAuthenticated) {
    Return (
      /* Adjusted to transparent backdrop so your pink body gradient reflects properly */
      <div className="min-h-screen bg-transparent flex flex-col justify-center items-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/90 backdrop-blur-sm border border-tassar-pink p-8 shadow-xl max-w-md w-full text-left space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-tassar-earth text-tassar-cream rounded-full flex items-center justify-center text-xl mx-auto shadow-sm"><FiLock /></div>
            <h2 className="font-display text-2xl font-bold text-black pt-1">Administrative Access</h2>
            <p className="text-xs text-neutral-600">Enter your secure credentials to unlock write capabilities.</p>
          </div>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">Admin Email</label>
              <input type="email" value={adminEmailInput} onChange={(e) => setAdminEmailInput(e.target.value)} placeholder="enter credentials" className="w-full bg-white border border-tassar-pink p-3 text-xs font-bold text-black outline-none focus:bg-white focus:border-tassar-earth rounded-none mb-3" required />

              <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">Console Key</label>
              <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="••••••••" className="w-full bg-white border border-tassar-pink p-3 text-xs font-bold text-black outline-none focus:bg-white focus:border-tassar-earth rounded-none" required />
              {authError && <span className="text-[11px] text-tassar-madderRed font-bold mt-1 block">✦ Invalid administrator account verification keys.</span>}
            </div>
            <button type="submit" className="w-full bg-tassar-earth text-tassar-cream py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-tassar-madderRed transition-colors duration-300">VERIFY LOGINS</button>
          </form>
          <div className="border-t border-tassar-pink/40 pt-4 text-center"><Link to="/shop" className="text-xs font-bold tracking-wider uppercase text-black/60 hover:text-black inline-flex items-center gap-2"><FiArrowLeft /> Return to Store</Link></div>
        </motion.div>
      </div>
    );
  }

  if (!homeLayout) return <div className="min-h-screen bg-transparent pt-32 text-center text-xs font-mono">Syncing cloud layout settings...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-8 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen bg-transparent pb-24 text-tassar-earth">

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-tassar-earth/20 pb-4">
        <div className="text-left">
          <span className="text-xs uppercase tracking-[0.2em] text-tassar-madderRed font-bold block">✦ CLOUD RUN TIMELINE</span>
          <h1 className="text-4xl font-display font-bold mt-1 text-black">Admin Suite</h1>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Link to="/" className="px-4 py-2 bg-white text-black font-bold text-xs border border-tassar-pink/60 hover:bg-white/50 transition-colors flex items-center gap-2 rounded-none"><FiArrowLeft /> View Live Site</Link>
          <button onClick={handleLogout} className="px-4 py-2 bg-tassar-madderRed text-white font-bold text-xs hover:bg-black transition-colors flex items-center gap-2 rounded-none shadow-sm"><FiLogOut /> Secure Exit</button>
        </div>
      </div>

      <div className="flex flex-wrap border-b border-tassar-pink/60 mb-8 bg-white shadow-sm p-1 gap-1">
        <button onClick={() => setActiveTab('overview')} className={`px-5 py-3 text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-all ${activeTab === 'overview' ? 'bg-tassar-earth text-tassar-cream font-black' : 'text-black hover:bg-white/60'}`}><FiTrendingUp /> Overview</button>
        <button onClick={() => setActiveTab('manage')} className={`px-5 py-3 text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-all ${activeTab === 'manage' ? 'bg-tassar-earth text-tassar-cream font-black' : 'text-black hover:bg-white/60'}`}><FiList /> Manage Shop</button>
        <button onClick={() => setActiveTab('homeLayout')} className={`px-5 py-3 text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-all ${activeTab === 'homeLayout' ? 'bg-tassar-earth text-tassar-cream font-black' : 'text-black hover:bg-white/60'}`}><FiHome /> Home Customizer</button>
        <button onClick={() => setActiveTab('orders')} className={`px-5 py-3 text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-all relative ${activeTab === 'orders' ? 'bg-tassar-earth text-tassar-cream font-black' : 'text-black hover:bg-white/60'}`}><FiShoppingBag /> Client Orders {orders.length > 0 && <span className="ml-1 bg-tassar-madderRed text-white text-[9px] font-mono px-1.5 py-0.5 rounded-full">{orders.length}</span>}</button>
      </div>

      <AnimatePresence mode="wait">

        {activeTab === 'overview' && (
          <motion.div key="ov-tab" className="space-y-6 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-tassar-earth text-tassar-cream p-6 shadow-sm border border-tassar-earth"><span className="text-[10px] font-mono tracking-widest uppercase text-tassar-pink">Total Cloud Products</span><p className="text-4xl font-display font-bold text-white mt-2 flex items-center gap-2"><FiBox /> {products.length}</p></div>
              <div className="bg-white border border-tassar-pink/60 p-6 shadow-sm"><span className="text-[10px] font-mono tracking-widest uppercase text-tassar-earth/70">Loom Active Items</span><p className="text-4xl font-display font-bold text-black mt-2 flex items-center gap-2"><FiCheckCircle className="text-emerald-600" /> {products.filter(p => p.in_stock).length}</p></div>
              <div className="bg-white border border-tassar-pink/60 p-6 shadow-sm"><span className="text-[10px] font-mono tracking-widest uppercase text-tassar-earth/70">Pending Bookings Queue</span><p className="text-4xl font-display font-bold text-tassar-madderRed mt-2 flex items-center gap-2"><FiShoppingBag /> {orders.length}</p></div>
            </div>
          </motion.div>
        )}

        {activeTab === 'manage' && (
          <motion.div key="mg-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form onSubmit={handleAddProductSubmit} className="lg:col-span-4 bg-white border border-tassar-pink/40 p-5 shadow-sm space-y-4 text-left">
              <div className="flex items-center gap-2 text-black font-bold pb-2 border-b border-tassar-pink/20"><FiPlusCircle className="text-tassar-madderRed" /> <h3 className="font-display text-base uppercase tracking-wider">Publish Product</h3></div>
              <div><label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">Product Title</label><input type="text" name="name" value={newProduct.name} onChange={handleInputChange} className="w-full bg-transparent border border-tassar-pink/60 p-2.5 text-xs font-bold text-black outline-none" required /></div>
              <div><label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">Price (₹)</label><input type="number" name="price" value={newProduct.price} onChange={handleInputChange} className="w-full bg-transparent border border-tassar-pink/60 p-2.5 text-xs font-bold text-black font-mono outline-none" required /></div>
              <div><label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">Display Category</label><select name="category" value={newProduct.category} onChange={handleInputChange} className="w-full bg-white border border-tassar-pink/60 p-2.5 text-xs font-bold text-black outline-none cursor-pointer">{allowedCategories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">Fabric Specifications</label><textarea name="desc" rows="4" value={newProduct.desc} onChange={handleInputChange} className="w-full bg-transparent border border-tassar-pink/60 p-2.5 text-xs font-bold text-black outline-none resize-none" placeholder="Describe weave patterns, layout profiles..." required /></div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">Upload Product Photos (Multi-Select)</label>
