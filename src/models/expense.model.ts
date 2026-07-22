export interface Expense {
  id?: string;

  user_id: string;

  expense: string;

  merchant: string;

  address: string;

  amount: number;

  currency: string;

  quantity: number;

  category: string;

  description?: string;

  notes?: string;

  expense_date: Date;

  in_report: boolean;

  created_at?: Date;

  updated_at?: Date;
}

/* Used when creating a new expense */

export interface CreateExpenseDTO {
  expense: string;

  merchant: string;

  address: string;

  amount: number;

  currency: string;

  quantity: number;

  category: string;

  description?: string;

  notes?: string;

  expense_date: Date;
}

/* Used when updating */

export interface UpdateExpenseDTO {
  expense?: string;

  merchant?: string;

  address?: string;

  amount?: number;

  currency?: string;

  quantity?: number;

  category?: string;

  description?: string;

  notes?: string;

  expense_date?: Date;

  in_report?: boolean;
}