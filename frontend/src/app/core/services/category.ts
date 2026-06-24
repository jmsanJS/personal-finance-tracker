import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

export interface CreateCategoryDto {
  name: string;
  type: 'income' | 'expense';
  color: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Category[]>(this.apiUrl);
  }

  create(data: CreateCategoryDto) {
    return this.http.post<Category>(this.apiUrl, data);
  }
}
