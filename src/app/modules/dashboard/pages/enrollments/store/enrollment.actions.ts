import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Enrollment } from '../models';

export const EnrollmentActions = createActionGroup({
  source: 'Enrollment',
  events: {
    // Va a ser el disparador de una secuencia de acciones
    'Load Enrollments': emptyProps(),
    // Resultado OK
    'Load Enrollments Success': props<{ data: Enrollment[] }>(),
    // Resultado Fail
    'Load Enrollments Failure': props<{ error: unknown }>(),

    'Create Enrollment': props<{ data: Omit<Enrollment, 'id'> }>(),
    'Create Enrollment Success': props<{ data: Enrollment }>(),
    'Create Enrollment Failure': props<{ error: unknown }>(),

    'Reset State': emptyProps(),
  },
});