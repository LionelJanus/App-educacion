import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StudentsComponent } from './pages/students/students.component';
import { DashboardComponent } from './dashboard.component';



const routes: Routes = [
  {
    path: "", // 👈 Esto hace que "dashboard" sea la ruta base
    component: DashboardComponent,
    children: [
      { path: "home", component: HomeComponent },
      { path: "students", component: StudentsComponent },
      { path: "", redirectTo: "home", pathMatch: "full" } // 👈 Redirigir a home por defecto
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
