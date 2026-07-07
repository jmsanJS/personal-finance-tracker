import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getAll(filters?: {
    type?: string;
    category?: string;
    from?: string;
    to?: string;
    amountFrom?: string;
    amountTo?: string;
  }) {
    let params = new HttpParams();
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.category) params = params.set('categoryId', filters.category);
    if (filters?.from) params = params.set('from', filters.from);
    if (filters?.to) params = params.set('to', filters.to);
    if (filters?.amountFrom) params = params.set('amountFrom', filters.amountFrom);
    if (filters?.amountTo) params = params.set('amountTo', filters.amountTo);
    return this.http.get<Transaction[]>(this.apiUrl, { params });
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
