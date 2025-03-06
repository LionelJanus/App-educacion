import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { HomeComponent } from './pages/home/home.component';
import { TeachersComponent } from './pages/teachers/teachers.component';
import { EnrollmentsComponent } from './pages/enrollments/enrollments.component';
import { StudentsComponent } from './pages/students/students.component';
import { SharedModule } from '../../shared/shared.module';




@NgModule({
  declarations: [
    HomeComponent,
    TeachersComponent,
    StudentsComponent
    
    
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
    
    
  ],
  exports: [StudentsComponent]
})
export class DashboardModule { }
