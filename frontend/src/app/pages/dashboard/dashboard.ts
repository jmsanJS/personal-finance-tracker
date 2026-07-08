import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Summary, Transaction, TransactionService } from '../../core/services/transaction';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  transactions = signal<Transaction[]>([]);
  total = signal(0);
  summary = signal<Summary | null>(null);

  constructor(
    public authService: AuthService,
    private transactionService: TransactionService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.transactionService.getAll().subscribe({
      next: (response) => this.transactions.set(response.data),
    });
    this.transactionService.getSummary().subscribe({
      next: (response) => this.summary.set(response),
    });
  }

  get totalIncome(): number {
    return this.summary()?.totalIncome ?? 0;
  }

  get totalExpenses(): number {
    return this.summary()?.totalExpenses ?? 0;
  }

  get balance(): number {
    return this.summary()?.balance ?? 0;
  }

  get recentTransactions(): Transaction[] {
    return [...this.transactions()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
