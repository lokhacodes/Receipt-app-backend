export interface Report {
  id: string;

  user_id: string;

  title: string;

  description?: string;

  currency: string;

  status: "draft" | "active" | "completed";

  total_amount: number;

  created_at: string;

  updated_at: string;
}

export interface CreateReportDTO {
  title: string;

  description?: string;

  currency: string;

  status?: "draft" | "active";

  expenseIds: string[];
}

export interface UpdateReportDTO {
  title: string;

  description?: string;

  currency: string;

  status?: "draft" | "active" | "completed";

  expenseIds: string[];
}