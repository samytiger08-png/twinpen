import React, { useState, useEffect, useMemo } from 'react';
import { Order } from '../types';
import { 
  BarChart3, 
  Trash2, 
  PhoneCall, 
  CheckCircle, 
  XCircle, 
  Search, 
  Download, 
  Eye, 
  ShieldAlert, 
  ShieldCheck, 
  Filter, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingCart,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  orders: Order[];
  onRefresh: () => void;
  onUpdateStatus: (id: string, status: Order['status']) => void;
  onDeleteOrder: (id: string) => void;
}

export default function AdminDashboard({ orders, onRefresh, onUpdateStatus, onDeleteOrder }: AdminDashboardProps) {
  // Authentication PIN
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [wilayaFilter, setWilayaFilter] = useState('all');

  // Verify PIN helper
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputPin = pin.trim();
    if (inputPin === 'samysaidtest2026') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // Unique Wilayas in active orders for filters
  const uniqueWilayas = useMemo(() => {
    const set = new Set<string>();
    orders.forEach(o => set.add(o.wilayaName));
    return Array.from(set);
  }, [orders]);

  // Analytics calculator
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const confirmedCount = orders.filter(o => o.status === 'confirmed' || o.status === 'delivered').length;
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.productPrice, 0);
    const totalShipping = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.shippingFee, 0);

    return {
      totalOrders,
      confirmedCount,
      totalRevenue,
      totalShipping,
      averageTicket: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
    };
  }, [orders]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = 
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.phone.includes(searchTerm) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchWilaya = wilayaFilter === 'all' || o.wilayaName === wilayaFilter;

      return matchSearch && matchStatus && matchWilaya;
    });
  }, [orders, searchTerm, statusFilter, wilayaFilter]);

  // CSV Exporter Action helper
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return;

    // Structure headers
    const headers = ['رقم الطلب', 'الاسم بالكامل', 'رقم الهاتف', 'الولاية', 'طريقة التوصيل', 'سعر القلم', 'تكلفة الشحن', 'المجموع الكلي', 'ملاحظات الزبون', 'الحالة', 'تاريخ الطلب'];
    
    // Convert to CSV string row by row
    const csvRows = [
      headers.join(','),
      ...filteredOrders.map(o => [
        o.id,
        `"${o.customerName.replace(/"/g, '""')}"`,
        `"${o.phone}"`,
        `"${o.wilayaName}"`,
        o.shippingType === 'home' ? 'توصيل للمنزل' : 'استلام من مكتب التوصيل',
        o.productPrice,
        o.shippingFee,
        o.totalPrice,
        `"${(o.comment || '').replace(/"/g, '""')}"`,
        o.status,
        new Date(o.createdAt).toLocaleString('en-US')
      ].join(','))
    ];

    const csvContent = '\uFEFF' + csvRows.join('\n'); // UTF-8 BOM for Excel Arabic characters
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_n1_twinpen_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'new':
        return <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 text-xs text-blue-400 font-bold">طلب جديد 🆕</span>;
      case 'confirmed':
        return <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs text-amber-400 font-bold">تم التأكيد 📞</span>;
      case 'delivered':
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs text-emerald-400 font-bold">تم التوصيل ✔️</span>;
      case 'cancelled':
        return <span className="rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 text-xs text-rose-400 font-bold">ملغي ❌</span>;
    }
  };

  // Secure PIN Prompt screen
  if (!isAuthenticated) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-[#08080a]">
        <div className="mx-auto max-w-md">
          <div className="rounded-3xl glass-panel-heavy p-8 text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
              <ShieldAlert className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">لوحة تحكم طلبات N1 TWINPEN</h3>
              <p className="text-xs text-gray-400">
                منطقة محمية - هذه اللوحة مخصصة لإدارة ومبيعات الطلبات لـ يونس وللعائلة.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="أدخل رمز المرور الإداري..."
                className="w-full rounded-xl glass-input px-4 py-3 text-center text-sm font-bold tracking-widest text-white focus:outline-none"
              />
              
              {authError && (
                <p className="text-xs text-rose-400 font-bold">رمز المرور غير صحيح!</p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-l from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer"
              >
                تأكيد وبدء العمل
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-white/5 bg-[#08080a] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header Action Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div className="text-right space-y-1">
            <h2 className="text-2xl font-black text-white flex items-center justify-end gap-2">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              لوحة إدارة الطلبات المستلمة والتحليلات
            </h2>
            <p className="text-xs text-gray-400">
              متابعة الزبائن المسجلين، تأكيد الشحن، سحب تقرير المبيعات بنقرة واحدة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCSV}
              disabled={filteredOrders.length === 0}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 transition-all cursor-pointer disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
              تصدير المبيعات لملف Excel (CSV)
            </button>

            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 text-xs px-4 py-2.5 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              تحديث البيانات تلقائياً
            </button>
          </div>
        </div>

        {/* Quick Analytics Stats Cards */}
        <div id="admin-stats" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          
          <div className="rounded-2xl glass-card p-4 text-right space-y-1 shadow-lg">
            <div className="flex items-center justify-between">
              <ShoppingCart className="h-5 w-5 text-blue-400" />
              <span className="text-[10px] text-gray-400 font-bold">إجمالي الطلبات</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">{stats.totalOrders}</div>
            <span className="text-[10px] text-gray-400 block">من كافة ولايات الجزائر</span>
          </div>

          <div className="rounded-2xl glass-card p-4 text-right space-y-1 shadow-lg">
            <div className="flex items-center justify-between">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span className="text-[10px] text-gray-400 font-bold">طلبات جاهزة / مؤكدة</span>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">{stats.confirmedCount}</div>
            <span className="text-[10px] text-gray-400 block font-sans">
              نسبة نجاح: {stats.totalOrders > 0 ? Math.round((stats.confirmedCount / stats.totalOrders) * 100) : 0}%
            </span>
          </div>

          <div className="rounded-2xl glass-card p-4 text-right space-y-1 shadow-lg">
            <div className="flex items-center justify-between">
              <DollarSign className="h-5 w-5 text-indigo-400" />
              <span className="text-[10px] text-gray-400 font-bold">القيمة المتوقعة للمبيعات</span>
            </div>
            <div className="text-2xl font-black text-indigo-400 font-mono">{stats.totalRevenue} <span className="text-xs text-gray-300">دج</span></div>
            <span className="text-[10px] text-gray-400 block font-sans">قيمة المنتجات فقط</span>
          </div>

          <div className="rounded-2xl glass-card p-4 text-right space-y-1 shadow-lg">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-pink-400" />
              <span className="text-[10px] text-gray-400 font-bold">مجموع تكاليف الشحن</span>
            </div>
            <div className="text-2xl font-black text-pink-400 font-mono">{stats.totalShipping} <span className="text-xs text-gray-300">دج</span></div>
            <span className="text-[10px] text-gray-400 block font-sans">يتم استلامها من زبون التوصيل</span>
          </div>

        </div>

        {/* Filters Controls block */}
        <div className="rounded-2xl glass-card p-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن زبون بالاسم أو رقم الهاتف..."
              className="w-full rounded-xl glass-input pl-10 pr-4 py-2 text-xs text-white focus:outline-none placeholder-gray-500 text-right"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <div className="flex w-full sm:w-2/3 flex-wrap items-center justify-end gap-3 font-sans">
            {/* Status Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="rounded-lg glass-input text-gray-300 px-3 py-2 focus:outline-none"
              >
                <option value="all" className="bg-[#08080a]">فلتر الحالة: الكل</option>
                <option value="new" className="bg-[#08080a]">طلبات جديدة</option>
                <option value="confirmed" className="bg-[#08080a]">تم تأكيد الاتصال</option>
                <option value="delivered" className="bg-[#08080a]">تم توصيل الشحنة</option>
                <option value="cancelled" className="bg-[#08080a]">طلبات ملغية</option>
              </select>
            </div>

            {/* Wilaya Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <select
                value={wilayaFilter}
                onChange={(e) => setWilayaFilter(e.target.value)}
                className="rounded-lg glass-input text-gray-300 px-3 py-2 focus:outline-none"
              >
                <option value="all" className="bg-[#08080a]">فلتر ولايات الجزائر:الكل</option>
                {uniqueWilayas.map(w => (
                  <option key={w} value={w} className="bg-[#08080a]">{w}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Orders Table */}
        <div id="admin-orders-table" className="overflow-x-auto rounded-2xl glass-panel shadow-2xl">
          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/3 text-xs font-bold text-gray-300">
                <th className="px-5 py-4">رقم الطلب</th>
                <th className="px-5 py-4">الزبون</th>
                <th className="px-5 py-4">الهاتف</th>
                <th className="px-5 py-4">الولاية والموقع</th>
                <th className="px-5 py-4">التسليم</th>
                <th className="px-5 py-4">المجموع المؤكد</th>
                <th className="px-5 py-4">الحالة</th>
                <th className="px-5 py-4">ملاحظات العميل</th>
                <th className="px-5 py-4 text-center">أوامر التحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/3 transition-colors">
                    
                    {/* ID */}
                    <td className="px-5 py-4 font-mono text-xs text-blue-400 font-bold whitespace-nowrap">
                      {order.id}
                    </td>

                    {/* Customer Info */}
                    <td className="px-5 py-4 font-semibold text-white whitespace-nowrap">
                      {order.customerName}
                    </td>

                    {/* Phone block */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <a
                        href={`tel:${order.phone}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0e1320] text-gray-300 font-mono hover:text-emerald-400 border border-gray-800/80 px-2.5 py-1 text-xs"
                      >
                        <PhoneCall className="h-3 w-3 text-emerald-400" />
                        <span>{order.phone}</span>
                      </a>
                    </td>

                    {/* Wilaya Info */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-white block font-medium">الولاية: {order.wilayaName}</span>
                      <span className="text-[11px] text-gray-500 font-mono">رقم: {order.wilayaCode}</span>
                    </td>

                    {/* Shipping Method */}
                    <td className="px-5 py-4 text-xs whitespace-nowrap">
                      <span>{order.shippingType === 'home' ? '🏠 المنزل' : '📦 المكتب'}</span>
                      <span className="text-gray-500 block text-[10px]">شحن: {order.shippingFee} دج</span>
                    </td>

                    {/* Dynamic total price */}
                    <td className="px-5 py-4 font-bold text-emerald-400 whitespace-nowrap font-mono">
                      {order.totalPrice} دج
                    </td>

                    {/* Current status tag */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>

                    {/* Optional Comments text details popup style */}
                    <td className="px-5 py-4 max-w-xs truncate text-xs text-gray-500" title={order.comment}>
                      {order.comment || <span className="italic text-gray-700">لا توجد ملاحظة</span>}
                    </td>

                    {/* Main administrative controllers */}
                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Mark Confirmed */}
                        <button
                          onClick={() => onUpdateStatus(order.id, 'confirmed')}
                          className="rounded p-1.5 text-xs hover:bg-amber-500/10 text-amber-500/80 hover:text-amber-400 transition-colors"
                          title="تأكيد الاتصال والموافقة"
                        >
                          <Clock className="h-4 w-4" />
                        </button>

                        {/* Mark Delivered */}
                        <button
                          onClick={() => onUpdateStatus(order.id, 'delivered')}
                          className="rounded p-1.5 text-xs hover:bg-emerald-500/10 text-emerald-500/80 hover:text-emerald-400 transition-colors"
                          title="تم التوصيل للزبون"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>

                        {/* Mark Cancelled */}
                        <button
                          onClick={() => onUpdateStatus(order.id, 'cancelled')}
                          className="rounded p-1.5 text-xs hover:bg-rose-500/10 text-rose-500/80 hover:text-rose-400 transition-colors"
                          title="إلغاء الطلب"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>

                        <div className="w-px h-4 bg-gray-800 mx-1" />

                        {/* Delete Permanently */}
                        <button
                          onClick={() => {
                            if (window.confirm('هل أنت متأكد من حذف هذا الطلب نهائياً ومسحه من قاعدة البيانات؟')) {
                              onDeleteOrder(order.id);
                            }
                          }}
                          className="rounded p-1.5 text-xs hover:bg-rose-600/10 text-gray-500 hover:text-rose-500 transition-colors"
                          title="مسح الطلب من السجلات"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center text-gray-500">
                    لا تتوفر أي طلبات مطابقة للفلاتر المعنية فالحساب حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Help block explanation footer */}
        <div className="flex items-center gap-3 rounded-2xl glass-card p-4 text-xs text-gray-300 max-w-3xl">
          <ShieldAlert className="h-5 w-5 text-blue-400 shrink-0" />
          <p className="leading-relaxed">
            <strong>نصيحة إدارية للتشغيل:</strong> يمكنك تصدير الطلبات لمثبت Excel لطباعة الملصقات بسرعة وإعطائها لشركات الشحن الجزائرية (مثال: Yalidine أو ZR Express) لبدء التوزيع الفوري لطلبات الزبائن.
          </p>
        </div>

      </div>
    </section>
  );
}
