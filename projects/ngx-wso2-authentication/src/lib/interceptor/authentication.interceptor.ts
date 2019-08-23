import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { finalize, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NgxWso2AuthenticationService, WSO2_CONFIG } from '../service/authentication.service';
import { NgxWso2Config } from '../..';
import { NgxWso2Token } from '../model/token.model';

@Injectable()
export class NgxWso2HttpInterceptor implements HttpInterceptor {

  private isRefreshingToken = false;
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(@Inject(WSO2_CONFIG) private config: NgxWso2Config,
              private authService: NgxWso2AuthenticationService) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log('intercepted');

    if (req.url === this.config.tokenUri) {
      return next.handle(req);
    }

    if (this.authService.isExpired) {
      return this.refreshToken(req, next);
    }

    return next.handle(this.addToken(req, this.authService.accessToken || ''));
  }

  /// Add token on headers
  private addToken(req: HttpRequest<any>, accessToken: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /// Refresh access token when is expired
  private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<any> | undefined {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.tokenSubject.next('');

      return this.authService.refreshToken().pipe(
        switchMap((token: NgxWso2Token) => {
          if (token != null) {
            this.authService.saveAccessToken(token);
            this.tokenSubject.next(token.access_token || '');
            return of(next.handle(this.addToken(request, token.access_token || '')));
          }
          this.authService.logout();
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        }),
      );
    }
    return undefined;
  }
}
