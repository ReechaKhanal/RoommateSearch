import { UserComponent } from './user/user.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import {SignUpComponent} from './sign-up/sign-up.component';


const routes: Routes = [
  { path: '',     component: LoginComponent},
  {path: 'home', component: HomeComponentComponent},
  {path: 'chat', component: ChatComponent },
  {path: 'sign_up', component: SignUpComponent},
  {path: 'edit_profile', component: EditProfileComponent},
  {path: 'user', component: UserComponent}
];
export const all = [HomeComponentComponent, LoginComponent];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
