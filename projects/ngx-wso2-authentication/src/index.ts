import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './lib/component/login/login.component';
import { WSO2_CONFIG } from './lib/service/authentication.service';
import { NgxWso2HttpInterceptor } from './lib/interceptor/authentication.interceptor';
import { NgxWso2AuthenticationGuard } from './lib/guard/authentication.guard';
import { HasPermissionDirective } from './lib/directive/hasPermission.directive';

// Services
export * from './lib/service/authentication.service';

// Components
export * from './lib/component/login/login.component';

// Interceptors
export * from './lib/interceptor/authentication.interceptor';

// Guards
export * from './lib/guard/authentication.guard';

// Directivers
export * from './lib/directive/hasPermission.directive';

export interface NgxWso2Config {
  authorizeUri: string;
  clientId: string;
  redirectUri: string;
  storageName: string;
  clientSecret: string;
  tokenUri: string;
  userDataUri?: string;
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [
    LoginComponent,
    HasPermissionDirective
  ],
  exports: [
    HttpClientModule,
    LoginComponent,
    HasPermissionDirective
  ]
})
export class NgxWso2AuthenticationModule {
  public static forRoot(config: NgxWso2Config): ModuleWithProviders {
    return {
      ngModule: NgxWso2AuthenticationModule,
      providers: [
        NgxWso2AuthenticationGuard,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: NgxWso2HttpInterceptor,
          multi: true
        },
        { provide: WSO2_CONFIG, useValue: config }
      ]
    };
  }
}
