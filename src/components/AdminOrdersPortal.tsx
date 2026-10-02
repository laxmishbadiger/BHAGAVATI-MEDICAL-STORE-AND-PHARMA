import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShoppingBag,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  DollarSign,
  Search,
  Filter,
  RefreshCw,
  QrCode,
  ShieldCheck,
  Check,
  Plus,
  ExternalLink,
  ChevronDown,
  FileText,
  Upload,
  Camera,
  Edit2,
  Save,
  Tag,
  AlertTriangle,
  FileCheck,
  Package,
  Layers,
  Sparkles,
  Building,
  User,
  LogOut,
  Lock
} from 'lucide-react';
import {
  getLocalOrders,
  updateLocalOrderStatus,
  ShopOrderRecord,
  saveShopOrder
} from '../lib/supabase';
import { PHARMACY_CONFIG } from '../data/pharmacyData';
import {
  getInventory,
  updateMedicineStockAndPrice,
  applyScannedInvoiceToInventory,
  InventoryItem,
  ScannedInvoiceItem
} from '../lib/inventory';
import { parseInvoiceFile, SAMPLE_INVOICES } from '../lib/invoiceReader';

interface AdminOrdersPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminOrdersPortal: React.FC<AdminOrdersPortalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('bhagavati_admin_logged_in') === 'true';
  });
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [adminLoginId, setAdminLoginId] = useState('');
  const [adminLoginPin, setAdminLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regLicense, setRegLicense] = useState('KA-DWD-20B/21B');
  const [regPin, setRegPin] = useState('');

  const [activeTab, setActiveTab] = useState<'orders' | 'custom-requests' | 'inventory'>('orders');
  const [orders, setOrders] = useState<ShopOrderRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'new' | 'preparing' | 'out_for_delivery' | 'completed' | 'upi' | 'cod'>('all');
  const [isAddingOrder, setIsAddingOrder] = useState(false);

  // New manual order form state
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustItems, setNewCustItems] = useState('');
  const [newCustTotal, setNewCustTotal] = useState('');
  const [newCustPayment, setNewCustPayment] = useState<'UPI' | 'COD'>('COD');

  // Inventory editing state
  const [inventorySearch, setInventorySearch] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editMrp, setEditMrp] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [isAddingNewMed, setIsAddingNewMed] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedPrice, setNewMedPrice] = useState('');
  const [newMedMrp, setNewMedMrp] = useState('');
  const [newMedStock, setNewMedStock] = useState('');
  const [newMedIsAntibiotic, setNewMedIsAntibiotic] = useState(false);

  // Bill Reader state
  const [isUploadingBill, setIsUploadingBill] = useState(false);
  const [isProcessingBill, setIsProcessingBill] = useState(false);
  const [scannedBillData, setScannedBillData] = useState<{
    distributorName: string;
    invoiceNumber: string;
    invoiceDate: string;
    extractedItems: ScannedInvoiceItem[];
  } | null>(null);
  const [billSyncSuccess, setBillSyncSuccess] = useState(false);
  const invoiceFileInputRef = useRef<HTMLInputElement>(null);

  const refreshData = () => {
    setOrders(getLocalOrders());
    setInventory(getInventory());
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = adminLoginPin.trim();
    const cleanId = adminLoginId.trim().toLowerCase();

    const registeredAdminsRaw = localStorage.getItem('bhagavati_registered_admins');
    const registeredAdmins: any[] = registeredAdminsRaw ? JSON.parse(registeredAdminsRaw) : [];
    const matched = registeredAdmins.find(
      (a) => (a.phone === cleanId || a.name?.toLowerCase() === cleanId) && a.pin === cleanPin
    );

    if (cleanPin === '2005' || cleanPin === 'admin123' || cleanPin === '8892' || cleanPin === '8867' || matched) {
      sessionStorage.setItem('bhagavati_admin_logged_in', 'true');
      setIsAdminAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid PIN or ID. (Default Pharmacist PIN: 2005)');
    }
  };

  const handleAdminRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regPhone.trim() || !regPin.trim()) {
      alert('Please fill all required registration details.');
      return;
    }
    const newAdmin = {
      name: regName.trim() || 'Registered Pharmacist',
      phone: regPhone.trim(),
      license: regLicense.trim(),
      pin: regPin.trim(),
      createdAt: new Date().toISOString(),
    };
    const registeredAdminsRaw = localStorage.getItem('bhagavati_registered_admins');
    const registeredAdmins: any[] = registeredAdminsRaw ? JSON.parse(registeredAdminsRaw) : [];
    localStorage.setItem('bhagavati_registered_admins', JSON.stringify([...registeredAdmins, newAdmin]));
    sessionStorage.setItem('bhagavati_admin_logged_in', 'true');
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('bhagavati_admin_logged_in');
    localStorage.removeItem('bhagavati_admin_logged_in');
    setIsAdminAuthenticated(false);
    setAdminLoginPin('');
  };

  // Status updates
  const handleStatusChange = (orderId: string, newStatus: ShopOrderRecord['status']) => {
    updateLocalOrderStatus(orderId, newStatus);
    refreshData();
  };

  // Create manual phone order
  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustPhone.trim()) {
      alert('Please enter customer phone number');
      return;
    }

    const totalAmt = parseFloat(newCustTotal) || 0;
    await saveShopOrder({
      customer_name: newCustName.trim() || 'Walk-in / Phone Customer',
      phone_number: newCustPhone.trim(),
      address: newCustAddress.trim() || 'Prabhu Complex Store, Dharwad',
      items_summary: newCustItems.trim() || 'Medicines ordered on call',
      items: [
        {
          medicine_id: 'manual',
          medicine_name: newCustItems.trim() || 'General Medicines',
          quantity: 1,
          unit_price: totalAmt,
          total_price: totalAmt,
        },
      ],
      total_amount: totalAmt,
      payment_method: newCustPayment,
      payment_status: newCustPayment === 'UPI' ? 'paid' : 'cod_pending',
      order_type: 'quick-dharwad',
      notes: 'Manually logged by shopkeeper',
    });

    setIsAddingOrder(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewCustItems('');
    setNewCustTotal('');
    refreshData();
  };

  // Save inline medicine edit
  const handleSaveMedicineEdit = (item: InventoryItem) => {
    const updated = updateMedicineStockAndPrice(item.id, {
      price: editPrice > 0 ? editPrice : item.price,
      originalPrice: editMrp > 0 ? editMrp : item.originalPrice,
      stockQuantity: editStock >= 0 ? editStock : item.stockQuantity,
    });
    setInventory(updated);
    setEditingItemId(null);
  };

  // Add new medicine manually to inventory
  const handleAddNewMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim() || !newMedPrice) {
      alert('Please enter medicine name and price');
      return;
    }

    const price = parseFloat(newMedPrice) || 50;
    const mrp = parseFloat(newMedMrp) || price * 1.15;
    const stock = parseInt(newMedStock, 10) || 30;

    const current = getInventory();
    const newMed: InventoryItem = {
      id: `med-${Date.now().toString().slice(-4)}`,
      name: newMedName.trim(),
      genericName: `${newMedName.trim()} Formulation`,
      dosage: 'Standard Dosage Pack',
      category: newMedIsAntibiotic ? 'prescription' : 'pain-relief',
      price,
      originalPrice: mrp,
      stockQuantity: stock,
      stockStatus: 'in-stock',
      requiresRx: newMedIsAntibiotic,
      packaging: 'Sealed Strip / Bottle',
      temperatureRequirement: 'Store below 25°C',
      description: 'Added to inventory by Bhagavati Pharma administrator.',
      pillColor: '#10b981',
      shape: 'tablet',
      isAntibiotic: newMedIsAntibiotic,
    };

    const updated = [newMed, ...current];
    localStorage.setItem('bhagavati_pharmacy_inventory', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('bhagavati_inventory_updated'));
    setInventory(updated);
    setIsAddingNewMed(false);
    setNewMedName('');
    setNewMedPrice('');
    setNewMedMrp('');
    setNewMedStock('');
    setNewMedIsAntibiotic(false);
  };

  // Invoice File Upload & Reading
  const handleInvoiceFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingBill(true);
    setBillSyncSuccess(false);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const parsed = await parseInvoiceFile(file, base64);
        setScannedBillData(parsed);
        setIsProcessingBill(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsProcessingBill(false);
      alert('Failed to parse invoice file. Please try sample distributor bill.');
    }
  };

  // Load Sample Distributor Bill
  const handleLoadSampleBill = (sampleIndex: number) => {
    const sample = SAMPLE_INVOICES[sampleIndex] || SAMPLE_INVOICES[0];
    setScannedBillData({
      distributorName: sample.distributor,
      invoiceNumber: sample.invoiceNumber,
      invoiceDate: sample.date,
      extractedItems: sample.items,
    });
    setBillSyncSuccess(false);
  };

  // Apply scanned invoice to inventory
  const handleApplyBillToInventory = () => {
    if (!scannedBillData || scannedBillData.extractedItems.length === 0) return;
    const updated = applyScannedInvoiceToInventory(scannedBillData.extractedItems);
    setInventory(updated);
    setBillSyncSuccess(true);
    setTimeout(() => {
      setIsUploadingBill(false);
      setScannedBillData(null);
      setBillSyncSuccess(false);
    }, 2000);
  };

  // Separate standard shop orders vs custom prescription/text/voice requests
  const standardOrders = orders.filter(
    (o) => !o.items_summary.startsWith('Prescription/Request:') && !o.notes?.includes('CUSTOM MEDICINE REQUEST')
  );

  const customRequests = orders.filter(
    (o) => o.items_summary.startsWith('Prescription/Request:') || o.notes?.includes('CUSTOM MEDICINE REQUEST')
  );

  const filteredOrders = (activeTab === 'orders' ? standardOrders : customRequests).filter((ord) => {
    const matchesSearch =
      ord.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.phone_number.includes(searchQuery) ||
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.items_summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.notes || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'all') return true;
    if (filterType === 'upi') return ord.payment_method === 'UPI';
    if (filterType === 'cod') return ord.payment_method === 'COD';
    return ord.status === filterType;
  });

  const filteredInventory = inventory.filter((item) => {
    const q = inventorySearch.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.genericName.toLowerCase().includes(q) ||
      (item.batchNumber || '').toLowerCase().includes(q)
    );
  });

  const totalRevenue = standardOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const upiCount = standardOrders.filter((o) => o.payment_method === 'UPI').length;
  const codCount = standardOrders.filter((o) => o.payment_method === 'COD').length;
  const pendingDeliveries = standardOrders.filter(
    (o) => o.status === 'new' || o.status === 'preparing' || o.status === 'out_for_delivery'
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-5 sm:px-8 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-600/30">
              🏬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                  Shopkeeper Admin Desk
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                  GST: {PHARMACY_CONFIG.gstNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                BHAGAVATI MEDICAL STORE AND PHARMA · Prabhu Complex, Opp. JSS Gate, Vidyagiri, Dharwad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <>
                <button
                  onClick={refreshData}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Refresh Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-rose-300 text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Logout Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout Admin</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECURITY GATE: IF NOT LOGGED IN, SHOW ADMIN LOGIN & REGISTER SCREEN */}
        {!isAdminAuthenticated ? (
          <div className="p-6 sm:p-10 flex-1 flex flex-col justify-center items-center overflow-y-auto bg-slate-50">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
              <div className="text-center space-y-1">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-emerald-400 mx-auto flex items-center justify-center text-2xl font-bold shadow-md mb-2">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Pharmacist Admin Portal
                </h3>
                <p className="text-xs text-slate-500">
                  Prabhu Complex, Opp. JSS Gate, Vidyagiri, Dharwad
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Admin Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Register New Admin
                </button>
              </div>

              {authMode === 'login' ? (
                <form onSubmit={handleAdminLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pharmacist Mobile / ID
                    </label>
                    <input
                      type="text"
                      required
                      value={adminLoginId}
                      onChange={(e) => setAdminLoginId(e.target.value)}
                      placeholder="08892450227 or admin"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Security PIN / Password
                    </label>
                    <input
                      type="password"
                      required
                      value={adminLoginPin}
                      onChange={(e) => setAdminLoginPin(e.target.value)}
                      placeholder="Enter Security PIN (e.g. 2005)"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {loginError && (
                    <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center">
                      {loginError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98]"
                  >
                    Unlock Admin Orders Desk
                  </button>

                  <div className="pt-2 border-t border-slate-100 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setAdminLoginId('08892450227');
                        setAdminLoginPin('2005');
                        localStorage.setItem('bhagavati_admin_logged_in', 'true');
                        setIsAdminAuthenticated(true);
                      }}
                      className="text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      ⚡ Pharmacist Quick Login (PIN: 2005)
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAdminRegister} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pharmacist Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Jayanth Patil"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="8892450227"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Drug License
                      </label>
                      <input
                        type="text"
                        required
                        value={regLicense}
                        onChange={(e) => setRegLicense(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Create 4-Digit Admin PIN *
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={6}
                      value={regPin}
                      onChange={(e) => setRegPin(e.target.value)}
                      placeholder="Create 4-digit PIN (e.g. 2005)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Register & Unlock Admin Desk
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 py-3 bg-slate-100 border-b border-slate-200 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Customer Delivery Orders</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-mono">
              {standardOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('custom-requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'custom-requests'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            <span>Custom Rx & Voice Inquiries</span>
            {customRequests.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-bold font-mono animate-pulse">
                {customRequests.length} New
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-500" />
            <span>Inventory & Purchase Bill OCR</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800 font-mono">
              {inventory.length} Items
            </span>
          </button>
        </div>

        {/* TAB 1: CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-4 bg-slate-50 border-b border-slate-200 text-xs">
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-slate-500 text-[11px] block">Pending Deliveries</span>
                <span className="text-xl font-mono font-black text-amber-700">
                  {pendingDeliveries} Active
                </span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-slate-500 text-[11px] block">Total Orders</span>
                <span className="text-xl font-mono font-black text-slate-900">
                  {standardOrders.length}
                </span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-slate-500 text-[11px] block">Payment Methods</span>
                <div className="flex items-center gap-2 mt-0.5 font-bold font-mono">
                  <span className="text-emerald-700">UPI: {upiCount}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-700">COD: {codCount}</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-slate-500 text-[11px] block">Total Sales Value</span>
                <span className="text-xl font-mono font-black text-emerald-800">
                  ₹{totalRevenue.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search customer, phone number, address..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none cursor-pointer"
                >
                  <option value="all">All Orders</option>
                  <option value="new">New Incoming</option>
                  <option value="preparing">Preparing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="completed">Delivered / Done</option>
                  <option value="upi">UPI Paid</option>
                  <option value="cod">Cash on Delivery</option>
                </select>

                <button
                  onClick={() => setIsAddingOrder(!isAddingOrder)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Manual Order</span>
                </button>
              </div>
            </div>

            {/* Manual Order Drawer Form */}
            {isAddingOrder && (
              <form onSubmit={handleCreateManualOrder} className="p-4 bg-emerald-50/50 border-b border-emerald-200 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">Log Phone or Walk-in Customer Order</h4>
                  <button type="button" onClick={() => setIsAddingOrder(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="Customer Name *"
                    className="p-2 bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="tel"
                    required
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="Customer Mobile Number *"
                    className="p-2 bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    required
                    value={newCustAddress}
                    onChange={(e) => setNewCustAddress(e.target.value)}
                    placeholder="Delivery Location (e.g. JSS Gate / Vidyagiri) *"
                    className="p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    value={newCustItems}
                    onChange={(e) => setNewCustItems(e.target.value)}
                    placeholder="Medicines (e.g. Dolo 650 x2, Augmentin x1) *"
                    className="p-2 bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newCustTotal}
                    onChange={(e) => setNewCustTotal(e.target.value)}
                    placeholder="Total Amount (₹) *"
                    className="p-2 bg-white border border-slate-200 rounded-lg"
                  />
                  <div className="flex items-center gap-2">
                    <select
                      value={newCustPayment}
                      onChange={(e) => setNewCustPayment(e.target.value as any)}
                      className="p-2 bg-white border border-slate-200 rounded-lg flex-1"
                    >
                      <option value="COD">Cash on Delivery (COD)</option>
                      <option value="UPI">UPI (PhonePe/GPay)</option>
                    </select>
                    <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-sm">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Orders List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 stroke-1 mb-2" />
                  <p className="text-sm font-semibold text-slate-600">No orders found</p>
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {ord.id}
                        </span>
                        <span className="font-bold text-sm text-slate-900">{ord.customer_name}</span>
                        <span className="text-xs text-slate-500 font-mono">
                          {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            ord.payment_method === 'UPI'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {ord.payment_method} · ₹{ord.total_amount.toFixed(2)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 font-medium">{ord.items_summary}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{ord.address}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`tel:${ord.phone_number}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Call Customer"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{ord.phone_number}</span>
                      </a>

                      <a
                        href={`https://wa.me/91${ord.phone_number.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                          ord.customer_name
                        )},%20this%20is%20Bhagavati%20Medical%20Store%20regarding%20your%20order%20${ord.id}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>

                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none ${
                          ord.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : ord.status === 'out_for_delivery'
                            ? 'bg-sky-100 text-sky-900 border-sky-300'
                            : ord.status === 'preparing'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-slate-100 text-slate-800 border-slate-300'
                        }`}
                      >
                        <option value="new">New Order</option>
                        <option value="preparing">Preparing Pack</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="completed">Delivered / Completed</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOM RX, VOICE & TEXT INQUIRIES (Requirement 7!) */}
        {activeTab === 'custom-requests' && (
          <div className="flex-1 flex flex-col overflow-hidden p-5 bg-slate-50">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl mb-4 text-xs text-emerald-950 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-emerald-900">
                  Custom Medicine Inquiries, Voice Orders & Prescriptions Desk
                </h4>
                <p className="mt-0.5 text-emerald-800">
                  When patients submit medicine names, voice notes, or doctor prescriptions that were not directly in the standard cart, they appear right here for your direct call or WhatsApp follow-up.
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {customRequests.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-200">
                  <FileText className="w-12 h-12 mx-auto text-slate-300 stroke-1 mb-2" />
                  <h4 className="text-sm font-bold text-slate-700">No pending custom inquiries</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Incoming voice notes, typed medicine requests, and Rx uploads will be listed here.
                  </p>
                </div>
              ) : (
                customRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 bg-white rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500 shadow-sm transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-bold font-mono text-[10px] rounded uppercase">
                          Action Needed
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{req.customer_name}</h4>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(req.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${req.phone_number}`}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 font-mono"
                        >
                          <Phone className="w-3 h-3 text-amber-400" />
                          <span>Call: {req.phone_number}</span>
                        </a>

                        <a
                          href={`https://wa.me/91${req.phone_number.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                            req.customer_name
                          )},%20this%20is%20Bhagavati%20Medical%20Store.%20We%20received%20your%20medicine%20request%20and%20checked%20our%20stock.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                        Customer Request Details:
                      </span>
                      <p className="text-sm font-semibold text-slate-900 leading-relaxed font-mono">
                        {req.notes || req.items_summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{req.address || 'Dharwad Resident'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusChange(req.id, 'completed')}
                          className="px-3 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 rounded-lg font-bold border border-slate-200"
                        >
                          {req.status === 'completed' ? '✓ Resolved' : 'Mark Contacted'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: INVENTORY & PURCHASE BILL OCR (Requirements 1 & 8!) */}
        {activeTab === 'inventory' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            {/* Top Toolbar */}
            <div className="p-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Search inventory medicine or batch..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsUploadingBill(true)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                  title="Upload purchase bill to automatically update inventory"
                >
                  <FileText className="w-4 h-4" />
                  <span>📄 Automatic Bill Reader (OCR)</span>
                </button>

                <button
                  onClick={() => setIsAddingNewMed(!isAddingNewMed)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Medicine</span>
                </button>
              </div>
            </div>

            {/* AUTOMATIC BILL READER MODAL / POPUP */}
            {isUploadingBill && (
              <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-b border-emerald-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        Automatic Purchase Invoice & Wholesale Bill Reader
                      </h4>
                      <p className="text-xs text-slate-600">
                        Upload invoice image/PDF or test sample distributor bills. Price & stock quantities are picked automatically.
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setIsUploadingBill(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  {/* File Upload Box */}
                  <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-emerald-400 text-center flex flex-col items-center justify-center">
                    <Upload className="w-8 h-8 text-emerald-600 mb-2" />
                    <span className="text-xs font-bold text-slate-800">Upload Your Wholesale Bill</span>
                    <span className="text-[10px] text-slate-500 mb-2">Photo or PDF from distributor</span>
                    <input
                      ref={invoiceFileInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleInvoiceFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => invoiceFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                      Choose Bill Photo / File
                    </button>
                  </div>

                  {/* Sample Bill 1 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Sample: Cipla Agency Hubballi</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">4 Items</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Augmentin 625 (40x), Dolo 650 (100x), Azithral 500 (30x), Pan 40 (60x).
                      </p>
                    </div>
                    <button
                      onClick={() => handleLoadSampleBill(0)}
                      className="mt-2 w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors"
                    >
                      Load Cipla Bill
                    </button>
                  </div>

                  {/* Sample Bill 2 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Sample: Balaji Pharma Dharwad</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">3 Items</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Telma 40mg BP (50x), Glycomet 500 SR (40x), Cefixime 200mg (25x).
                      </p>
                    </div>
                    <button
                      onClick={() => handleLoadSampleBill(1)}
                      className="mt-2 w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors"
                    >
                      Load Balaji Bill
                    </button>
                  </div>
                </div>

                {/* Scanned bill preview */}
                {isProcessingBill ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                    <RefreshCw className="w-8 h-8 mx-auto text-emerald-600 animate-spin mb-2" />
                    <p className="text-xs font-bold text-slate-700">Reading Invoice and extracting medicines line by line...</p>
                  </div>
                ) : scannedBillData ? (
                  <div className="bg-white p-4 rounded-2xl border border-emerald-300 shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{scannedBillData.distributorName}</span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Invoice: {scannedBillData.invoiceNumber} · Date: {scannedBillData.invoiceDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {billSyncSuccess ? (
                          <span className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Inventory Updated!</span>
                          </span>
                        ) : (
                          <button
                            onClick={handleApplyBillToInventory}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all active:scale-[0.98]"
                          >
                            <Check className="w-4 h-4" />
                            <span>✅ Apply Scanned Bill to Inventory</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                            <th className="p-2 font-bold">Medicine Name</th>
                            <th className="p-2 font-bold">Batch</th>
                            <th className="p-2 font-bold text-center">Qty Packs</th>
                            <th className="p-2 font-bold text-right">Purchase Rate (₹)</th>
                            <th className="p-2 font-bold text-right">Selling Price (₹)</th>
                            <th className="p-2 font-bold text-right">MRP (₹)</th>
                            <th className="p-2 font-bold text-center">Antibiotic?</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {scannedBillData.extractedItems.map((item) => (
                            <tr key={item.id} className="hover:bg-emerald-50/40">
                              <td className="p-2 font-bold text-slate-900">{item.medicineName}</td>
                              <td className="p-2 font-mono text-slate-500">{item.batchNumber}</td>
                              <td className="p-2 text-center font-bold font-mono text-emerald-800">+{item.quantityPacks}</td>
                              <td className="p-2 text-right font-mono text-slate-600">₹{item.purchaseRate.toFixed(2)}</td>
                              <td className="p-2 text-right font-mono font-bold text-slate-900">₹{item.sellingPrice.toFixed(2)}</td>
                              <td className="p-2 text-right font-mono text-slate-400 line-through">₹{item.mrp.toFixed(2)}</td>
                              <td className="p-2 text-center">
                                {item.isAntibiotic ? (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                                    Antibiotic
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[10px]">No</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* ADD NEW MEDICINE FORM */}
            {isAddingNewMed && (
              <form onSubmit={handleAddNewMedicine} className="p-4 bg-slate-100 border-b border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Add New Medicine to Pharmacy Inventory</h4>
                  <button type="button" onClick={() => setIsAddingNewMed(false)} className="text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  <input
                    type="text"
                    required
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="Medicine Name & Dosage *"
                    className="p-2 bg-white border border-slate-200 rounded-lg sm:col-span-2"
                  />
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newMedPrice}
                    onChange={(e) => setNewMedPrice(e.target.value)}
                    placeholder="Selling Price (₹) *"
                    className="p-2 bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={newMedMrp}
                    onChange={(e) => setNewMedMrp(e.target.value)}
                    placeholder="MRP (₹)"
                    className="p-2 bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="number"
                    required
                    value={newMedStock}
                    onChange={(e) => setNewMedStock(e.target.value)}
                    placeholder="Initial Stock Qty *"
                    className="p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={newMedIsAntibiotic}
                      onChange={(e) => setNewMedIsAntibiotic(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>Is this an Antibiotic? (Will show complete-course warning)</span>
                  </label>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-sm">
                    Save to Inventory
                  </button>
                </div>
              </form>
            )}

            {/* Inventory Table with Inline Edit (Requirement 8!) */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Medicine & Strength</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Selling Price (₹)</th>
                      <th className="p-3 text-right">MRP (₹)</th>
                      <th className="p-3 text-center">Stock Qty</th>
                      <th className="p-3 text-center">Course Warning</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInventory.map((item) => {
                      const isEditing = editingItemId === item.id;
                      const hasDiscount = item.originalPrice && item.originalPrice > item.price;
                      const discountPct = hasDiscount
                        ? Math.round(((item.originalPrice! - item.price) / item.originalPrice!) * 100)
                        : 15;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block">{item.name}</span>
                            <span className="text-[11px] text-slate-500 italic block">{item.genericName}</span>
                          </td>

                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                              {item.category}
                            </span>
                          </td>

                          {/* Price column with inline editing */}
                          <td className="p-3 text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.5"
                                value={editPrice}
                                onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                                className="w-20 p-1 border border-emerald-400 rounded text-right font-mono font-bold"
                              />
                            ) : (
                              <div>
                                <span className="font-mono font-bold text-emerald-800 text-sm">
                                  ₹{item.price.toFixed(2)}
                                </span>
                                <span className="text-[10px] text-emerald-700 block font-semibold">
                                  {discountPct}% OFF
                                </span>
                              </div>
                            )}
                          </td>

                          {/* MRP column */}
                          <td className="p-3 text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.5"
                                value={editMrp}
                                onChange={(e) => setEditMrp(parseFloat(e.target.value) || 0)}
                                className="w-20 p-1 border border-slate-300 rounded text-right font-mono"
                              />
                            ) : (
                              <span className="font-mono text-slate-400 line-through">
                                ₹{(item.originalPrice || item.price * 1.15).toFixed(2)}
                              </span>
                            )}
                          </td>

                          {/* Stock Quantity column */}
                          <td className="p-3 text-center">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editStock}
                                onChange={(e) => setEditStock(parseInt(e.target.value, 10) || 0)}
                                className="w-16 p-1 border border-emerald-400 rounded text-center font-mono font-bold"
                              />
                            ) : (
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                                  (item.stockQuantity || 0) <= 5
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                }`}
                              >
                                {item.stockQuantity || 0} units
                              </span>
                            )}
                          </td>

                          {/* Course warning column */}
                          <td className="p-3 text-center">
                            {item.isAntibiotic ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                ⚠️ Full Course
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs">—</span>
                            )}
                          </td>

                          {/* Action button */}
                          <td className="p-3 text-center">
                            {isEditing ? (
                              <button
                                onClick={() => handleSaveMedicineEdit(item)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 mx-auto shadow-sm"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>Save</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingItemId(item.id);
                                  setEditPrice(item.price);
                                  setEditMrp(item.originalPrice || item.price * 1.15);
                                  setEditStock(item.stockQuantity || 0);
                                }}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 mx-auto transition-colors"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </>
    )}
      </div>
    </div>
  );
};
