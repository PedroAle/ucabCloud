import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreciosComponent } from './components/precios/precios.component';
import { HomeComponent } from './components/home/home.component';
import { ProtegidaComponent } from './components/protegida/protegida.component';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
  { path:'home', component: HomeComponent },
  { path: 'precios/:user', component: PreciosComponent },
  { path: 'protegida', component: ProtegidaComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
