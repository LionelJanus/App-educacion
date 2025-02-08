import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { NavmenuComponent } from '../components/navmenu/navmenu.component';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { StudentsComponent } from './pages/students/students.component';




@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
    
    
  ],
  exports: []
})
export class DashboardModule { }
