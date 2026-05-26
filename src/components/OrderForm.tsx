import React, { useState, useMemo } from 'react';
import { ALGERIAN_WILAYAS } from '../data/wilayas';
import { ShoppingBag, Truck, CheckCircle2, AlertCircle, RefreshCw, Landmark, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Order } from '../types';

interface OrderFormProps {
  onOrderSuccess: (order: Order) => void;
}

export default function OrderForm({ onOrderSuccess }: OrderFormProps) {
  // Form values
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilayaCode, setWilayaCode] = useState('16'); // Default Algiers
  const [shippingType, setShippingType] = useState<'home' | 'office'>('home');
  const [comment, setComment] = useState('');

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<Order | null>(null);

  // Pricing Constants
  const PRODUCT_PRICE = 900; // 900 DA

  // Active Wilaya Lookup
  const activeWilaya = useMemo(() => {
    return ALGERIAN_WILAYAS.find(w => w.code === wilayaCode) || ALGERIAN_WILAYAS[0]; // Fallback Algiers
  }, [wilayaCode]);

  // Auto-switch shipping type if selected one is unavailable
  React.useEffect(() => {
    if (activeWilaya.homeDeliveryFee === null && activeWilaya.officeDeliveryFee !== null) {
      setShippingType('office');
    } else if (activeWilaya.officeDeliveryFee === null && activeWilaya.homeDeliveryFee !== null) {
      setShippingType('home');
    }
  }, [activeWilaya]);

  // Shipping Fee calculation
  const shippingFee = useMemo(() => {
    const fee = shippingType === 'home'
      ? activeWilaya.homeDeliveryFee
      : activeWilaya.officeDeliveryFee;
    return fee !== null ? fee : 0;
  }, [activeWilaya, shippingType]);

  const totalPrice = useMemo(() => {
    return PRODUCT_PRICE + shippingFee;
  }, [shippingFee]);

  const isDeliveryUnavailable = useMemo(() => {
    return activeWilaya.homeDeliveryFee === null && activeWilaya.officeDeliveryFee === null;
  }, [activeWilaya]);

  // Filtered Wilayas for Search Dropdown
  const filteredWilayas = useMemo(() => {
    if (!searchQuery.trim()) return ALGERIAN_WILAYAS;
    const q = searchQuery.toLowerCase().trim();
    return ALGERIAN_WILAYAS.filter(w =>
      w.nameAr.includes(q) ||
      w.nameEn.toLowerCase().includes(q) ||
      w.code.includes(q)
    );
  }, [searchQuery]);

  // Phone validation helper
  const isPhoneValid = (num: string) => {
    // Normalizes phone digits, checks for Algerian format:
    // Standard mobile numbers: 05, 06, 07, 09 followed by 8 digits (10 digits total)
    const clean = num.replace(/[\s-+]/g, '');
    if (clean.length === 10 && (clean.startsWith('05') || clean.startsWith('06') || clean.startsWith('07') || clean.startsWith('09'))) {
      return true;
    }
    if (clean.length === 9 && (clean.startsWith('5') || clean.startsWith('6') || clean.startsWith('7') || clean.startsWith('9'))) {
      return true; // leading zero omitted
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic Validations
    if (!customerName.trim()) {
      setFormError('يرجى إدخال الاسم الكامل لتأكيد التوصيل');
      return;
    }
    if (customerName.trim().length < 3) {
      setFormError('الاسم الكامل يجب أن يحتوي على 3 أحرف على الأقل');
      return;
    }
    if (!phone.trim()) {
      setFormError('رقم الهاتف ضروري ليتصل بك عامل التوصيل');
      return;
    }
    if (!isPhoneValid(phone)) {
      setFormError('رقم الهاتف غير صحيح. يرجى إدخال رقم هاتف جزائري صحّي (مثلاً: 0550XXXXXX أو 0660XXXXXX)');
      return;
    }

    if (activeWilaya.homeDeliveryFee === null && activeWilaya.officeDeliveryFee === null) {
      setFormError('التوصيل غير متوفر حالياً لهذه الولاية المحددة. يرجى اختيار ولاية أخرى.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: phone.trim(),
          wilayaCode: activeWilaya.code,
          wilayaName: activeWilaya.nameAr,
          shippingType,
          shippingFee,
          productPrice: PRODUCT_PRICE,
          totalPrice,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشلت عملية حفظ الطلب. يرجى المحاولة لاحقاً');
      }

      setSubmitSuccess(data);
      onOrderSuccess(data);

      // Clean state for fresh submittals if they want to buy again
      setCustomerName('');
      setPhone('');
      setComment('');
    } catch (err: any) {
      setFormError(err.message || 'حدث خطأ غير متوقع أثناء إرسال بيانات الطلب، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="order" className="rounded-3xl glass-panel-heavy p-6 sm:p-8 border border-white/5 scroll-mt-24 w-full">
      
      {/* Form Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-md shadow-emerald-500/10">
          <ShoppingBag className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-2xl font-black text-white sm:text-3xl">
          تأكيد الطلب السريع 🇩🇿
        </h3>
        <p className="text-sm text-gray-400">
          املأ الاستمارة الآن وسيتم الاتصال بك هاتفياً لتأكيد الشحن والتسليم في أقرب وقت.
        </p>
      </div>

          {/* Success Dialog View */}
          {submitSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center space-y-5"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-emerald-400">تم تسجيل طلبك بنجاح! 🎉</h4>
                <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
                  شكراً لثقتكم بـ <strong>N1 TWINPEN</strong>. لقد تم حفظ طلبك برقم مرجعي: <span className="font-mono text-emerald-300 font-bold">{submitSuccess.id}</span>.
                  سوف يتصل بك فريقنا الهاتفي لتأكيد العنوان والشروع في الشحن في أقل من 24 ساعة. يرجى إبقاء الهاتف مفتوحاً.
                </p>
              </div>

              {/* Order Info Summary */}
              <div className="rounded-xl bg-gray-900/60 border border-gray-800 p-4 text-right max-w-md mx-auto space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>الاسم:</span>
                  <span className="text-white font-medium">{submitSuccess.customerName}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>رقم الهاتف:</span>
                  <span className="text-white font-mono">{submitSuccess.phone}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>الولاية:</span>
                  <span className="text-white">{submitSuccess.wilayaName} ({submitSuccess.wilayaCode})</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>طريقة الشحن:</span>
                  <span>{submitSuccess.shippingType === 'home' ? "توصيل للمنزل 🏠" : "استلام من مكتب التوصيل 📦"}</span>
                </div>
                <div className="h-px bg-gray-800 my-1" />
                <div className="flex justify-between text-sm font-bold text-emerald-400">
                  <span>المبلغ الإجمالي المستحق:</span>
                  <span>{submitSuccess.totalPrice} دج</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setSubmitSuccess(null)}
                  className="rounded-xl bg-gray-900 border border-gray-800 px-6 py-2.5 text-xs text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
                >
                  طلب قلم إضافي جديد
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Errors container */}
              {formError && (
                <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-coral-400">
                  <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-rose-300">{formError}</span>
                </div>
              )}

              {/* Order form inputs */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                
                {/* Full name input */}
                <div className="space-y-2 text-right">
                  <label htmlFor="customer-name" className="text-sm font-bold text-gray-200">
                    الاسم الكامل <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: يونس بن شعبان"
                    className="w-full rounded-xl glass-input px-4 py-3 text-sm text-white placeholder-gray-500 text-right focus:outline-none"
                  />
                </div>

                {/* Phone number input */}
                <div className="space-y-2 text-right">
                  <label htmlFor="phone" className="text-sm font-bold text-gray-200">
                    رقم الهاتف للاتصال بكم <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: 0550123456"
                    className="w-full rounded-xl glass-input px-4 py-3 text-sm text-white placeholder-gray-500 text-right font-mono focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-500 block">يرجى إدخال رقم هاتف متاح ومفعل للرد على مكالمتنا تأكيد الطلب.</span>
                </div>

              </div>

              {/* Algerian search-friendly drop-down selection */}
              <div className="relative space-y-2 text-right">
                <label className="text-sm font-bold text-gray-200">
                  اختر ولايتك <span className="text-rose-500">*</span>
                </label>
                
                {/* Selected Item Trigger Display */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex w-full items-center justify-between rounded-xl glass-input px-4 py-3 text-sm text-white focus:outline-none"
                >
                  <span className="text-gray-400 text-xs">اضغط لتغيير الولاية 🔻</span>
                  <span className="font-bold">
                    {activeWilaya.code} - {activeWilaya.nameAr} ({activeWilaya.nameEn})
                  </span>
                </button>

                {/* Dropdown element inside floating card */}
                {isDropdownOpen && (
                  <div
                    className="absolute left-0 right-0 z-[9999] mt-1 max-h-72 overflow-y-auto rounded-xl border border-slate-700/80 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] text-right focus:outline-none"
                    dir="rtl"
                    style={{ backgroundColor: '#0f172a', opacity: 1 }}
                  >
                    {/* Search Field inside dropdown list */}
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث عن ولايتك بالاسم أو الرقم..."
                      className="mb-2.5 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-right"
                    />
                    
                    <div className="space-y-1">
                      {filteredWilayas.length > 0 ? (
                        filteredWilayas.map((wilaya) => (
                          <button
                            key={wilaya.code}
                            type="button"
                            onClick={() => {
                              setWilayaCode(wilaya.code);
                              setIsDropdownOpen(false);
                              setSearchQuery('');
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs transition-colors text-right outline-none cursor-pointer ${
                              wilaya.code === wilayaCode
                                ? 'bg-blue-600 text-white font-bold'
                                : 'text-gray-100 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <span className="font-mono text-gray-400 text-[10px] font-bold">
                              {wilaya.code}
                            </span>
                            <span className="font-bold text-gray-100">
                              {wilaya.nameAr} - {wilaya.nameEn}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-center text-xs text-gray-400 font-bold">
                          لا توجد نتائج مطابقة لبحثك
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Home Delivery vs Custom Desk Delivery Option Selector */}
              <div className="space-y-3">
                <span className="text-sm font-bold text-gray-200 block text-right">خيارات الشحن والتسليم المتاحة للولاية:</span>
                
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Home shipping */}
                  <div
                    onClick={() => activeWilaya.homeDeliveryFee !== null && setShippingType('home')}
                    className={`relative flex items-center gap-2 sm:gap-4 rounded-2xl border-2 p-2.5 sm:p-4 select-none transition-all ${
                      activeWilaya.homeDeliveryFee === null
                        ? 'opacity-40 cursor-not-allowed border-white/5 bg-gray-900/40'
                        : shippingType === 'home'
                        ? 'border-blue-600 bg-blue-500/5 cursor-pointer'
                        : 'border-white/10 glass-card cursor-pointer hover:border-blue-500/40'
                    }`}
                  >
                    <div className="shrink-0 rounded-xl bg-blue-500/10 p-2 sm:p-2.5 text-blue-400">
                      <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="text-right space-y-0.5">
                      <span className="text-xs sm:text-sm font-bold text-white block">توصيل للمنزل</span>
                      <span className="text-[10px] text-gray-400 hidden sm:block">الدفع عند استلام الطرد بيدك</span>
                      <span className="text-xs font-mono font-bold text-blue-400 block text-right">
                        {activeWilaya.homeDeliveryFee !== null ? `${activeWilaya.homeDeliveryFee} دج` : 'غير متوفر'}
                      </span>
                    </div>
                  </div>

                  {/* Office / Desk Delivery */}
                  <div
                    onClick={() => activeWilaya.officeDeliveryFee !== null && setShippingType('office')}
                    className={`relative flex items-center gap-2 sm:gap-4 rounded-2xl border-2 p-2.5 sm:p-4 select-none transition-all ${
                      activeWilaya.officeDeliveryFee === null
                        ? 'opacity-40 cursor-not-allowed border-white/5 bg-gray-900/40'
                        : shippingType === 'office'
                        ? 'border-indigo-600 bg-indigo-500/5 cursor-pointer'
                        : 'border-white/10 glass-card cursor-pointer hover:border-indigo-500/40'
                    }`}
                  >
                    <div className="shrink-0 rounded-xl bg-indigo-500/10 p-2 sm:p-2.5 text-indigo-400">
                      <Landmark className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="text-right space-y-0.5">
                      <span className="text-xs sm:text-sm font-bold text-white block">استلام من المكتب</span>
                      <span className="text-[10px] text-gray-400 hidden sm:block">من وكالة شركة التوصيل المحلية</span>
                      <span className="text-xs font-mono font-bold text-indigo-400 block text-right">
                        {activeWilaya.officeDeliveryFee !== null ? `${activeWilaya.officeDeliveryFee} دج` : 'غير متوفر'}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Info messages on null choices */}
                {activeWilaya.homeDeliveryFee === null && activeWilaya.officeDeliveryFee !== null && (
                  <p className="text-xs text-amber-400 text-right pr-2 font-bold">⚠️ خيار التوصيل للمنزل غير متوفر لولاية {activeWilaya.nameAr} (تم اختيار مكتب التوصيل تلقائياً)</p>
                )}
                {activeWilaya.officeDeliveryFee === null && activeWilaya.homeDeliveryFee !== null && (
                  <p className="text-xs text-amber-400 text-right pr-2 font-bold">⚠️ خيار مكتب التوصيل غير متوفر لهذه الولاية</p>
                )}
                {isDeliveryUnavailable && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-rose-400 text-right font-bold text-xs" dir="rtl">
                    <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                    <span>التوصيل غير متوفر حالياً لهذه الولاية</span>
                  </div>
                )}
              </div>



              {/* Detailed billing item breakdown card */}
              <div className="rounded-2xl glass-card p-5 space-y-3">
                <span className="text-xs font-bold text-indigo-400 block text-right">فاتورة الشراء الكلية للتأكيد:</span>
                
                <div className="flex justify-between text-sm text-gray-400">
                  <span className="font-mono text-white font-bold">{PRODUCT_PRICE} دج</span>
                  <span>قلم N1 TWINPEN الذكي (عدد 1):</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span className="font-mono text-white font-bold">{isDeliveryUnavailable ? 'غير متوفر' : `${shippingFee} دج`}</span>
                  <span>تكلفة الشحن لولاية ({activeWilaya.nameAr}):</span>
                </div>
                <div className="h-px bg-gray-900" />
                <div className="flex justify-between text-base font-black text-white">
                  <span className="font-mono text-emerald-400 text-lg">{isDeliveryUnavailable ? 'غير متوفر' : `${totalPrice} دج`}</span>
                  <span>المبلغ الإجمالي عند تسليم الطرد:</span>
                </div>
              </div>

              {/* Confirm Submit action button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || isDeliveryUnavailable}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-emerald-600 to-teal-600 py-4 px-6 text-base font-bold text-white shadow-lg shadow-emerald-500/10 hover:from-emerald-500 hover:to-teal-500 transition-all focus:outline-none hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>جاري معالجة وحفظ الطلب...</span>
                    </>
                  ) : isDeliveryUnavailable ? (
                    <span>يرجى اختيار ولاية أخرى تتوفر بها خدمة التوصيل</span>
                  ) : (
                    <>
                      <span>اطلب الآن</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

    </div>
  );
}
