import { ContentDetailsComponent } from './contents/content-details/content-details.component';
import { AuthGuard } from './services/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { AddComponent } from './add/add.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentsComponent } from './contents/contents.component';
import { AContentComponent } from './contents/a-content/a-content.component';

const routes: Routes = [
  {path:'', redirectTo:'contents', pathMatch:'full'},
  {path:'contents', component:ContentsComponent},
  {path:'details/:id', component:ContentDetailsComponent, canActivate:[AuthGuard]},

  {path:'add', component:AddComponent, canActivate:[AuthGuard]},
  {path:'profile', component:ProfileComponent, canActivate:[AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
