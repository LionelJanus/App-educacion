import { AbstractControl, ValidatorFn } from '@angular/forms';

export const noHomeroValidator: ValidatorFn = (control: AbstractControl) => {
  /**
   * Si esta funcion retorna null para angular
   * significa que el campo ES VALIDO
   */

  if (
    typeof control.value == 'string' &&
    control.value.toLowerCase().includes('homero')
  ) {
    return {
      noHomero: true,
    };
  }

  return null;
};