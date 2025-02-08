import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

{
  path: "dashboard",
  loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
},
{ path: "", redirectTo: "dashboard", pathMatch: "full" }, // Redirige al dashboard
{ path: "**", redirectTo: "dashboard" } // Captura rutas inválidas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
