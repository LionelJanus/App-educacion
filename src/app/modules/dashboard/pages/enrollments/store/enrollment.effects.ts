import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, mergeMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { EnrollmentActions } from './enrollment.actions';
import { EnrollmentsService } from '../../../../../core/services/enrollments.service';
import { generateRandomString } from '../../../../../shared/utils';
import { Enrollment } from '../models';

@Injectable()
export class EnrollmentEffects {
  private actions$ = inject(Actions);
  constructor(private enrollmentsService: EnrollmentsService) {}



  
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

  createEnrollment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentActions.createEnrollment),
      mergeMap((action) => {
        const enrollmentData: Enrollment = {
          ...action.data,
          id: generateRandomString(6), // Si el servidor no genera el ID automáticamente
        };
  
  
        return this.enrollmentsService.createEnrollment(enrollmentData).pipe(
          map((enrollment) => EnrollmentActions.createEnrollmentSuccess({ data: enrollment })),
          catchError((error) => {
            console.error('Error en la creación de la inscripción:', error); // Verifica si hay errores
            return of(EnrollmentActions.createEnrollmentFailure({ error }));
          })
        );
      })
    )
  );
  
  
  
  
  
  


}