import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Truck, ShieldCheck, MessageCircle, Check } from 'lucide-react';
import { CONTACT } from '../config/constants';

const CheckoutPage = ({ navigate, cartItems = [], onUpdateCart, onRemoveItem, onClearCart }) => {
  const [step, setStep] = useState(1); // 1: Review, 2: Info, 3: Confirm
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over $500
  const total = subtotal + shipping;

  const updateQuantity = (id, delta) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, (item.quantity || 1) + delta);
    onUpdateCart && onUpdateCart(id, newQty);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateWhatsAppMessage = () => {
    const itemsList = cartItems
      .map(item => `• ${item.name} (Qty: ${item.quantity || 1}) - $${(item.price * (item.quantity || 1)).toLocaleString()}`)
      .join('\n');

    const message = `🛒 *New Order from InStyle Website*

👤 *Customer Details:*
Name: ${formData.firstName} ${formData.lastName}
Phone: ${formData.phone}
Address: ${formData.address}, ${formData.city}
${formData.notes ? `Notes: ${formData.notes}` : ''}

📦 *Order Items:*
${itemsList}

💰 *Order Summary:*
Subtotal: $${subtotal.toLocaleString()}
Shipping: ${shipping === 0 ? 'Free' : `$${shipping}`}
*Total: $${total.toLocaleString()}*

Order Reference: INS-${Date.now().toString(36).toUpperCase()}`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppSubmit = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${message}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after sending
    if (onClearCart) {
      onClearCart();
    }
    
    // Navigate to home after a short delay
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isFormValid = () => {
    if (step === 2) {
      return formData.firstName && formData.lastName && formData.phone && formData.address && formData.city;
    }
    return true;
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-12 text-center">
            <ShoppingBag size={64} className="mx-auto mb-6 text-[#E5E5E5]" />
            <h1 className="text-2xl font-serif text-[#1C1B1A] mb-4">Your bag is empty</h1>
            <p className="text-[#666] mb-8">Add some beautiful pieces to get started.</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#C5A059] transition-colors"
            >
              Browse Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="bg-[#1C1B1A] text-white pt-32 pb-12">
        <div className="container mx-auto px-4 md:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-[#999] hover:text-[#C5A059] transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </button>
          <h1 className="text-3xl md:text-4xl font-serif">Checkout</h1>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-[#E5E5E5] py-6">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: 'Review' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Confirm' },
            ].map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      step >= s.num ? 'bg-[#C5A059] text-white' : 'bg-[#E5E5E5] text-[#999]'
                    }`}
                  >
                    {step > s.num ? <Check size={16} /> : s.num}
                  </div>
                  <span className={`text-sm hidden sm:block ${step >= s.num ? 'text-[#1C1B1A] font-medium' : 'text-[#999]'}`}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && <div className={`w-12 h-0.5 ${step > s.num ? 'bg-[#C5A059]' : 'bg-[#E5E5E5]'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Cart / Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
                <div className="p-6 border-b border-[#E5E5E5]">
                  <h2 className="text-xl font-serif text-[#1C1B1A]">Review Your Items</h2>
                </div>
                <div className="divide-y divide-[#E5E5E5]">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex gap-6">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#F9F8F6] shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#1C1B1A] mb-1 truncate">{item.name}</h3>
                        <p className="text-sm text-[#666] mb-3">{item.dimensions || item.category}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-[#E5E5E5] rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center text-[#666] hover:bg-[#F9F8F6] transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-10 text-center text-sm font-medium">{item.quantity || 1}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center text-[#666] hover:bg-[#F9F8F6] transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => onRemoveItem && onRemoveItem(item.id)}
                            className="text-[#999] hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-serif text-[#1C1B1A]">${(item.price * (item.quantity || 1)).toLocaleString()}</p>
                        <p className="text-xs text-[#999]">${item.price.toLocaleString()} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
                <div className="p-6 border-b border-[#E5E5E5]">
                  <h2 className="text-xl font-serif text-[#1C1B1A]">Contact & Delivery Details</h2>
                </div>
                <form className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1C1B1A] mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1C1B1A] mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1B1A] mb-2">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+961 XX XXX XXX"
                      className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1B1A] mb-2">Delivery Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street, Building, Floor"
                      className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1B1A] mb-2">City/Area *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Beirut, Hadath, etc."
                      className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1B1A] mb-2">Special Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Any special requests or delivery instructions..."
                      className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-colors resize-none"
                    />
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
                  <div className="p-6 border-b border-[#E5E5E5]">
                    <h2 className="text-xl font-serif text-[#1C1B1A]">Review Your Order</h2>
                    <p className="text-sm text-[#666] mt-1">Confirm details before sending to WhatsApp</p>
                  </div>
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-bold text-[#999] uppercase tracking-widest mb-3">Contact Info</h3>
                        <p className="font-medium text-[#1C1B1A]">{formData.firstName} {formData.lastName}</p>
                        <p className="text-[#666]">{formData.phone}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#999] uppercase tracking-widest mb-3">Delivery Address</h3>
                        <p className="text-[#666]">{formData.address}</p>
                        <p className="text-[#666]">{formData.city}</p>
                      </div>
                    </div>
                    {formData.notes && (
                      <div className="mt-6 pt-6 border-t border-[#E5E5E5]">
                        <h3 className="text-sm font-bold text-[#999] uppercase tracking-widest mb-3">Notes</h3>
                        <p className="text-[#666]">{formData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
                  <div className="p-6 border-b border-[#E5E5E5]">
                    <h2 className="text-xl font-serif text-[#1C1B1A]">Items ({cartItems.length})</h2>
                  </div>
                  <div className="divide-y divide-[#E5E5E5]">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F9F8F6] shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-[#1C1B1A] truncate">{item.name}</h3>
                          <p className="text-sm text-[#999]">Qty: {item.quantity || 1}</p>
                        </div>
                        <p className="font-medium text-[#1C1B1A]">${(item.price * (item.quantity || 1)).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Info Banner */}
                <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl p-6 flex items-start gap-4">
                  <MessageCircle size={24} className="text-[#25D366] shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-[#1C1B1A] mb-1">Order via WhatsApp</h3>
                    <p className="text-sm text-[#666]">
                      Clicking the button below will open WhatsApp with your order details. 
                      Our team will confirm availability and arrange delivery with you directly.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden sticky top-32">
              <div className="p-6 border-b border-[#E5E5E5]">
                <h2 className="text-xl font-serif text-[#1C1B1A]">Order Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-[#666]">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#666]">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-[#25D366]">Free</span> : `$${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[#C5A059]">Add ${500 - subtotal} more for free shipping</p>
                )}
                <div className="pt-4 border-t border-[#E5E5E5] flex justify-between">
                  <span className="text-lg font-bold text-[#1C1B1A]">Estimated Total</span>
                  <span className="text-2xl font-serif text-[#C5A059]">${total.toLocaleString()}</span>
                </div>
                <p className="text-xs text-[#999]">Final price will be confirmed after quote review</p>
              </div>

              <div className="p-6 pt-0 space-y-3">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="w-full py-3 border border-[#E5E5E5] text-[#666] font-bold uppercase text-xs tracking-widest rounded-lg hover:border-[#1C1B1A] hover:text-[#1C1B1A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    onClick={handleContinue}
                    disabled={!isFormValid()}
                    className="w-full py-4 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#C5A059] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:ring-offset-2"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleWhatsAppSubmit}
                    className="w-full py-4 bg-[#25D366] text-white font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
                  >
                    <MessageCircle size={18} />
                    Send Order via WhatsApp
                  </button>
                )}
              </div>

              {/* Trust badges */}
              <div className="p-6 pt-0 space-y-3">
                <div className="flex items-center gap-3 text-sm text-[#666]">
                  <Truck size={18} className="text-[#C5A059]" />
                  <span>Delivery across Lebanon</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#666]">
                  <ShieldCheck size={18} className="text-[#C5A059]" />
                  <span>Quality guaranteed</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#666]">
                  <MessageCircle size={18} className="text-[#C5A059]" />
                  <span>Direct WhatsApp support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
