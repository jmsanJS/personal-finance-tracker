import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-field-error',
  imports: [],
  templateUrl: './field-error.html',
  styleUrl: './field-error.scss',
})
export class FieldError {
  control = input.required<AbstractControl | null>();
  label = input.required<string>();

  errorMessage(): string | null {
    if (!this.control() || !this.control()!.touched || !this.control()!.invalid) {
      return null;
    }

    const errors = this.control()!.errors;

    if (!errors) return null;
    if (errors['required']) return `${this.label()} is required`;
    if (errors['email']) return 'Enter a valid email address';
    if (errors['minlength'])
      return `${this.label()} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['pattern'])
      return 'Password must include an uppercase and lowercase letter, a number, and a special character (@$!%*?&)';
    if (errors['mismatch']) return 'Passwords do not match';
    return null;
  }
}
