import { Component, OnInit, signal, inject } from '@angular/core';
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
  private transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);
  authService = inject(AuthService);
  private router = inject(Router);

  transactions = signal<Transaction[]>([]);
  total = signal(0);
  categories = signal<Category[]>([]);
  showForm = false;
  loading = signal(true);
  error = signal('');
  editingTransaction = signal<Transaction | null>(null);
  today = new Date().toISOString().slice(0, 10);
  type = signal('');
  category = signal('');
  fromDate = signal('');
  toDate = signal('');
  amountFrom = signal('');
  amountTo = signal('');
  page = signal(1);
  limit = signal(25);

  form = new FormGroup({
    amount: new FormControl('', [Validators.required, Validators.min(0.01)]),
    description: new FormControl(''),
    date: new FormControl(this.today, Validators.required),
    type: new FormControl<'income' | 'expense'>('expense', Validators.required),
    categoryId: new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.loadTransactions();
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories.set(data),
    });
  }

  private loadTransactions() {
    this.transactionService
      .getAll({
        type: this.type(),
        category: this.category(),
        from: this.fromDate(),
        to: this.toDate(),
        amountFrom: this.amountFrom(),
        amountTo: this.amountTo(),
        page: this.page(),
        limit: this.limit(),
      })
      .subscribe({
        next: (response) => {
          this.transactions.set(response.data);
          this.total.set(response.total);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  get filteredCategories() {
    return this.categories().filter((c) => c.type === this.form.value.type);
  }

  getCategoryName(categoryId: number): string {
    return this.categories().find((c) => c.id === categoryId)?.name ?? '—';
  }

  private sortByDate(list: Transaction[]): Transaction[] {
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { amount, description, date, type, categoryId } = this.form.value;
    this.error.set('');

    const editing = this.editingTransaction();

    if (editing) {
      this.transactionService
        .update(editing.id, {
          amount: Number(amount!),
          description: description || undefined,
          date: date!,
          type: type!,
          categoryId: Number(categoryId!),
        })
        .subscribe({
          next: (updated) => {
            this.transactions.set(
              this.sortByDate(this.transactions().map((t) => (t.id === updated.id ? updated : t))),
            );
            this.resetForm();
          },
          error: () => this.error.set('Failed to update transaction'),
        });
    } else {
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
            this.transactions.set(this.sortByDate([t, ...this.transactions()]));
            this.form.reset({ type: 'expense' });
            this.showForm = false;
          },
          error: () => this.error.set('Failed to create transaction'),
        });
    }
  }

  onEdit(transaction: Transaction) {
    this.editingTransaction.set(transaction);
    this.form.setValue({
      amount: transaction.amount.toString(),
      description: transaction.description || '',
      date: transaction.date,
      type: transaction.type,
      categoryId: transaction.categoryId.toString(),
    });
    this.showForm = true;
  }

  onDelete(transaction: Transaction) {
    this.transactionService.delete(transaction.id).subscribe({
      next: () => this.transactions.set(this.transactions().filter((t) => t.id !== transaction.id)),
      error: () => this.error.set('Failed to delete transaction'),
    });
  }

  onSelectTypeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.type.set(value);
    this.page.set(1);
    this.loadTransactions();
  }

  onSelectCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.category.set(value);
    this.page.set(1);
    this.loadTransactions();
  }

  onChangeFrom(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.fromDate.set(value);
    this.page.set(1);
    this.loadTransactions();
  }

  onChangeTo(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.toDate.set(value);
    this.page.set(1);
    this.loadTransactions();
  }

  onChangeAmountFrom(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.amountFrom.set(value);
    this.page.set(1);
    this.loadTransactions();
  }

  onChangeAmountTo(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.amountTo.set(value);
    this.page.set(1);
    this.loadTransactions();
  }

  onPrevPage() {
    if (this.page() === 1) return;
    this.page.update((p) => p - 1);
    this.loadTransactions();
  }

  onNextPage() {
    if (!this.hasNextPage()) return;
    this.page.update((p) => p + 1);
    this.loadTransactions();
  }

  onLimitChange(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    this.limit.set(value);
    this.page.set(1);
    this.loadTransactions();
  }

  hasNextPage(): boolean {
    return this.page() * this.limit() < this.total();
  }

  resetForm() {
    this.form.reset({ type: 'expense' });
    this.editingTransaction.set(null);
    this.showForm = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
