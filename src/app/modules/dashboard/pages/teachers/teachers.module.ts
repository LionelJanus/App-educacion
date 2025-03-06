import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeachersRoutingModule } from './teachers-routing.module';
import { SharedModule } from '../../../../shared/shared.module';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TeachersRoutingModule,
    SharedModule,
    MatListModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class TeachersModule { }
