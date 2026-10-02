import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID =
  import.meta.env.VITE_SUPABASE_PROJECT_ID || 'rqdkmxhbymgtlntxtmop';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;

// Retrieve user's Supabase Anon Key from env or localStorage
export const getSupabaseAnonKey = (): string => {
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envKey && envKey.trim()) return envKey.trim();
  const localKey = localStorage.getItem('supabase_anon_key');
  if (localKey && localKey.trim()) return localKey.trim();
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';
};

export const setCustomAnonKey = (key: string) => {
  if (key && key.trim()) {
    localStorage.setItem('supabase_anon_key', key.trim());
  } else {
    localStorage.removeItem('supabase_anon_key');
  }
};

export interface OrderItemDetail {
  medicine_id: string;
  medicine_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ShopOrderRecord {
  id: string;
  customer_name: string;
  phone_number: string;
  address: string;
  items_summary: string;
  items: OrderItemDetail[];
  total_amount: number;
  payment_method: 'UPI' | 'COD';
  payment_status: 'paid' | 'pending' | 'cod_pending';
  order_type: 'quick-dharwad' | 'pan-india' | 'voice-order' | 'custom-order';
  status: 'new' | 'preparing' | 'out_for_delivery' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface PrescriptionOrderRecord {
  id?: string;
  patient_name: string;
  phone_number: string;
  address: string;
  prescription_file_name: string;
  notes?: string;
  status: string;
  delivery_type: 'quick-dharwad' | 'pan-india';
  created_at: string;
}

// Create a Supabase client instance
export const supabase = createClient(SUPABASE_URL, getSupabaseAnonKey(), {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

const DEFAULT_ORDERS: ShopOrderRecord[] = [
  {
    id: 'BMS-91823',
    customer_name: 'Dr. Anand Kulkarni',
    phone_number: '9845110293',
    address: 'Near JSS College Gate, Prabhu Complex Road, Dharwad',
    items_summary: 'Augmentin 625 Duo (x2), Dolo 650 (x1)',
    items: [
      {
        medicine_id: 'med-01',
        medicine_name: 'Augmentin 625 Duo Tablet',
        quantity: 2,
        unit_price: 201.5,
        total_price: 403.0,
      },
      {
        medicine_id: 'med-03',
        medicine_name: 'Dolo 650 Fast Relief Tablet',
        quantity: 1,
        unit_price: 33.5,
        total_price: 33.5,
      },
    ],
    total_amount: 436.5,
    payment_method: 'UPI',
    payment_status: 'paid',
    order_type: 'quick-dharwad',
    status: 'preparing',
    notes: 'Please pack in cold-protection pouch. Delivery to JSS quarters.',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'BMS-89104',
    customer_name: 'Suresh Patil',
    phone_number: '8892450227',
    address: 'Vidyagiri 4th Cross, Opposite Park, Dharwad 580004',
    items_summary: 'Telma 40mg BP (x1), Glycomet 500 SR (x2)',
    items: [
      {
        medicine_id: 'med-02',
        medicine_name: 'Telma 40mg Blood Pressure Tablet',
        quantity: 1,
        unit_price: 225.0,
        total_price: 225.0,
      },
      {
        medicine_id: 'med-05',
        medicine_name: 'Glycomet 500mg SR',
        quantity: 2,
        unit_price: 48.0,
        total_price: 96.0,
      },
    ],
    total_amount: 321.0,
    payment_method: 'COD',
    payment_status: 'cod_pending',
    order_type: 'quick-dharwad',
    status: 'out_for_delivery',
    notes: 'Cash on Delivery. Keep change for ₹500 note ready.',
    created_at: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
  },
];

/**
 * Retrieve local cached shop orders
 */
export function getLocalOrders(): ShopOrderRecord[] {
  try {
    const raw = localStorage.getItem('bhagavati_shop_orders');
    if (!raw) {
      localStorage.setItem('bhagavati_shop_orders', JSON.stringify(DEFAULT_ORDERS));
      return DEFAULT_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_ORDERS;
  }
}

/**
 * Save order to Supabase and localStorage
 */
export async function saveShopOrder(
  order: Omit<ShopOrderRecord, 'id' | 'created_at' | 'status'>
): Promise<{ success: boolean; data: ShopOrderRecord; remoteSynced: boolean }> {
  const newOrder: ShopOrderRecord = {
    ...order,
    id: `BMS-${Math.floor(10000 + Math.random() * 90000)}`,
    status: 'new',
    created_at: new Date().toISOString(),
  };

  // 1. Mirror locally for instantaneous shopkeeper access
  const existing = getLocalOrders();
  const updated = [newOrder, ...existing];
  localStorage.setItem('bhagavati_shop_orders', JSON.stringify(updated));

  // 2. Insert into Supabase 'orders' or 'prescription_orders' table
  let remoteSynced = false;
  try {
    const { error } = await supabase.from('orders').insert([
      {
        id: newOrder.id,
        customer_name: newOrder.customer_name,
        phone_number: newOrder.phone_number,
        address: newOrder.address,
        items_summary: newOrder.items_summary,
        total_amount: newOrder.total_amount,
        payment_method: newOrder.payment_method,
        payment_status: newOrder.payment_status,
        order_type: newOrder.order_type,
        status: newOrder.status,
        notes: newOrder.notes || '',
        created_at: newOrder.created_at,
      },
    ]);

    if (!error) {
      remoteSynced = true;
    } else {
      // Also try writing to prescription_orders as fallback table if orders table not created
      await supabase.from('prescription_orders').insert([
        {
          patient_name: newOrder.customer_name,
          phone_number: newOrder.phone_number,
          address: newOrder.address,
          prescription_file_name: `order_${newOrder.payment_method}_${newOrder.total_amount}.txt`,
          delivery_type: newOrder.order_type === 'quick-dharwad' ? 'quick-dharwad' : 'pan-india',
          notes: `${newOrder.items_summary} | Payment: ${newOrder.payment_method} ₹${newOrder.total_amount}`,
          status: newOrder.status,
          created_at: newOrder.created_at,
        },
      ]);
    }
  } catch (err) {
    console.warn('Network sync notice:', err);
  }

  return { success: true, data: newOrder, remoteSynced };
}

/**
 * Update order status (Shopkeeper action: e.g. Preparing -> Out for Delivery -> Completed)
 */
export function updateLocalOrderStatus(
  orderId: string,
  newStatus: ShopOrderRecord['status']
) {
  const existing = getLocalOrders();
  const updated = existing.map((o) =>
    o.id === orderId ? { ...o, status: newStatus } : o
  );
  localStorage.setItem('bhagavati_shop_orders', JSON.stringify(updated));
}

/**
 * Save a prescription order to Supabase database (prescription_orders table)
 */
export async function savePrescriptionOrderToSupabase(
  record: Omit<PrescriptionOrderRecord, 'created_at' | 'status'>
): Promise<{ success: boolean; data: PrescriptionOrderRecord; error?: string; remoteSynced: boolean }> {
  const newOrder: PrescriptionOrderRecord = {
    ...record,
    id: `ORD-${Date.now().toString().slice(-6)}`,
    status: 'received',
    created_at: new Date().toISOString(),
  };

  // Also convert into a shop order record so shopkeeper sees it in Admin Orders Portal!
  const shopOrder: ShopOrderRecord = {
    id: newOrder.id || `ORD-${Date.now().toString().slice(-6)}`,
    customer_name: newOrder.patient_name,
    phone_number: newOrder.phone_number,
    address: newOrder.address || 'Dharwad Local Delivery',
    items_summary: `Prescription/Request: ${newOrder.prescription_file_name}`,
    items: [],
    total_amount: 0, // Pharmacist quotes price on phone
    payment_method: 'COD',
    payment_status: 'pending',
    order_type: newOrder.delivery_type === 'quick-dharwad' ? 'quick-dharwad' : 'pan-india',
    status: 'new',
    notes: newOrder.notes || '',
    created_at: newOrder.created_at,
  };
  const existing = getLocalOrders();
  localStorage.setItem('bhagavati_shop_orders', JSON.stringify([shopOrder, ...existing]));

  let remoteSynced = false;
  let remoteError = undefined;

  try {
    const { data, error } = await supabase
      .from('prescription_orders')
      .insert([
        {
          patient_name: newOrder.patient_name,
          phone_number: newOrder.phone_number,
          address: newOrder.address || '',
          prescription_file_name: newOrder.prescription_file_name || 'prescription.pdf',
          delivery_type: newOrder.delivery_type,
          notes: newOrder.notes || '',
          status: newOrder.status,
          created_at: newOrder.created_at,
        },
      ])
      .select();

    if (error) {
      remoteError = error.message;
    } else {
      remoteSynced = true;
      if (data && data[0]?.id) {
        newOrder.id = String(data[0].id);
      }
    }
  } catch (err: any) {
    remoteError = err?.message || 'Remote sync offline';
  }

  return {
    success: true,
    data: newOrder,
    error: remoteError,
    remoteSynced,
  };
}
