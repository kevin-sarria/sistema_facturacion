export interface Supplier {
  id: number;
  name: string;
  tax_id?: string | null;
  contact_name?: string | null;
  phone?: string | null;
  contact_phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  total_debt?: number;
}

export interface PurchaseLineItem {
  id: number;
  product_name: string;
  quantity: number;
  cost_price: number;
  subtotal: number;
}

export interface PurchaseRecord {
  id: number;
  invoice_number: string;
  supplier_id: number;
  supplier?: {
    id: number;
    name: string;
    phone?: string | null;
  };
  purchase_date: string;
  due_date: string | null;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  payment_status: 'paid' | 'partial' | 'pending';
  payment_type?: 'cash' | 'credit';
  notes?: string | null;
  items?: PurchaseLineItem[];
}

export interface PurchaseAnalysisData {
  total_owed: number;
  total_paid: number;
  pending_invoices_count: number;
  paid_invoices_count: number;
  overdue_count: number;
  overdue_amount: number;
  upcoming_due_invoices: PurchaseRecord[];
}

export interface CashShiftData {
  id: number;
  user_id: number;
  opened_at: string;
  closed_at?: string | null;
  initial_cash: number;
  starting_amount?: number;
  total_cash_sales: number;
  total_electronic_sales: number;
  expected_cash: number;
  actual_cash?: number | null;
  difference?: number | null;
  notes?: string | null;
  status: 'open' | 'closed';
}

export interface CreditSaleItem {
  id: number;
  invoice_number: string;
  ticket_number?: string;
  customer_id?: number;
  customer?: {
    id: number;
    name: string;
    last_name?: string;
    phone: string | null;
    document_number?: string | null;
  };
  due_date: string | null;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  payment_status: string;
  notes: string | null;
  created_at: string;
}

export interface DashboardSalesSummary {
  total_amount: number;
  sales_count: number;
  cash_amount: number;
  electronic_amount: number;
}

export interface DashboardCreditsSummary {
  total_owed: number;
  credits_count: number;
  credits: CreditSaleItem[];
}

export interface RecentSaleRecord {
  id: number;
  ticket_number: string;
  created_at: string;
  total_amount: number;
  payment_type: 'cash' | 'credit';
  payment_method: 'cash' | 'transfer' | 'card';
  customer?: {
    id: number;
    name: string;
    last_name?: string;
  };
  items?: Array<{
    id: number;
    quantity: number;
    product_name?: string;
  }>;
}
