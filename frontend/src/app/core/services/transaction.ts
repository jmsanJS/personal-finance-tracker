import { HttpClient } from '@angular/common/http';
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

  getAll() {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  create(data: CreateTransactionDto) {
    return this.http.post<Transaction>(this.apiUrl, data);
  }
}
