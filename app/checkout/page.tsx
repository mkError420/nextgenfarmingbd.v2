'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/CartContext';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  ArrowLeft, 
  CheckCircle2, 
  Package, 
  MapPin, 
  Phone, 
  User,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, subtotal, totalItems, clearCart } = useCart();
  const router = useRouter();
  const [isOrdered, setIsOrdered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Dhaka',
    notes: ''
  });

  const shipping = (formData.city === 'Dhaka' || subtotal >= 10000) ? 0 : 60;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('আপনার কার্ট খালি!');
      return;
    }

    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('অনুগ্রহ করে সব প্রয়োজনীয় তথ্য প্রদান করুন।');
      return;
    }

    // Simulate order processing
    toast.loading('অর্ডার প্রসেস করা হচ্ছে...', { duration: 2000 });
    
    setTimeout(() => {
      setIsOrdered(true);
      clearCart();
      toast.success('অর্ডার সফলভাবে সম্পন্ন হয়েছে!');
      window.scrollTo(0, 0);
    }, 2000);
  };

  if (isOrdered) {
    return (
      <main className="min-h-screen bg-[#fcfdfa]">
        <Header />
        <section className="max-w-3xl mx-auto px-4 py-20 md:py-32 text-center space-y-10">
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             className="w-24 h-24 bg-brand-green text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-brand-green/20"
           >
              <CheckCircle2 size={48} />
           </motion.div>
           
           <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-brand-green-dark italic tracking-tighter">অভিনন্দন!</h1>
              <p className="text-xl text-slate-600 font-bold italic">আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।</p>
           </div>
           
           <div className="bg-white border border-emerald-50 rounded-[3rem] p-10 shadow-sm max-w-xl mx-auto space-y-6">
              <p className="text-slate-500 font-medium italic leading-relaxed">
                আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন অর্ডারটি নিশ্চিত করার জন্য। ততক্ষণ পর্যন্ত আমাদের সাথেই থাকুন।
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Link href="/shop" className="bg-brand-green text-white px-8 py-4 rounded-2xl font-black italic shadow-lg shadow-brand-green/10 hover:bg-brand-green-dark transition-all">শপিং চালিয়ে যান</Link>
                 <Link href="/" className="bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-black italic hover:bg-slate-200 transition-all">হোম পেজ</Link>
              </div>
           </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (cart.length === 0 && !isOrdered) {
    return (
      <main className="min-h-screen bg-brand-bg">
        <Header />
        <section className="max-w-7xl mx-auto px-4 py-32 text-center space-y-8">
           <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-brand-green">
              <ShoppingBag size={64} />
           </div>
           <h1 className="text-4xl font-black text-brand-green-dark italic tracking-tight">চেকআউট করার জন্য কোনো পণ্য নেই!</h1>
           <Link href="/shop" className="inline-flex items-center gap-3 bg-brand-green text-white px-10 py-5 rounded-3xl font-black shadow-xl shadow-brand-green/20 hover:bg-brand-green-dark transition-all">
              <ArrowLeft size={20} /> কেনাকাটা করুন
           </Link>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfdfa]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
              <h1 className="text-4xl md:text-6xl font-black text-brand-green-dark italic tracking-tighter">চেকআউট</h1>
              <p className="text-slate-400 font-bold italic mt-2">অর্ডারটি সম্পন্ন করতে আপনার তথ্য প্রদান করুন</p>
           </div>
           <Link href="/cart" className="flex items-center gap-2 text-brand-green font-black italic hover:underline">
              <ArrowLeft size={18} /> কার্টে ফিরে যান
           </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-12 items-start">
           
           {/* Checkout Form */}
           <div className="lg:col-span-7 space-y-8">
              <div className="bg-white rounded-[3rem] border border-emerald-50 shadow-sm p-8 md:p-12 space-y-10">
                 
                 {/* Billing Section */}
                 <div className="space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white">
                          <User size={20} />
                       </div>
                       <h3 className="text-2xl font-black text-brand-green-dark italic">শিপিং তথ্য</h3>
                    </div>

                    <div className="grid gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">আপনার নাম *</label>
                          <input 
                            required
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="পুরো নাম লিখুন" 
                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-bold"
                          />
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">মোবাইল নম্বর *</label>
                          <div className="relative">
                             <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                             <input 
                               required
                               type="tel" 
                               name="phone"
                               value={formData.phone}
                               onChange={handleInputChange}
                               placeholder="০১XXXXXXXXX" 
                               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-14 py-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-bold"
                             />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">ঠিকানা (ফুল এড্রেস) *</label>
                          <div className="relative">
                             <MapPin size={18} className="absolute left-6 top-6 text-slate-300" />
                             <textarea 
                               required
                               name="address"
                               value={formData.address}
                               onChange={handleInputChange}
                               rows={3}
                               placeholder="আপনার বিস্তারিত ঠিকানা লিখুন" 
                               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-14 py-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-bold resize-none"
                             />
                          </div>
                       </div>

                       <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">শহর</label>
                             <select 
                               name="city"
                               value={formData.city}
                               onChange={handleInputChange}
                               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm focus:border-brand-green outline-none transition-all font-bold appearance-none"
                             >
                                <option value="Dhaka">Dhaka</option>
                                <option value="Chittagong">Chittagong</option>
                                <option value="Sylhet">Sylhet</option>
                                <option value="Rajshahi">Rajshahi</option>
                                <option value="Khulna">Khulna</option>
                                <option value="Barisal">Barisal</option>
                                <option value="Rangpur">Rangpur</option>
                                <option value="Mymensingh">Mymensingh</option>
                                <option value="Outside">Other Districts</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">অর্ডার নোট (ঐচ্ছিক)</label>
                             <input 
                               type="text" 
                               name="notes"
                               value={formData.notes}
                               onChange={handleInputChange}
                               placeholder="বিশেষ কোনো অনুরোধ থাকলে" 
                               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-bold"
                             />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Payment Section */}
                 <div className="space-y-8 pt-10 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white">
                          <CreditCard size={20} />
                       </div>
                       <h3 className="text-2xl font-black text-brand-green-dark italic">পেমেন্ট পদ্ধতি</h3>
                    </div>

                    <div className="space-y-4">
                       <label className="relative flex items-center gap-4 p-6 bg-emerald-50 rounded-3xl border-2 border-brand-green cursor-pointer">
                          <input type="radio" name="payment" defaultChecked className="w-5 h-5 accent-brand-green" />
                          <div className="flex-1">
                             <p className="font-black text-brand-green-dark italic">ক্যাশ অন ডেলিভারি (Cash on Delivery)</p>
                             <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">পণ্য হাতে পেয়ে টাকা দিন</p>
                          </div>
                          <Package className="text-brand-green" />
                       </label>
                       <div className="p-4 bg-amber-50 rounded-2xl flex gap-3 text-amber-700 italic text-sm">
                          <CheckCircle2 size={18} className="shrink-0" />
                          <p>অনলাইন পেমেন্ট বর্তমানে সাময়িকভাবে বন্ধ আছে। দয়া করে ক্যাশ অন ডেলিভারি সিলেক্ট করুন।</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Order Summary */}
           <div className="lg:col-span-5 space-y-8 sticky top-24">
              <div className="bg-brand-green-dark text-white rounded-[3.5rem] p-10 md:p-12 space-y-10 shadow-2xl shadow-brand-green/20">
                 <div className="flex justify-between items-end">
                    <div className="space-y-2">
                       <h2 className="text-3xl font-black italic tracking-tighter">আপনার অর্ডার</h2>
                       <div className="w-12 h-1 bg-emerald-400 rounded-full" />
                    </div>
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">{totalItems} আইটেম</span>
                 </div>

                 <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.variant}`} className="flex gap-4 group">
                         <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/5 flex-shrink-0 bg-white/5">
                            <Image src={item.image} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <h4 className="font-black text-white italic truncate">{item.name}</h4>
                            <p className="text-[10px] font-bold text-emerald-100/40 uppercase tracking-widest">{item.quantity} × ৳{item.price}</p>
                         </div>
                         <div className="font-black text-emerald-400 italic">৳{item.price * item.quantity}</div>
                      </div>
                    ))}
                 </div>

                 <div className="space-y-6 pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center text-emerald-50/70 italic font-medium">
                       <span>সাব-টোটাল</span>
                       <span className="font-black text-white">৳{subtotal}</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-50/70 italic font-medium">
                       <span>ডেলিভারি চার্জ</span>
                       <span className="font-black text-white">{shipping === 0 ? 'ফ্রি' : `৳${shipping}`}</span>
                    </div>
                    {shipping === 0 && (
                      <div className="bg-white/5 p-3 rounded-2xl flex items-center gap-2">
                         <Truck size={14} className="text-emerald-400" />
                         <p className="text-[9px] text-emerald-100 font-black italic">ফ্রি ডেলিভারি প্রযোজ্য হয়েছে!</p>
                      </div>
                    )}
                    <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                       <div className="space-y-1">
                         <span className="text-sm font-black text-emerald-400 uppercase tracking-widest block">সর্বমোট</span>
                         <span className="text-5xl font-black tracking-tighter italic">৳{total}</span>
                       </div>
                    </div>
                 </div>

                 <button 
                   type="submit"
                   className="w-full bg-white text-brand-green-dark py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-3 hover:bg-emerald-50 transition-all shadow-xl shadow-black/20"
                 >
                    অর্ডার করুন <CheckCircle2 size={24} />
                 </button>
                 
                 <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5 opacity-40">
                    <div className="flex items-center gap-3">
                       <ShieldCheck size={20} />
                       <span className="text-[8px] font-black uppercase tracking-widest leading-tight">নিরাপদ শপিং</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Truck size={20} />
                       <span className="text-[8px] font-black uppercase tracking-widest leading-tight">সারা দেশে ডেলিভারি</span>
                    </div>
                 </div>
              </div>
           </div>
        </form>
      </div>

      <Footer />
    </main>
  );
}
