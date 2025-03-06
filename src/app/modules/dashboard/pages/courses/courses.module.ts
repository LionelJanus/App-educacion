import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesFormComponent } from './courses-form/courses-form.component';
import { SharedModule } from '../../../../shared/shared.module';
import { CoursesComponent } from './courses.component';
import { CourseDetailsDialogComponent } from './course-details-dialog/course-details-dialog.component';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    CoursesFormComponent,
    CoursesComponent,
    CourseDetailsDialogComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule,
    MatCardModule,
  ]
})
export class CoursesModule { }
