import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });

  error = '';
  loading = false;

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    const { name, email, password } = this.form.value;

    this.authService.register({ name: name!, email: email!, password: password! }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.error = err.status === 409 ? 'Email already in use' : 'Registration failed';
        this.loading = false;
      },
    });
  }
}
