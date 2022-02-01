import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponentComponent } from './home-component/home-component.component'
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path: 'home', component: HomeComponentComponent},
  {path: 'login', component: LoginComponent }
];
export const all=[HomeComponentComponent, LoginComponent]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
