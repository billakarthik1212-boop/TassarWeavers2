import { motion } from 'framer-motion';
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [orderComplete, setOrderComplete] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [shippingForm, setShippingForm] = useState({ name: '', phone: '', address: '' });

  const ADMIN_WHATSAPP_NUMBER = '919603903021';

  const handleFormChange = (e) => setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0 || isSending) return;
    setIsSending(true);
    const generatedId = `#TW-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const { error } = await supabase.from('orders').insert([{
        order_id: generatedId,
        customer_name: shippingForm.name,
        customer_phone: shippingForm.phone,
        customer_address: shippingForm.address,
        items: cartItems.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
        total_amount: getCartTotal()
      }]);
      if (error) throw new Error(error.message);

      const itemsListText = cartItems.map((item, idx) => {
        const itemTotal = item.price * item.quantity;
        const imageAssetUrl = (item.images && item.images[0]) ? `\n   🖼️ Image: ${item.images[0]}` : '';
        return `${idx + 1}. ${item.name}\n   Qty: ${item.quantity}\n   Price: ₹${item.price.toLocaleString('en-IN')}\n   Subtotal: ₹${itemTotal.toLocaleString('en-IN')}${imageAssetUrl}`;
      }).join('\n\n');

      const whatsappText = `✦ ARTISAN MART INVOICE ✦\n\n📦 Order ID: ${generatedId}\n👤 Customer: ${shippingForm.name}\n📞 Phone: ${shippingForm.phone}\n📍 Address: ${shippingForm.address}\n\n🧵 Products:\n${itemsListText}\n\n💳 TOTAL DUE: ₹${getCartTotal().toLocaleString('en-IN')}`;
      window.open(`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`, '_blank');
      setOrderComplete(true);
      clearCart();
    } catch (err) {
      alert("Synchronization error. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  if (orderComplete) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 px-6 text-center max-w-md mx-auto min-h-screen flex flex-col justify-center bg-mart-stone text-mart-dark">
        <div className="w-16 h-16 rounded-full bg-mart-emerald text-mart-stone flex items-center justify-center text-2xl mx-auto mb-6"><FiCheckCircle /></div>
        <h2 className="font-display text-3xl font-bold mb-3">Order Invoice Formed!</h2>
        <p className="text-sm opacity-70 mb-8">Your details are verified. Finalize transmission on WhatsApp to complete processing.</p>
        <Link to="/shop" className="bg-mart-dark text-mart-stone py-3.5 px-6 text-xs font-bold tracking-widest uppercase hover:bg-mart-emerald transition-all">Return to Marketplace</Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-28 px-6 max-w-5xl mx-auto min-h-screen bg-mart-stone pb-24 text-mart-dark">
      <div className="mb-10 border-b border-mart-soft pb-5">
        <span className="text-xs uppercase tracking-[0.2em] text-mart-emerald font-bold block">✦ YOUR WEAVE SELECTS</span>
        <h1 className="text-4xl font-display font-bold mt-1 text-mart-dark">Shopping Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white border border-mart-soft p-16 text-center shadow-sm">
          <FiShoppingBag className="text-4xl text-mart-soft mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold mb-2">Your Cart is Empty</h3>
          <Link to="/shop" className="bg-mart-dark text-mart-stone py-3 px-6 text-xs font-bold tracking-widest uppercase hover:bg-mart-emerald transition-all">Return to Marketplace</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white border border-mart-soft p-6 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-mart-soft pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-mart-stone border border-mart-soft flex items-center justify-center overflow-hidden">
                    {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover" /> : <FiShoppingBag className="text-mart-soft" />}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-mart-dark">{item.name}</h4>
                    <span className="text-[10px] uppercase font-bold text-mart-emerald">{item.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex border border-mart-soft">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-mart-stone"><FiMinus /></button>
                    <span className="px-3 py-2 font-mono">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-mart-stone"><FiPlus /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-mart-soft hover:text-mart-emerald"><FiTrash2 /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 bg-white border border-mart-soft p-6 space-y-6">
            <h3 className="font-display text-lg font-bold border-b border-mart-soft pb-2">Order Summary</h3>
            <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-bold">₹{getCartTotal().toLocaleString('en-IN')}</span></div>
            <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-2">
              <input type="text" name="name" placeholder="Full Name" onChange={handleFormChange} className="w-full bg-mart-stone p-3 text-xs outline-none focus:ring-1 focus:ring-mart-emerald" required />
              <input type="tel" name="phone" placeholder="Phone Number" onChange={handleFormChange} className="w-full bg-mart-stone p-3 text-xs outline-none focus:ring-1 focus:ring-mart-emerald" required />
              <textarea name="address" placeholder="Shipping Address" onChange={handleFormChange} className="w-full bg-mart-stone p-3 text-xs outline-none focus:ring-1 focus:ring-mart-emerald" required />
              <button type="submit" disabled={isSending} className="w-full bg-mart-dark text-mart-stone py-4 text-xs font-bold tracking-widest uppercase hover:bg-mart-emerald transition-all">
                {isSending ? "Processing..." : "Generate Invoice & Send"}
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
