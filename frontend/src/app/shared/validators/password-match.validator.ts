/* eslint-disable @typescript-eslint/no-unused-vars */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    const existingErrors = confirmPassword?.errors || {};

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ ...existingErrors, mismatch: true });
    } else {
      const { mismatch, ...rest } = existingErrors;
      confirmPassword?.setErrors(Object.keys(rest).length ? rest : null);
    }
    return null;
  };
}
