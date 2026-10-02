import React, { useState, useEffect } from 'react';
import { CartItem } from '../types/pharmacy';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  ShoppingBag,
  AlertTriangle,
  QrCode,
  DollarSign,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  Store,
  Truck,
  Tag
} from 'lucide-react';
import { PHARMACY_CONFIG } from '../data/pharmacyData';
import { saveShopOrder } from '../lib/supabase';
import { getCustomerSession, saveCustomerSession } from './CustomerAuthModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (medicineId: string, delta: number) => void;
  onRemoveItem: (medicineId: string) => void;
  onCheckout: (orderId: string) => void;
  onOpenUploadModal: () => void;
  onOpenCustomerAuth?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onOpenUploadModal,
  onOpenCustomerAuth,
}) => {
  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryZone, setDeliveryZone] = useState<'within-3.5km' | 'beyond-4km'>('within-3.5km');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState('');

  // Auto-fill from active customer session
  useEffect(() => {
    if (isOpen) {
      const sess = getCustomerSession();
      if (sess) {
        if (sess.name && !customerName) setCustomerName(sess.name);
        if (sess.phone && !customerPhone) setCustomerPhone(sess.phone);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.medicine.price * item.quantity,
    0
  );

  const isPickup = fulfillmentType === 'pickup';
  const isBelow300 = subtotal < 300.0;
  const isBeyond4km = !isPickup && deliveryZone === 'beyond-4km';

  // Delivery charge calculation requested:
  // 1. Below 300rs: add 50rs delivery charge
  // 2. Above 300rs: free delivery within 3.5km
  // 3. Post 4km: delivered in 2hrs
  // 4. More than 4km and price > 1000rs: 10% discount on selected medicine (subject to T&C)
  // 5. Pick at shop option: always ₹0 delivery charge
  let deliveryFee = 0;
  if (!isPickup && items.length > 0) {
    if (isBelow300) {
      deliveryFee = 50.0;
    } else {
      deliveryFee = 0.0; // Free delivery for ₹300+
    }
  }

  // 10% discount for orders > ₹1000 beyond 4km
  let specialDiscount = 0;
  if (isBeyond4km && subtotal > 1000) {
    specialDiscount = Math.round(subtotal * 0.10 * 100) / 100;
  }

  const total = Math.max(0, subtotal - specialDiscount + deliveryFee);
  const hasRxItem = items.some((item) => item.medicine.requiresRx);

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim() || customerPhone.length < 8) {
      setFormError('Please enter a valid phone number for confirmation.');
      return;
    }
    if (!isPickup && !customerAddress.trim()) {
      setFormError('Please enter your delivery address / locality in Dharwad.');
      return;
    }

    setFormError('');
    setIsProcessing(true);

    const itemsSummary = items
      .map((item) => `${item.medicine.name} (x${item.quantity})`)
      .join(', ');

    const itemDetails = items.map((item) => ({
      medicine_id: item.medicine.id,
      medicine_name: item.medicine.name,
      quantity: item.quantity,
      unit_price: item.medicine.price,
      total_price: item.medicine.price * item.quantity,
    }));

    const fulfillmentNotes = isPickup
      ? '🏬 SELF-PICKUP AT SHOP: Customer will collect from Prabhu Complex, Opp. JSS Gate, Vidyagiri.'
      : isBeyond4km
      ? `🛵 BEYOND 4KM (2-HR DELIVERY): Locality: ${customerAddress}. ${specialDiscount > 0 ? '10% Discount applied (>₹1000).' : ''}`
      : '⚡ WITHIN 3.5KM (20-30 MIN DELIVERY): Express delivery to Dharwad resident.';

    try {
      const orderRes = await saveShopOrder({
        customer_name: customerName.trim() || 'Dharwad Resident',
        phone_number: customerPhone.trim(),
        address: isPickup
          ? 'Store Self-Pickup: Prabhu Complex, Opp. JSS Gate, Vidyagiri, Dharwad'
          : customerAddress.trim(),
        items_summary: itemsSummary,
        items: itemDetails,
        total_amount: total,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'UPI' ? 'paid' : 'cod_pending',
        order_type: isPickup ? 'custom-order' : 'quick-dharwad',
        notes: `${fulfillmentNotes} | Payment via ${paymentMethod}.`,
      });

      // Save customer session so customer phone number retains order history
      saveCustomerSession({
        phone: customerPhone.trim(),
        name: customerName.trim() || 'Valued Customer',
        address: customerAddress.trim(),
        loggedInAt: new Date().toISOString(),
      });

      setIsProcessing(false);
      onCheckout(orderRes.data.id);
      onClose();
    } catch (err) {
      saveCustomerSession({
        phone: customerPhone.trim(),
        name: customerName.trim() || 'Valued Customer',
        address: customerAddress.trim(),
        loggedInAt: new Date().toISOString(),
      });
      setIsProcessing(false);
      const fallbackId = `BMS-${Math.floor(10000 + Math.random() * 90000)}`;
      onCheckout(fallbackId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Medicine Cart</h3>
              <p className="text-xs text-slate-500">
                {items.length} {items.length === 1 ? 'medicine' : 'medicines'} selected
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Delivery & Discount Notification Meter */}
        <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-200 text-xs space-y-1.5">
          {isPickup ? (
            <div className="flex items-center justify-between text-emerald-900 font-bold bg-emerald-100/90 px-3 py-1.5 rounded-lg border border-emerald-300">
              <span className="flex items-center gap-1.5">
                <Store className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Self-Pickup at Shop: ₹0 Delivery Fee (FREE)</span>
              </span>
              <span className="text-[10px] text-emerald-800">Ready in 15m</span>
            </div>
          ) : isBelow300 ? (
            <div className="flex items-center justify-between text-amber-900 font-bold bg-amber-100/90 px-2.5 py-1.5 rounded-lg border border-amber-300">
              <span className="flex items-center gap-1.5">
                <span>🚚</span>
                <span>₹50 Delivery fee applies under ₹300</span>
              </span>
              <span className="text-amber-800 font-mono text-[11px]">
                Add ₹{(300 - subtotal).toFixed(2)} for Free
              </span>
            </div>
          ) : isBeyond4km ? (
            <div className="flex flex-col gap-0.5 text-sky-950 font-bold bg-sky-50 px-2.5 py-1.5 rounded-lg border border-sky-200">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Beyond 4 km: Delivered in 2 Hours</span>
                </span>
                <span className="text-emerald-700 font-bold">FREE Delivery</span>
              </div>
              {subtotal > 1000 ? (
                <span className="text-[10px] text-emerald-800 font-bold">
                  🎉 10% Special Discount Applied (-₹{specialDiscount.toFixed(2)}) *T&C Apply
                </span>
              ) : (
                <span className="text-[10px] text-slate-600 font-normal">
                  Add ₹{(1000 - subtotal).toFixed(2)} more to get 10% Special Discount *T&C
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between font-semibold text-emerald-950 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
              <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                <span>🎉</span>
                <span>FREE 20-30 Min Delivery within 3.5 km</span>
              </span>
              <span className="font-mono text-emerald-700 text-[11px]">₹0 FEE</span>
            </div>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400">
              <ShoppingBag className="w-12 h-12 stroke-1 text-slate-300" />
              <h4 className="text-sm font-bold text-slate-700">Your cart is empty</h4>
              <p className="text-xs max-w-xs text-slate-500">
                Browse our pharmacy list or type medicine names in the search box to add items.
              </p>
            </div>
          ) : (
            <>
              {/* Rx notification if needed */}
              {hasRxItem && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 leading-relaxed">
                    <span className="font-bold">Prescription Medicine Included:</span> Pharmacist will verify your prescription upon delivery or call.
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.medicine.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-colors"
                  >
                    <div className="space-y-0.5 flex-1 pr-2">
                      <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1">
                        {item.medicine.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        ₹{item.medicine.price.toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                      <button
                        onClick={() => onUpdateQuantity(item.medicine.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-mono font-bold text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.medicine.id, 1)}
                        className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.medicine.id)}
                      className="ml-2 p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCompleteOrder} className="pt-3 border-t border-slate-200 space-y-3.5 text-xs">
                {/* Option entry for customer orders history */}
                <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-950 font-medium">
                    <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Have past orders? Login to view order history</span>
                  </div>
                  {onOpenCustomerAuth && (
                    <button
                      type="button"
                      onClick={onOpenCustomerAuth}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold whitespace-nowrap shadow-xs"
                    >
                      My Orders
                    </button>
                  )}
                </div>

                {/* FULFILLMENT MODE: DOORSTEP DELIVERY OR PICK AT SHOP */}
                <div>
                  <span className="font-bold text-slate-800 block text-xs uppercase tracking-wider mb-1.5">
                    How would you like to receive your medicines?
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('delivery')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        fulfillmentType === 'delivery'
                          ? 'border-emerald-600 bg-emerald-50/90 text-emerald-950 ring-2 ring-emerald-300'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <span>Doorstep Delivery</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5 leading-tight">
                        {isBelow300 ? '₹50 Fee (Free ₹300+)' : 'Free over ₹300'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfillmentType('pickup')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        fulfillmentType === 'pickup'
                          ? 'border-emerald-600 bg-emerald-50/90 text-emerald-950 ring-2 ring-emerald-300'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Store className="w-4 h-4 text-emerald-600" />
                        <span>Pick at Shop</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold block mt-0.5 leading-tight">
                        FREE · Ready in 15 mins
                      </span>
                    </button>
                  </div>
                </div>

                {/* DISTANCE SELECTOR (WHEN DOORSTEP DELIVERY IS ACTIVE) */}
                {fulfillmentType === 'delivery' && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 block text-[11px]">
                      Select Your Location / Distance from Store:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryZone('within-3.5km')}
                        className={`p-2 rounded-lg border text-left transition-all text-xs ${
                          deliveryZone === 'within-3.5km'
                            ? 'border-emerald-600 bg-white text-emerald-950 font-bold ring-1 ring-emerald-400'
                            : 'border-slate-200 bg-white/70 text-slate-600'
                        }`}
                      >
                        <span className="block font-bold">Within 3.5 km</span>
                        <span className="text-[10px] text-emerald-700 block">
                          ⚡ 20–30 Mins Express
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryZone('beyond-4km')}
                        className={`p-2 rounded-lg border text-left transition-all text-xs ${
                          deliveryZone === 'beyond-4km'
                            ? 'border-sky-600 bg-white text-sky-950 font-bold ring-1 ring-sky-400'
                            : 'border-slate-200 bg-white/70 text-slate-600'
                        }`}
                      >
                        <span className="block font-bold">Beyond 4 km</span>
                        <span className="text-[10px] text-sky-700 block">
                          🕒 Delivered in 2 Hours
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {formError && (
                  <p className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg font-medium">
                    {formError}
                  </p>
                )}

                {/* Contact Inputs */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block text-xs uppercase tracking-wider">
                    Contact & Location Details
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Name (Optional)"
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Mobile Number *"
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-mono"
                    />
                  </div>

                  {isPickup ? (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>Pickup Point: Prabhu Complex Store</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        Prabhu Complex, Opp. JSS Gate, Vidyagiri, Dharwad. Show order ID to collect.
                      </p>
                    </div>
                  ) : (
                    <input
                      type="text"
                      required
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Dharwad Address / Area (e.g. Near JSS Gate, Vidyagiri, Sattur) *"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  )}
                </div>

                {/* PAYMENT METHOD SELECTOR */}
                <div className="space-y-1.5 pt-1">
                  <span className="font-bold text-slate-800 block text-xs">
                    Choose Payment Method:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        paymentMethod === 'UPI'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-200'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                        <span>UPI (PhonePe/GPay)</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Pay via QR on delivery/pickup
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        paymentMethod === 'COD'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-200'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <span>💵 Cash on Delivery</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {isPickup ? 'Pay cash at counter' : 'Pay cash at doorstep'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-slate-600 text-xs">
                  <div className="flex justify-between">
                    <span>Medicines Subtotal:</span>
                    <span className="font-mono font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>

                  {specialDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>Special 10% Discount (&gt;4km &amp; &gt;₹1000):</span>
                      </span>
                      <span className="font-mono">-₹{specialDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>
                      {isPickup ? 'Store Pickup Fee:' : 'Delivery Charge:'}
                    </span>
                    <span className="font-mono font-semibold">
                      {isPickup || deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-bold">FREE (₹0.00)</span>
                      ) : (
                        `₹${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900 text-sm">
                    <span>Total Amount:</span>
                    <span className="font-mono text-emerald-800">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] shadow-emerald-600/25"
                >
                  {isProcessing ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <span>
                        {isPickup
                          ? `Confirm Store Pickup (₹${total.toFixed(2)})`
                          : `Confirm Delivery Order (₹${total.toFixed(2)})`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
