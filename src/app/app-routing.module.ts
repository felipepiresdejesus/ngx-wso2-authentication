import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent, NgxWso2AuthenticationGuard, AccessDeniedComponent } from 'ngx-wso2-authentication';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [NgxWso2AuthenticationGuard], data: { expectedRole: 'Users_WTS2K_SLA_POPMUSYSACE' } },
  { path: 'login', component: LoginComponent },
  { path: 'access-denied', component: AccessDeniedComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
