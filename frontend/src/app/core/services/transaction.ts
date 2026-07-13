import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface Transaction {
  id: number;
  amount: number;
  description?: string;
  date: string;
  type: 'income' | 'expense';
  categoryId: number;
  createdAt: string;
}

export interface CreateTransactionDto {
  amount: number;
  description?: string;
  date: string;
  type: 'income' | 'expense';
  categoryId: number;
}

export interface Summary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface CategorySummary {
  categoryId: number;
  categoryName: string;
  total: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/transactions`;

  getAll(filters?: {
    type?: string;
    category?: string;
    from?: string;
    to?: string;
    amountFrom?: string;
    amountTo?: string;
    page?: number;
    limit?: number;
  }) {
    let params = new HttpParams();
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.category) params = params.set('categoryId', filters.category);
    if (filters?.from) params = params.set('from', filters.from);
    if (filters?.to) params = params.set('to', filters.to);
    if (filters?.amountFrom) params = params.set('amountFrom', filters.amountFrom);
    if (filters?.amountTo) params = params.set('amountTo', filters.amountTo);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<{ data: Transaction[]; total: number }>(this.apiUrl, { params });
  }

  getSummary() {
    return this.http.get<Summary>(`${this.apiUrl}/summary`);
  }

  getCategorySummary() {
    return this.http.get<CategorySummary[]>(`${this.apiUrl}/summary/by-category`);
  }

  getMonthlyTrends(months: number) {
    const params = new HttpParams().set('months', months);
    return this.http.get<MonthlyTrend[]>(`${this.apiUrl}/summary/monthly-trends`, { params });
  }

  create(data: CreateTransactionDto) {
    return this.http.post<Transaction>(this.apiUrl, data);
  }

  update(id: number, data: Partial<CreateTransactionDto>) {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
