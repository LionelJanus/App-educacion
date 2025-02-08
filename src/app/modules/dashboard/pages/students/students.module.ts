import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';
import { StudentsFormComponent } from './components/students-form/students-form.component';
import { SharedModule } from '../../../../shared/shared.module';
import { HighlightDirective } from '../../../../shared/directives/highlight.directive';
import { NameLastnamePipe } from '../../../../shared/pipes/name-lastname.pipe';
import { StudentFilterPipe } from '../../../../shared/pipes/student-filter.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { StudentDialogFormComponent } from './components/student-dialog-form/student-dialog-form.component';


@NgModule({
  declarations: [
    StudentsComponent,
    StudentsFormComponent,
    StudentDialogFormComponent,
    HighlightDirective,
    NameLastnamePipe,
    StudentFilterPipe,
    StudentDialogFormComponent,
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    StudentsComponent,
    StudentsFormComponent
  ]
})

export class StudentsModule { }
