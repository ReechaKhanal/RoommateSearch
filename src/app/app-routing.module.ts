import { EditProfileComponent } from './edit-profile/edit-profile.component';
<<<<<<< HEAD
import { NgModule } from '@angular/core';
=======
import { NgModule, Component } from '@angular/core';
>>>>>>> 0628129727608c3068f707b20794101d4e82ab12
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
<<<<<<< HEAD
<<<<<<< HEAD
  {path: 'sign_up', component: SignUpComponent},
  {path: 'edit_profile', component: EditProfileComponent}
=======
  {path: 'sign_up', component: SignUpComponent}
>>>>>>> b2a049a6b86c073286afc2b012eacebf3098a461
=======
  {path: 'sign_up', component: SignUpComponent},
  {path: 'edit_profile', component: EditProfileComponent}
>>>>>>> 0628129727608c3068f707b20794101d4e82ab12
];
export const all = [HomeComponentComponent, LoginComponent];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
