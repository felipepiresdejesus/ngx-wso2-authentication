import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxWso2AuthenticationModule } from 'ngx-wso2-authentication';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxWso2AuthenticationModule.forRoot(environment.wso2)
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
  schemas: [
  ]
})
export class AppModule { }
