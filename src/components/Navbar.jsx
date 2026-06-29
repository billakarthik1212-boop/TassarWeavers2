import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();

  // Calculate total count of items in the cart safely
  const totalCartItemsCount = cartItems?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;

  const navigationLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Our Process', path: '/process' },
    { name: 'Our Story', path: '/story' },
    { name: 'Custom Design', path: '/custom-design' },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-tassar-cream/80 backdrop-blur-md border-tassar-earth/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* BRAND LOGO */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="font-display text-xl font-bold tracking-[0.15em] text-black hover:text-tassar-madderRed transition-colors"
            >
              SIDDESHWARA <span className="text-tassar-deepGold font-light">RURAL MART</span>
            </Link>
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs uppercase tracking-widest transition-colors font-bold ${
                  isActivePath(link.path)
                    ? 'text-tassar-madderRed font-black'
                    : 'text-black hover:text-tassar-madderRed'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* DESKTOP SHOPPING BAG */}
          <div className="hidden md:flex items-center">
            <Link
              to="/cart"
              className="relative p-2.5 text-black hover:text-tassar-madderRed transition-colors border border-transparent hover:border-tassar-raw/20 bg-white shadow-sm rounded-none"
              title="Open Shopping Basket"
            >
              <FiShoppingBag className="text-lg text-black" />
              {totalCartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-tassar-madderRed text-white text-[10px] font-mono font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-tassar-cream shadow-sm">
                  {totalCartItemsCount}
                </span>
              )}
            </Link>
          </div>

          {/* MOBILE TOGGLE & SHORTCUTS */}
          <div className="flex md:hidden items-center gap-4">
            <Link to="/cart" className="relative p-2 text-black" title="Open Shopping Basket">
              <FiShoppingBag className="text-xl text-black" />
              {totalCartItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-tassar-madderRed text-white text-[9px] font-mono font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartItemsCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-black hover:text-tassar-madderRed focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DROPDOWN INTERFACE */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full md:hidden bg-white dark:bg-white border-b border-tassar-raw/30 shadow-lg px-4 pt-2 pb-6 space-y-2 z-50">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-3 text-sm tracking-widest uppercase font-bold text-left border-b border-tassar-cream last:border-0 transition-all ${
                isActivePath(link.path) 
                  ? 'text-tassar-madderRed bg-tassar-cream/40 pl-5' 
                  : 'text-black dark:text-black'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
