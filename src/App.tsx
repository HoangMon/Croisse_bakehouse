import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Plus, Minus, Instagram, MapPin, Phone, ChevronRight } from 'lucide-react';
import { MENU_ITEMS, MenuItem } from './constants';

interface CartItem extends MenuItem {
  quantity: number;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Nhào bột...');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bakery-cream/80 backdrop-blur-md border-b border-bakery-maroon/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1620921515201-999092955324?q=80&w=200&auto=format&fit=crop" 
                alt="Croisse Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="serif text-4xl font-bold tracking-tighter text-bakery-maroon">Croisse</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-medium">
            <a href="#menu" className="hover:text-bakery-accent transition-colors">Menu</a>
            <a href="#about" className="hover:text-bakery-accent transition-colors">Về chúng tôi</a>
            <a href="#contact" className="hover:text-bakery-accent transition-colors">Liên hệ</a>
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 hover:bg-bakery-maroon/5 rounded-full transition-colors"
          >
            <ShoppingBag size={24} className="text-bakery-maroon" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-bakery-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-10 flex flex-col items-start gap-6">
              <img 
                src="https://images.unsplash.com/photo-1620921515201-999092955324?q=80&w=400&auto=format&fit=crop" 
                alt="Croisse Logo" 
                className="w-48 h-48 object-contain -ml-4"
                referrerPolicy="no-referrer"
              />
              <span className="inline-block py-1.5 px-4 bg-bakery-maroon/10 text-bakery-maroon text-xs font-bold uppercase tracking-[0.2em] rounded-full">
                Đà Lạt's Finest Croissants
              </span>
            </div>
            <h1 className="serif text-7xl md:text-8xl lg:text-9xl leading-[0.85] mb-8 text-bakery-maroon">
              Hương vị <br />
              <span className="italic">Pháp</span> giữa <br />
              lòng Đà Lạt
            </h1>
            <p className="text-lg text-bakery-ink/70 max-w-md mb-10 leading-relaxed">
              Tiệm bánh Croissant thủ công với công thức truyền thống, sử dụng bơ AOP Pháp thượng hạng và nguyên liệu tươi ngon nhất từ cao nguyên.
            </p>
            <a 
              href="#menu"
              className="inline-flex items-center gap-3 bg-bakery-olive text-bakery-cream px-8 py-4 rounded-full font-bold hover:bg-bakery-olive/90 transition-all group"
            >
              Khám phá thực đơn
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&auto=format&fit=crop" 
              alt="Fresh Croissants"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bakery-olive/40 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl">
                <p className="serif text-2xl text-white italic">"Mỗi chiếc bánh là một tác phẩm nghệ thuật ngàn lớp."</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="serif text-5xl md:text-6xl text-bakery-maroon mb-4">Thực đơn của chúng tôi</h2>
              <p className="text-bakery-ink/60">Lựa chọn những hương vị đặc trưng nhất từ Croisse.</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    activeCategory === cat 
                      ? 'bg-bakery-maroon text-white' 
                      : 'bg-bakery-cream text-bakery-maroon hover:bg-bakery-maroon/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group"
                >
                  <div className="relative aspect-square rounded-[32px] overflow-hidden mb-6 bg-bakery-cream">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={() => addToCart(item)}
                      className="absolute bottom-6 right-6 bg-white text-bakery-maroon p-4 rounded-2xl shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-bakery-maroon hover:text-white"
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="serif text-2xl font-bold text-bakery-maroon">{item.name}</h3>
                    <span className="font-bold text-bakery-accent">{item.price.toLocaleString()}đ</span>
                  </div>
                  <p className="text-sm text-bakery-ink/60 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-bakery-maroon rounded-[60px] p-12 md:p-24 text-bakery-cream relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="serif text-6xl md:text-7xl mb-8">Nghệ thuật <br /><span className="italic">ngàn lớp</span></h2>
            <p className="text-lg opacity-80 leading-relaxed mb-12">
              Tại Croisse, chúng tôi tin rằng sự kiên nhẫn là chìa khóa của hương vị. Mỗi chiếc bánh mất hơn 48 giờ để hoàn thành, từ việc ủ bột chậm đến kỹ thuật cán bơ thủ công, tạo nên lớp vỏ giòn tan và ruột bánh mềm mượt như lụa.
            </p>
            <div className="grid grid-cols-2 gap-12">
              <div>
                <span className="serif text-5xl block mb-2">100%</span>
                <span className="text-xs uppercase tracking-widest font-bold opacity-60">Bơ AOP Pháp</span>
              </div>
              <div>
                <span className="serif text-5xl block mb-2">48h</span>
                <span className="text-xs uppercase tracking-widest font-bold opacity-60">Ủ bột chậm</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop" 
              alt="Baking process"
              className="w-full h-full object-cover opacity-30 mix-blend-overlay"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-24 bg-bakery-cream border-t border-bakery-maroon/10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="lg:col-span-1">
            <span className="serif text-4xl font-bold text-bakery-maroon block mb-6">Croisse</span>
            <p className="text-sm text-bakery-ink/60 leading-relaxed">
              Tiệm bánh Croissant thủ công mang phong vị Pháp đến với thành phố ngàn hoa Đà Lạt.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-bakery-maroon">Liên hệ</h4>
            <ul className="space-y-4 text-sm text-bakery-ink/70">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 text-bakery-accent" />
                <span>123 Đường Trần Phú, Phường 3, <br />TP. Đà Lạt, Lâm Đồng</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-bakery-accent" />
                <span>090 123 4567</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-bakery-maroon">Giờ mở cửa</h4>
            <ul className="space-y-2 text-sm text-bakery-ink/70">
              <li className="flex justify-between">
                <span>Thứ 2 - Thứ 6</span>
                <span className="font-bold">07:00 - 21:00</span>
              </li>
              <li className="flex justify-between">
                <span>Thứ 7 - CN</span>
                <span className="font-bold">07:00 - 22:00</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-bakery-maroon">Theo dõi</h4>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-bakery-maroon text-white rounded-2xl hover:bg-bakery-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-3 bg-bakery-maroon text-white rounded-2xl hover:bg-bakery-accent transition-colors">
                <span className="font-bold text-sm">fb</span>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-bakery-maroon/5 text-center text-xs text-bakery-ink/40 font-medium uppercase tracking-widest">
          © 2026 Croisse Bakery Đà Lạt. All rights reserved.
        </div>
      </footer>

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
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4">
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
                      </div>
                    ))}
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
