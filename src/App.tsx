import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Plus, Minus, Instagram, MapPin, Phone, ChevronRight } from 'lucide-react';
import { MENU_ITEMS, MenuItem } from './constants';
import CustomCursor from './components/CustomCursor';

interface CartItem extends MenuItem {
  quantity: number;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Nhào bột...');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const texts = ['Nhào bột...', 'Tạo hình ngàn lớp...', 'Đang nướng bánh...', 'Thêm lớp bơ Pháp...', 'Hoàn tất!'];
    let i = 0;
    const interval = setInterval(() => {
      if (i < texts.length - 1) {
        i++;
        setLoadingText(texts[i]);
      }
    }, 600);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const categories = ['All', ...new Set(MENU_ITEMS.map(item => item.category))];

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredItems = activeCategory === 'All' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen selection:bg-bakery-accent selection:text-white">
      <CustomCursor />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-bakery-cream flex flex-col items-center justify-center"
          >
            <div className="relative mb-12">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-32 h-32"
              >
                <img 
                  src="https://images.unsplash.com/photo-1620921515201-999092955324?q=80&w=200&auto=format&fit=crop" 
                  alt="Loading Logo" 
                  className="w-full h-full object-contain"
                />
              </motion.div>
              
              {/* Steam effect */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -20],
                      opacity: [0, 0.5, 0],
                      scale: [0.5, 1.2]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut"
                    }}
                    className="w-2 h-8 bg-bakery-maroon/20 rounded-full blur-sm"
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <motion.p 
                key={loadingText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="serif text-2xl text-bakery-maroon font-medium italic mb-4"
              >
                {loadingText}
              </motion.p>
              <div className="w-48 h-1 bg-bakery-maroon/10 rounded-full overflow-hidden mx-auto">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="h-full bg-bakery-maroon"
                />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Main Content (only show after loading or keep in DOM but hidden) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1 }}
      >
        {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/90 shadow-lg py-2' : 'bg-bakery-cream/80 py-4'
      } backdrop-blur-md border-b border-bakery-brass/20`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.3em] font-semibold text-bakery-maroon/60">
            <a href="#menu" className="hover:text-bakery-brass transition-colors">La Carte</a>
            <a href="#about" className="hover:text-bakery-brass transition-colors">Notre Histoire</a>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1620921515201-999092955324?q=80&w=200&auto=format&fit=crop" 
                  alt="Croisse Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="display text-3xl font-bold tracking-tighter text-bakery-maroon leading-none">Croisse</span>
                <span className="text-[8px] uppercase tracking-[0.4em] text-bakery-brass font-bold mt-1">Boulangerie & Pâtisserie</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.3em] font-semibold text-bakery-maroon/60">
              <a href="#contact" className="hover:text-bakery-brass transition-colors">Contact</a>
              <span className="text-bakery-brass/40">|</span>
              <span className="text-bakery-brass">07:00 — 21:00</span>
            </div>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 hover:bg-bakery-maroon/5 rounded-full transition-colors group"
            >
              <ShoppingBag size={22} className="text-bakery-maroon group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-bakery-maroon text-white text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-bakery-cream">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.4, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute -left-12 top-0 vertical-text text-[10px] uppercase tracking-[0.5em] text-bakery-brass font-bold hidden xl:block"
            >
              Depuis 2026 — Đà Lạt, Việt Nam
            </motion.div>
            
            <div className="mb-12 flex flex-col items-start">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-32 h-32 mb-8"
              >
                <img 
                  src="https://images.unsplash.com/photo-1620921515201-999092955324?q=80&w=400&auto=format&fit=crop" 
                  alt="Croisse Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-4 mb-6"
              >
                <div className="h-[1px] w-12 bg-bakery-brass" />
                <span className="text-[11px] uppercase tracking-[0.3em] text-bakery-brass font-bold">
                  L'Art de la Boulangerie
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="display text-7xl md:text-8xl lg:text-9xl leading-[0.85] mb-10 group"
              >
                <span className="styled-title block">Hương vị</span>
                <span className="script paris-accent">Paris</span>
                <span className="styled-title block">giữa Đà Lạt</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="serif text-xl text-bakery-ink/70 max-w-md mb-12 leading-relaxed italic"
              >
                "Mỗi chiếc bánh là một bản giao hương của bơ Pháp thượng hạng và kỹ thuật ngàn lớp thủ công."
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap gap-6"
              >
                <a 
                  href="#menu"
                  className="inline-flex items-center gap-4 bg-bakery-maroon text-bakery-cream px-10 py-5 rounded-full font-bold hover:bg-bakery-accent transition-all group shadow-xl shadow-bakery-maroon/10"
                >
                  <span className="text-xs uppercase tracking-widest">Khám phá thực đơn</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <div className="flex items-center gap-4 px-6 py-5 border border-bakery-brass/30 rounded-full">
                  <div className="w-2 h-2 bg-bakery-brass rounded-full animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-bakery-maroon">Đang nướng mẻ mới</span>
                </div>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 1.1, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl z-10">
              <img 
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&auto=format&fit=crop" 
                alt="Fresh Croissants"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bakery-maroon/40 to-transparent" />
            </div>
            
            {/* Decorative elements */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -right-10 w-40 h-40 border border-bakery-brass/20 rounded-full -z-10" 
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-10 -left-10 w-60 h-60 border border-bakery-brass/10 rounded-full -z-10" 
            />
            
            <div className="absolute -right-12 bottom-20 vertical-text text-[9px] uppercase tracking-[0.6em] text-bakery-maroon font-bold opacity-20 hidden xl:block">
              CROISSE • BOULANGERIE • PATISSERIE
            </div>
          </motion.div>
        </div>
      </section>

      {/* Menu Section */}
      <motion.section 
        id="menu" 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="py-32 bg-bakery-paper/50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="ornament mb-6 max-w-xs mx-auto">
              <span className="text-[10px] uppercase tracking-[0.4em] text-bakery-brass font-bold">La Carte</span>
            </div>
            <h2 className="display text-6xl md:text-7xl text-bakery-maroon mb-6">Thực đơn <span className="script text-bakery-brass">đặc sắc</span></h2>
            <p className="serif text-xl text-bakery-ink/50 italic">Tuyển chọn những hương vị tinh túy nhất</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-20"
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all border ${
                  activeCategory === cat 
                    ? 'bg-bakery-maroon text-white border-bakery-maroon shadow-lg shadow-bakery-maroon/20' 
                    : 'bg-white text-bakery-maroon border-bakery-brass/20 hover:border-bakery-brass'
                }`}
              >
                {cat === 'All' ? 'Tất cả' : cat}
              </button>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="boutique-card rounded-[40px] p-4 group"
                >
                  <div className="relative aspect-square rounded-[30px] overflow-hidden mb-8 bg-bakery-cream">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-bakery-maroon/0 group-hover:bg-bakery-maroon/10 transition-colors duration-500" />
                    
                    <button 
                      onClick={() => addToCart(item)}
                      className="absolute bottom-6 right-6 bg-white text-bakery-maroon px-6 py-3 rounded-full shadow-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-bakery-maroon hover:text-white flex items-center gap-2"
                    >
                      <span className="text-[10px] uppercase tracking-widest font-bold">Thêm vào giỏ</span>
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="px-4 pb-4">
                    <div className="flex justify-between items-baseline mb-3">
                      <h3 className="serif text-2xl font-bold text-bakery-maroon group-hover:text-bakery-accent transition-colors">{item.name}</h3>
                      <div className="h-[1px] flex-1 mx-4 border-b border-dotted border-bakery-brass/40" />
                      <span className="font-bold text-bakery-brass tracking-tighter">{item.price.toLocaleString()}đ</span>
                    </div>
                    <p className="serif text-sm text-bakery-ink/60 leading-relaxed italic line-clamp-2">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        id="about" 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="py-32 px-6 bg-bakery-cream"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative aspect-[3/4] rounded-[60px] overflow-hidden shadow-2xl z-10">
                <img 
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop" 
                  alt="Baking process"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -bottom-12 -right-12 w-64 h-64 bg-bakery-maroon rounded-[40px] p-10 flex flex-col justify-end z-20 shadow-2xl"
              >
                <span className="display text-6xl text-bakery-cream mb-2">48h</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-bakery-brass font-bold">Nghệ thuật ủ chậm</span>
              </motion.div>
              <div className="absolute -top-10 -left-10 w-40 h-40 border-2 border-bakery-brass/20 rounded-full" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="ornament mb-8 max-w-xs">
                <span className="text-[10px] uppercase tracking-[0.4em] text-bakery-brass font-bold">Notre Histoire</span>
              </div>
              <h2 className="display text-6xl md:text-7xl text-bakery-maroon mb-10 leading-tight">
                L'Art de la <br />
                <span className="script text-bakery-brass">Patience</span>
              </h2>
              <div className="space-y-8 serif text-xl text-bakery-ink/80 leading-relaxed italic">
                <p>
                  Tại Croisse, chúng tôi tin rằng sự kiên nhẫn là chìa khóa của hương vị. Mỗi chiếc bánh mất hơn 48 giờ để hoàn thành, từ việc ủ bột chậm đến kỹ thuật cán bơ thủ công.
                </p>
                <p>
                  Chúng tôi sử dụng 100% bơ AOP từ vùng Charentes-Poitou nước Pháp, kết hợp cùng nguồn nước tinh khiết và khí hậu ôn hòa của Đà Lạt để tạo nên những lớp bánh giòn tan, thơm ngậy đặc trưng.
                </p>
              </div>
              
              <div className="mt-16 grid grid-cols-2 gap-12">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(176, 141, 87, 0.5)' }}
                  className="p-8 border border-bakery-brass/20 rounded-3xl bg-white/50 transition-colors"
                >
                  <span className="display text-4xl text-bakery-maroon block mb-2">100%</span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-bakery-brass">Nguyên liệu nhập khẩu</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(176, 141, 87, 0.5)' }}
                  className="p-8 border border-bakery-brass/20 rounded-3xl bg-white/50 transition-colors"
                >
                  <span className="display text-4xl text-bakery-maroon block mb-2">Tradition</span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-bakery-brass">Công thức cổ điển</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        id="contact" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="bg-bakery-ink text-bakery-cream pt-32 pb-12"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-20 mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 flex items-center justify-center brightness-0 invert">
                  <img 
                    src="https://images.unsplash.com/photo-1620921515201-999092955324?q=80&w=200&auto=format&fit=crop" 
                    alt="Croisse Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="display text-3xl font-bold tracking-tighter">Croisse</span>
              </div>
              <p className="serif text-lg opacity-60 italic leading-relaxed mb-8">
                "Mang tinh hoa bánh Pháp đến với thành phố ngàn hoa Đà Lạt."
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://www.instagram.com/croisse_bakehouse/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-bakery-ink transition-all"
                >
                  <Instagram size={18} />
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61562108646252#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-bakery-ink transition-all"
                >
                  <span className="text-xs font-bold">FB</span>
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-bakery-brass font-bold mb-10">Navigation</h4>
              <ul className="space-y-4 text-sm font-medium opacity-60">
                <li><a href="#menu" className="hover:text-bakery-brass transition-colors">La Carte</a></li>
                <li><a href="#about" className="hover:text-bakery-brass transition-colors">Notre Histoire</a></li>
                <li><a href="#contact" className="hover:text-bakery-brass transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-bakery-brass transition-colors">Livraison</a></li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-bakery-brass font-bold mb-10">Contact</h4>
              <ul className="space-y-6 text-sm font-medium opacity-60">
                <li className="flex items-start gap-4">
                  <MapPin size={18} className="shrink-0 text-bakery-brass" />
                  <div>
                    <p className="font-bold text-bakery-brass mb-1 uppercase tracking-tighter text-[10px]">Chi nhánh Đà Lạt</p>
                    <span>123 Đường Trần Phú, Phường 3, <br />TP. Đà Lạt, Lâm Đồng</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <MapPin size={18} className="shrink-0 text-bakery-brass" />
                  <div>
                    <p className="font-bold text-bakery-brass mb-1 uppercase tracking-tighter text-[10px]">Chi nhánh TP.HCM</p>
                    <span>23 Lâm Quang Ky, Thủ Đức, <br />TP.HCM</span>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Phone size={18} className="text-bakery-brass" />
                  <span>090 123 4567</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-bakery-brass font-bold mb-10">Newsletter</h4>
              <p className="text-sm opacity-60 mb-6">Nhận thông tin về các mẻ bánh mới nhất.</p>
              <form className="relative">
                <input 
                  type="email" 
                  placeholder="Email của bạn"
                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-sm focus:outline-none focus:border-bakery-brass transition-colors"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-bakery-brass text-bakery-ink px-6 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-colors">
                  S'abonner
                </button>
              </form>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
            className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30">
              © 2026 Croisse Boulangerie & Pâtisserie
            </span>
            <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] font-bold opacity-30">
              <a href="#" className="hover:opacity-100 transition-opacity">Mentions Légales</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Confidentialité</a>
            </div>
          </motion.div>
        </div>
      </motion.footer>

      </motion.div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-bakery-ink/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-bakery-cream z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-bakery-maroon/10 flex items-center justify-between">
                <h2 className="serif text-3xl text-bakery-maroon">Giỏ hàng của bạn</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-bakery-maroon/5 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <ShoppingBag size={64} className="mb-4" />
                    <p className="serif text-xl">Giỏ hàng đang trống</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <AnimatePresence mode="popLayout">
                      {cart.map((item, index) => (
                        <motion.div 
                          layout
                          key={item.id} 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex gap-4"
                        >
                          <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <h4 className="font-bold text-bakery-maroon">{item.name}</h4>
                              <button onClick={() => removeFromCart(item.id)} className="text-bakery-ink/40 hover:text-bakery-accent">
                                <X size={16} />
                              </button>
                            </div>
                            <p className="text-xs text-bakery-ink/60 mb-3">{item.price.toLocaleString()}đ</p>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center border border-bakery-maroon/20 rounded-lg hover:bg-bakery-maroon hover:text-white transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-bold text-sm">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center border border-bakery-maroon/20 rounded-lg hover:bg-bakery-maroon hover:text-white transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="p-8 bg-white border-t border-bakery-maroon/10">
                <div className="flex justify-between mb-6">
                  <span className="text-bakery-ink/60">Tổng cộng</span>
                  <span className="serif text-2xl font-bold text-bakery-maroon">{cartTotal.toLocaleString()}đ</span>
                </div>
                <button 
                  disabled={cart.length === 0}
                  className="w-full bg-bakery-maroon text-white py-4 rounded-2xl font-bold hover:bg-bakery-maroon/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Thanh toán ngay
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
