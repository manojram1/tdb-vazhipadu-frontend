export interface Temple {
  id: string;
  name: string;
  location: string;
  deity?: string;
}

export interface Offering {
  id: string;
  templeId: string;
  name: string;
  price: number;
  active: boolean;
  description?: string;
}

export interface OrderItem {
  offeringId: string;
  offeringName: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'CONFIRMED' | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  templeId: string;
  templeName?: string;
  devoteeName: string;
  phoneNumber: string;
  nakshatra: string;
  date: string; // YYYY-MM-DD
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderRequest {
  templeId: string;
  devoteeName: string;
  phoneNumber: string;
  nakshatra: string;
  date: string;
  items: {
    offeringId: string;
    quantity: number;
  }[];
}

export interface GetOrdersQuery {
  date?: string;
  status?: 'ALL' | OrderStatus;
  phoneNumber?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedOrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const NAKSHATRAS = [
  'Aswathy (Ashwini)',
  'Bharani',
  'Karthika (Krittika)',
  'Rohini',
  'Makayiram (Mrigashira)',
  'Thiruvathira (Ardra)',
  'Punartham (Punarvasu)',
  'Pooyam (Pushya)',
  'Ayilyam (Ashlesha)',
  'Makam (Magha)',
  'Pooram (Purva Phalguni)',
  'Uthram (Uttara Phalguni)',
  'Atham (Hasta)',
  'Chithira (Chitra)',
  'Chothi (Swati)',
  'Vishakham (Vishakha)',
  'Anizham (Anuradha)',
  'Thrikketta (Jyeshtha)',
  'Moolam (Mula)',
  'Pooradam (Purva Ashadha)',
  'Uthraddam (Uttara Ashadha)',
  'Thiruvonam (Shravana)',
  'Avittam (Dhanishta)',
  'Chathayam (Shatabhisha)',
  'Poororuttathi (Purva Bhadrapada)',
  'Uthrattathi (Uttara Bhadrapada)',
  'Revathi (Revati)',
] as const;
