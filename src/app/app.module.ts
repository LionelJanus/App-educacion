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
import { AuthModule } from './modules/auth/auth.module';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { EnrollmentsComponent } from './modules/dashboard/pages/enrollments/enrollments.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { userFeatureKey,reducer as userReducer  } from './modules/dashboard/pages/users/store/user.reducer';




@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ToolbarComponent,
    NavmenuComponent,
    EnrollmentsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StudentsModule,
    CoursesModule,
    AuthModule,
    SharedModule,
    StoreModule.forRoot({ [userFeatureKey]: userReducer }),
    EffectsModule.forRoot([])
  
  ],
  providers: [
    provideAnimationsAsync(),provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
