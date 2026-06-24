import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Transaction, TransactionService } from '../../core/services/transaction';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  transactions: Transaction[] = [];

  constructor(
    public authService: AuthService,
    private transactionService: TransactionService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.transactionService.getAll().subscribe({
      next: (data) => (this.transactions = data),
    });
  }

  get totalIncome(): number {
    return this.transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  get totalExpenses(): number {
    return this.transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  get balance(): number {
    return this.totalIncome - this.totalExpenses;
  }

  get recentTransactions(): Transaction[] {
    return [...this.transactions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
