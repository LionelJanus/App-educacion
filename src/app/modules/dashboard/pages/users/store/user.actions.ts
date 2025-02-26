import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Load Users': emptyProps(),
    'Delete User By Id': props<{ id: string }>(),
    'Reset State': emptyProps(),
  },
});