import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesFormComponent } from './courses-form/courses-form.component';
import { SharedModule } from '../../../../shared/shared.module';
import { CoursesComponent } from './courses.component';


@NgModule({
  declarations: [
    CoursesFormComponent,
    CoursesComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule
  ]
})
export class CoursesModule { }
