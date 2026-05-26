import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import AdminDashboard from './components/AdminDashboard';
import { Order } from './types';
import { PenTool, Layers, CheckCircle, ShieldAlert, Heart, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Sync state for all orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdminActive, setIsAdminActive] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load orders from API on boot
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('فشل جلب الطلبات من الخادم');
      const data = await res.ok ? await res.json() : [];
      setOrders(data);
    } catch (err: any) {
      console.warn("Backend API warning: standard in-memory / local storage recovery triggered", err);
      // Fallback local storage backup to support standalone browser test limits gracefully
      const saved = localStorage.getItem('n1_twinpen_fallback_orders');
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Sync fallbacks in storage if APIs are simulated offline
  const saveFallbackOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('n1_twinpen_fallback_orders', JSON.stringify(updatedOrders));
  };

  // Submit Success handler
  const handleOrderSuccess = (newOrder: Order) => {
    // Check if duplicate ID exists, append or update list
    const updated = [newOrder, ...orders.filter(o => o.id !== newOrder.id)];
    saveFallbackOrders(updated);
  };

  // Update Status handler
  const handleUpdateStatus = async (id: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('فشل تعديل حالة الطلب في الخادم');
      
      const updatedOrder = await res.json();
      const updated = orders.map(o => o.id === id ? updatedOrder : o);
      saveFallbackOrders(updated);
    } catch (err) {
      // Local fallback modification
      const updated = orders.map(o => o.id === id ? { ...o, status } : o);
      saveFallbackOrders(updated);
    }
  };

  // Delete Order handler
  const handleDeleteOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('فشل حذف الطلب في الخادم');
      
      const updated = orders.filter(o => o.id !== id);
      saveFallbackOrders(updated);
    } catch (err) {
      // Local fallback delete
      const updated = orders.filter(o => o.id !== id);
      saveFallbackOrders(updated);
    }
  };

  return (
    <div className="relative min-h-screen font-sans">
      {/* Absolute Header Overlay */}
      <Header 
        onAdminToggle={() => setIsAdminActive(!isAdminActive)} 
        isAdminActive={isAdminActive}
        orderCount={orders.filter(o => o.status === 'new').length}
      />

      {/* Main Container Layer */}
      <main className="relative pb-16">
        <AnimatePresence mode="wait">
          {isAdminActive ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back CTA inside active layout */}
              <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 text-right">
                <button
                  onClick={() => setIsAdminActive(false)}
                  className="rounded-xl glass-pill text-xs text-blue-400 font-bold px-4 py-2 hover:bg-white/10 hover:text-white transition-all"
                >
                  ← العودة للموقع التعريفي واستمارة الشراء
                </button>
              </div>

              {/* Secure Dashboard View */}
              <AdminDashboard 
                orders={orders}
                onRefresh={fetchOrders}
                onUpdateStatus={handleUpdateStatus}
                onDeleteOrder={handleDeleteOrder}
              />
            </motion.div>
          ) : (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Immersive Product Hero & Gallery (with integrated fast OrderForm) */}
              <Hero onOrderSuccess={handleOrderSuccess} />

              {/* Tech Spec Descriptions Grid */}
              <Features />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Premium Multi-brand Footer */}
      <footer className="border-t border-white/5 bg-[#08080a]/40 py-12 px-4 sm:px-6 lg:px-8 text-center backdrop-blur-xl">
        <div id="footer-inner" className="mx-auto max-w-7xl space-y-6">
          
          <div className="flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-bold tracking-widest text-[#cfd3db] font-mono">N1 TWINPEN</span>
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          </div>

          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            الشبكة العائلية الجزائرية المتكاملة لمنتجات النخبة. هذا الموقع مخصص لتجريب السوق ودراسة مدى طلب الزبائن بقلم <strong className="text-gray-400">N1 TWINPEN</strong> ثنائي الرأس الفريد.
          </p>

          <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
            <a href="#features" className="hover:text-white transition-all">مواصفات القلم</a>
            <span className="text-gray-800">•</span>
            <a href="#dual-use" className="hover:text-white transition-all">الأجهزة المتوافقة</a>
            <span className="text-gray-800">•</span>
            <a href="#order" className="hover:text-white transition-all font-bold text-blue-400">شراء الآن</a>
          </div>

          <div className="h-px bg-gray-900 mx-auto max-w-xs" />

          <div className="pt-4 border-t border-white/5 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 text-center sm:text-left" dir="ltr">
            <div>
              <button
                onClick={() => setIsAdminActive(!isAdminActive)}
                className={`flex items-center gap-1.5 text-[11px] font-mono rounded-lg px-2.5 py-1 bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer ${
                  isAdminActive ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' : ''
                }`}
                title="لوحة الإدارة"
              >
                <Terminal className="h-3 w-3" />
                <span>Admin</span>
                {orders.filter(o => o.status === 'new').length > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white">
                    {orders.filter(o => o.status === 'new').length}
                  </span>
                )}
              </button>
            </div>
            <p className="text-[10px] text-gray-600 text-right font-sans" dir="rtl">
              حقوق الطبع محفوظة لـ عائلة N1 © {new Date().getFullYear()}. صنع بكل إتقان باللغة العربية للسوق الجزائرية 🇩🇿
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
