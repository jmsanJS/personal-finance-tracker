import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthError, AuthService } from '../../core/services/auth.service';
import { FieldError } from '../../shared/field-error/field-error';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, FieldError],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  error = signal('');
  loading = signal(false);
  type = signal('password');

  passwordVisible() {
    this.type.set(this.type() === 'password' ? 'text' : 'password');
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set('');

    const { email, password } = this.form.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err: AuthError) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
