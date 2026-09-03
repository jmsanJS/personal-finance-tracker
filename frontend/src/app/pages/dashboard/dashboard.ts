import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {
  CategorySummary,
  MonthlyTrend,
  Summary,
  Transaction,
  TransactionService,
} from '../../core/services/transaction';
import { BaseChartDirective } from 'ng2-charts';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, DatePipe, RouterLink, BaseChartDirective, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  authService = inject(AuthService);
  private transactionService = inject(TransactionService);

  transactions = signal<Transaction[]>([]);
  total = signal(0);
  summary = signal<Summary | null>(null);
  categorySummary = signal<CategorySummary[]>([]);
  monthlyTrends = signal<MonthlyTrend[]>([]);
  trendMonths = signal(6);

  ngOnInit() {
    this.transactionService.getAll().subscribe({
      next: (response) => this.transactions.set(response.data),
    });
    this.transactionService.getSummary().subscribe({
      next: (response) => this.summary.set(response),
    });
    this.transactionService.getCategorySummary().subscribe({
      next: (response) => this.categorySummary.set(response),
    });
    this.loadMonthlyTrends();
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
      .slice(0, 10);
  }

  get pieChartData() {
    const data = this.categorySummary();
    return {
      labels: data.map((c) => c.categoryName).sort((a, b) => a.localeCompare(b)),
      datasets: [
        {
          data: data.map((c) => c.total),
          label: 'Expenses',
        },
      ],
    };
  }

  private readonly categoricalPalette = [
    '#2a78d6',
    '#eb6834',
    '#1baf7a',
    '#eda100',
    '#e87ba4',
    '#008300',
    '#4a3aa7',
    '#e34948',
  ];

  pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    hoverOffset: 6,
    backgroundColor: this.categoricalPalette,
    borderColor: '#faf8f5',
    borderWidth: 2,
    plugins: {
      legend: {
        position: 'left' as const,
        labels: { color: '#1a1a1a' },
      },
    },
    animation: {
      animateRotate: false,
    },
  };

  loadMonthlyTrends() {
    this.transactionService.getMonthlyTrends(this.trendMonths()).subscribe({
      next: (response) => this.monthlyTrends.set(response),
    });
  }

  onSelectMonthlyTrendChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.trendMonths.set(Number(value));
    this.loadMonthlyTrends();
  }

  get lineChartData() {
    const data = this.monthlyTrends();
    return {
      labels: data.map((d) => d.month),
      datasets: [
        {
          data: data.map((d) => d.income),
          label: 'Income',
          borderColor: '#16a34a',
          backgroundColor: '#16a34a',
          borderWidth: 2,
        },
        {
          data: data.map((d) => d.expenses),
          label: 'Expenses',
          borderColor: '#dc2626',
          backgroundColor: '#dc2626',
          borderWidth: 2,
        },
      ],
    };
  }

  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
}
