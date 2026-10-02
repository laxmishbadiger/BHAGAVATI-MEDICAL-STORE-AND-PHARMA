export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  category: 'prescription' | 'pain-relief' | 'chronic-care' | 'vitamins' | 'first-aid' | 'baby-care';
  price: number;
  originalPrice?: number;
  requiresRx: boolean;
  stockStatus: 'in-stock' | 'low-stock';
  packaging: string;
  temperatureRequirement: string;
  description: string;
  pillColor: string;
  shape: 'capsule' | 'tablet' | 'syrup' | 'inhaler' | 'patch';
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface AnimationStage {
  id: number;
  label: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  timeEstimate: string;
  metricLabel: string;
  metricValue: string;
}

export interface OrderTracking {
  orderId: string;
  patientName: string;
  recipientAddress: string;
  status: 'rx-review' | 'dispensing' | 'packed' | 'on-scooter' | 'delivered';
  currentStepIndex: number;
  estimatedArrivalMinutes: number;
  courierName: string;
  courierPhone: string;
  courierVehicle: string;
  deliveryOtp: string;
  items: Array<{ name: string; quantity: number }>;
}
