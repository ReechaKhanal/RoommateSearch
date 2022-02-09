import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { HomeComponentComponent } from './home-component/home-component.component'
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '',     component: LoginComponent},
  {path: 'home', component: HomeComponentComponent},
  //{path: 'login', component: LoginComponent },
  {path: 'profile', component: ProfileComponent },
  {path: 'chat', component: ChatComponent }
];
export const all=[HomeComponentComponent, LoginComponent]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
