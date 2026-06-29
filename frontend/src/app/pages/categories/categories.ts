import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Category, CategoryService } from '../../core/services/category';
import { AuthService } from '../../core/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  categories = signal<Category[]>([]);
  showForm = false;
  loading = signal(true);
  error = signal('');

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    type: new FormControl<'income' | 'expense'>('expense', Validators.required),
    color: new FormControl('#6366f1', Validators.required),
  });

  constructor(
    public authService: AuthService,
    private categoryService: CategoryService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.error.set('');

    const { name, type, color } = this.form.value;

    this.categoryService
      .create({
        name: name!,
        type: type!,
        color: color!,
      })
      .subscribe({
        next: (c) => {
          this.categories.set([c, ...this.categories()]);
          this.form.reset({ type: 'expense' });
          this.showForm = false;
        },
        error: () => this.error.set('Failed to create category'),
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
