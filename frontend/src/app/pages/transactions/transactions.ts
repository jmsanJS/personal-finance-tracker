import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Transaction, TransactionService } from '../../core/services/transaction';
import { Category, CategoryService } from '../../core/services/category';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-transactions',
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class Transactions implements OnInit {
  transactions = signal<Transaction[]>([]);
  categories = signal<Category[]>([]);
  showForm = false;
  loading = signal(true);
  error = signal('');

  form = new FormGroup({
    amount: new FormControl('', [Validators.required, Validators.min(0.01)]),
    description: new FormControl(''),
    date: new FormControl('', Validators.required),
    type: new FormControl<'income' | 'expense'>('expense', Validators.required),
    categoryId: new FormControl('', Validators.required),
  });

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    public authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.transactionService.getAll().subscribe({
      next: (data) => {
        this.transactions.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories.set(data),
    });
  }

  get filteredCategories() {
    return this.categories().filter((c) => c.type === this.form.value.type);
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.error.set('');

    const { amount, description, date, type, categoryId } = this.form.value;

    this.transactionService
      .create({
        amount: Number(amount!),
        description: description || undefined,
        date: date!,
        type: type!,
        categoryId: Number(categoryId!),
      })
      .subscribe({
        next: (t) => {
          this.transactions.set([t, ...this.transactions()]);
          this.form.reset({ type: 'expense' });
          this.showForm = false;
        },
        error: () => this.error.set('Failed to create transaction'),
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
