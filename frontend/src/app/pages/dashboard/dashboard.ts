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
import { Navbar } from "../../shared/navbar/navbar";

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
      .slice(0, 5);
  }

  get pieChartData() {
    const data = this.categorySummary();
    return {
      labels: data.map((c) => c.categoryName),
      datasets: [
        {
          data: data.map((c) => c.total),
          label: 'Expenses',
        },
      ],
      hoverOffset: 4,
    };
  }

  pieChartOptions = {
    responsive: true,
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
        { data: data.map((d) => d.income), label: 'Income' },
        { data: data.map((d) => d.expenses), label: 'Expenses' },
      ],
    };
  }

  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
}
