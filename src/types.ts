export interface Order {
  id: string;
  customerName: string;
  phone: string;
  wilayaCode: string;
  wilayaName: string;
  shippingType: 'home' | 'office';
  shippingFee: number;
  productPrice: number;
  totalPrice: number;
  comment?: string;
  status: 'new' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface Wilaya {
  code: string; // standard number as string (e.g. "16")
  nameAr: string;
  nameEn: string;
  homeDeliveryFee: number | null;
  officeDeliveryFee: number | null;
  supported: boolean;
}

declare global {
  interface Window {
    fbq?: any;
  }
}

