import { Medicine } from '../types/pharmacy';
import { MEDICINE_CATALOG } from '../data/pharmacyData';

export interface InventoryItem extends Medicine {
  stockQuantity: number;
  costPrice?: number;
  batchNumber?: string;
  isAntibiotic?: boolean;
}

const INVENTORY_STORAGE_KEY = 'bhagavati_pharmacy_inventory';

// Identify if medicine is an antibiotic based on name or composition
export function isAntibioticMedicine(item: { name: string; genericName?: string; description?: string }): boolean {
  const text = `${item.name} ${item.genericName || ''} ${item.description || ''}`.toLowerCase();
  return (
    text.includes('antibiotic') ||
    text.includes('amoxicillin') ||
    text.includes('clavulanate') ||
    text.includes('augmentin') ||
    text.includes('azithromycin') ||
    text.includes('azithral') ||
    text.includes('cefixime') ||
    text.includes('ciprofloxacin') ||
    text.includes('ofloxacin') ||
    text.includes('metronidazole') ||
    text.includes('doxycycline') ||
    text.includes('levofloxacin') ||
    text.includes('cephalexin')
  );
}

/**
 * Initialize default inventory with stock counts and antibiotic tags
 */
export function getInitialInventory(): InventoryItem[] {
  return MEDICINE_CATALOG.map((med, idx) => ({
    ...med,
    stockQuantity: 45 + ((idx * 7) % 35), // initial realistic stock
    costPrice: Math.round(med.price * 0.82 * 100) / 100, // standard wholesale margin
    batchNumber: `BMS-${2026}${100 + idx}`,
    isAntibiotic: isAntibioticMedicine(med),
  }));
}

/**
 * Retrieve current inventory from localStorage or default
 */
export function getInventory(): InventoryItem[] {
  try {
    const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialInventory();
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = getInitialInventory();
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch (err) {
    return getInitialInventory();
  }
}

/**
 * Save inventory & notify all listening components
 */
export function saveInventory(items: InventoryItem[]) {
  try {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('bhagavati_inventory_updated', { detail: items }));
  } catch (e) {
    console.error('Failed to save inventory:', e);
  }
}

/**
 * Update price, MRP, quantity, and antibiotic flag of a specific medicine
 */
export function updateMedicineStockAndPrice(
  medicineId: string,
  updates: {
    price?: number;
    originalPrice?: number;
    stockQuantity?: number;
    isAntibiotic?: boolean;
    name?: string;
  }
): InventoryItem[] {
  const current = getInventory();
  const updated = current.map((item) => {
    if (item.id === medicineId) {
      return {
        ...item,
        ...updates,
        stockStatus: (updates.stockQuantity !== undefined ? updates.stockQuantity : item.stockQuantity) <= 5 ? ('low-stock' as const) : ('in-stock' as const),
      };
    }
    return item;
  });
  saveInventory(updated);
  return updated;
}

/**
 * Scanned Invoice Item structure
 */
export interface ScannedInvoiceItem {
  id: string;
  matchedInventoryId?: string;
  medicineName: string;
  quantityPacks: number;
  batchNumber: string;
  purchaseRate: number;
  sellingPrice: number;
  mrp: number;
  isAntibiotic: boolean;
  status: 'matched' | 'new_item';
}

/**
 * Apply Scanned Invoice items directly into inventory
 */
export function applyScannedInvoiceToInventory(scannedItems: ScannedInvoiceItem[]): InventoryItem[] {
  const inventory = [...getInventory()];

  for (const item of scannedItems) {
    let existingIndex = -1;
    if (item.matchedInventoryId) {
      existingIndex = inventory.findIndex((inv) => inv.id === item.matchedInventoryId);
    }
    if (existingIndex === -1) {
      existingIndex = inventory.findIndex(
        (inv) =>
          inv.name.toLowerCase().includes(item.medicineName.toLowerCase()) ||
          item.medicineName.toLowerCase().includes(inv.name.toLowerCase())
      );
    }

    if (existingIndex !== -1) {
      // Update existing item stock and prices
      const existing = inventory[existingIndex];
      inventory[existingIndex] = {
        ...existing,
        stockQuantity: (existing.stockQuantity || 0) + item.quantityPacks,
        price: item.sellingPrice > 0 ? item.sellingPrice : existing.price,
        originalPrice: item.mrp > 0 ? item.mrp : existing.originalPrice,
        costPrice: item.purchaseRate > 0 ? item.purchaseRate : existing.costPrice,
        batchNumber: item.batchNumber || existing.batchNumber,
        isAntibiotic: item.isAntibiotic !== undefined ? item.isAntibiotic : existing.isAntibiotic,
        stockStatus: 'in-stock',
      };
    } else {
      // Add as new medicine item
      const newMed: InventoryItem = {
        id: `med-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 100)}`,
        name: item.medicineName,
        genericName: `${item.medicineName} Formulation`,
        dosage: `${item.quantityPacks} Units Pack`,
        category: item.isAntibiotic ? 'prescription' : 'pain-relief',
        price: item.sellingPrice || item.purchaseRate * 1.18,
        originalPrice: item.mrp || item.sellingPrice * 1.15,
        costPrice: item.purchaseRate,
        stockQuantity: item.quantityPacks,
        batchNumber: item.batchNumber || `DWD-${Math.floor(1000 + Math.random() * 9000)}`,
        requiresRx: item.isAntibiotic,
        stockStatus: 'in-stock',
        packaging: 'Sealed Distributor Strip/Bottle',
        temperatureRequirement: 'Store below 25°C',
        description: `Authentic stock received via purchase invoice. 100% genuine formulation.`,
        pillColor: '#0ea5e9',
        shape: 'tablet',
        isAntibiotic: item.isAntibiotic,
      };
      inventory.push(newMed);
    }
  }

  saveInventory(inventory);
  return inventory;
}
