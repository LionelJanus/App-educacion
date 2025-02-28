import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../../pages/users/models/index';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(), // Nueva acción para actualizar el estado
    'Delete User By Id': props<{ id: string }>(),
    'Reset State': emptyProps(),
  },
});
