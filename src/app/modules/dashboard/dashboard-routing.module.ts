import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StudentsComponent } from './pages/students/students.component';
import { DashboardComponent } from './dashboard.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { TeachersComponent } from './pages/teachers/teachers.component';
import { LoginComponent } from '../auth/login/login.component';
import { authGuard } from '../../core/guards/auth.guard'; 



const routes: Routes = [
  // Redirigir la raíz a /auth/login
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // Ruta para login
  { path: 'auth/login', component: LoginComponent },

  // Ruta para el dashboard, protegida por AuthGuard
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard], // Protección para asegurar que el usuario esté logueado
    loadChildren: () => import('./dashboard.module').then(m => m.DashboardModule)
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirige a 'home' por defecto
  { path: 'home', component: HomeComponent }, // Ruta para el componente Home
  { path: 'students', component: StudentsComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'TEACHER', 'STUDENT'] } }, 
  { path: 'courses', component: CoursesComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'TEACHER'] } },  
  { path: 'teachers', component: TeachersComponent, canActivate: [authGuard], data: { roles: ['ADMIN','TEACHER'] } } ,
  // Ruta no encontrada
  { path: '**', redirectTo: '/auth/login' }
];





@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
