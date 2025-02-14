import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StudentsComponent } from './pages/students/students.component';
import { DashboardComponent } from './dashboard.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { TeachersComponent } from './pages/teachers/teachers.component';
import { adminGuard } from '../../core/guards/admin.guard';
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

  // Ruta no encontrada
  { path: '**', redirectTo: '/auth/login' }
];


//   {
//     path: "", // 👈 Esto hace que "dashboard" sea la ruta base
//     component: DashboardComponent,
//     children: [
      
//       { path: "home", component: HomeComponent },
//       { path: "students", component: StudentsComponent },
//       { path: "courses", component: CoursesComponent },
//       {path: "teachers", component: TeachersComponent},
//       {
//         path: 'users',
//         canActivate: [adminGuard],
//         loadChildren: () =>
//           import('./pages/users/users.module').then((m) => m.UsersModule),
//       },
//       { path: "", redirectTo: "home", pathMatch: "full" } // 👈 Redirigir a home por defecto
//     ]
//   }
// ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
