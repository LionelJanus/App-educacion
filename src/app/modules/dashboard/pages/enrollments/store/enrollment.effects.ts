import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { EnrollmentActions } from './enrollment.actions';
import { EnrollmentsService } from '../../../../../core/services/enrollments.service';

@Injectable()
export class EnrollmentEffects {
  private actions$ = inject(Actions);

  loadEnrollments$ = createEffect(() => {
    return this.actions$.pipe(
      // Quiero escuchar solamente las acciones de tipo:
      ofType(EnrollmentActions.loadEnrollments),
      // Y luego quiero ir a buscar las enrollments a mi base de datos
      concatMap(() =>
        this.enrollmentsService.getEnrollments().pipe(
          // Si el servicio responde OK
          map((enrollments) =>
            EnrollmentActions.loadEnrollmentsSuccess({ data: enrollments })
          ),
          // Si el servicio desponde ERROR
          catchError((error) =>
            of(EnrollmentActions.loadEnrollmentsFailure({ error }))
          )
        )
      )
    );
  });

  createEnrollments$ = createEffect(() => {
    return this.actions$.pipe(
      // Quiero escuchar solamente las acciones de tipo:
      ofType(EnrollmentActions.createEnrollment),
      // Y luego quiero ir a buscar las enrollments a mi base de datos
      concatMap((action) =>
        this.enrollmentsService.createEnrollment(action.data).pipe(
          // Si el servicio responde OK
          map((enrollment) =>
            EnrollmentActions.createEnrollmentSuccess({ data: enrollment })
          ),
          // Si el servicio desponde ERROR
          catchError((error) =>
            of(EnrollmentActions.createEnrollmentFailure({ error }))
          )
        )
      )
    );
  });

  constructor(private enrollmentsService: EnrollmentsService) {}
}