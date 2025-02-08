import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { NavmenuComponent } from './modules/dashboard/components/navmenu/navmenu.component';
import { SharedModule } from './shared/shared.module';
import { ToolbarComponent } from './modules/dashboard/components/toolbar/toolbar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { StudentsModule } from './modules/dashboard/pages/students/students.module';
import { CoursesModule } from './modules/dashboard/pages/courses/courses.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ToolbarComponent,
    NavmenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StudentsModule,
    CoursesModule,
    SharedModule
  
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
