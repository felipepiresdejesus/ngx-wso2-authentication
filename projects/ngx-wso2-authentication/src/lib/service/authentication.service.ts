import { Injectable, InjectionToken, Inject } from '@angular/core';
import { NgxWso2Config } from '../..';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxWso2Token } from '../model/token.model';
import { User } from '../model/user.model';
import { retry } from 'rxjs/operators';

export const WSO2_CONFIG = new InjectionToken('WSO2_CONFIG');

@Injectable({
  providedIn: 'root'
})
export class NgxWso2AuthenticationService {

  constructor(@Inject(WSO2_CONFIG) private config: NgxWso2Config,
              private http: HttpClient) { }

  /// Returns access token as object
  private get tokenStorage(): NgxWso2Token {
    const obj: NgxWso2Token = JSON.parse(localStorage.getItem(this.config.storageName) || '{}');
    return obj;
  }

  /// Returns user as object
  public get user(): User {
    const userb64 = localStorage.getItem(`${this.config.storageName}_UserData`);
    if (userb64) {
      const obj: User = JSON.parse(atob(userb64) || '{}');
      return obj;
    }
    return {};
  }

  /// Save user data in local storage
  private saveUserData(userData: User): void {
    localStorage.setItem(`${this.config.storageName}_UserData`, btoa(JSON.stringify(userData)));
  }

  /// Save access token in local storage
  public saveAccessToken(token: NgxWso2Token): void {
    const sysdate = new Date();
    sysdate.setSeconds(sysdate.getSeconds() + (token.expires_in || 120));
    token.expires_date = sysdate;
    localStorage.setItem(this.config.storageName, JSON.stringify(token));
  }

  /// Returns access token
  public get accessToken(): string | undefined {
    if (this.tokenStorage) {
      return this.tokenStorage.access_token;
    }
    return undefined;
  }

  /// Returns authorize uri according to environments parameters
  public get authorizeUri(): string {
    return `${this.config.authorizeUri}?client_id=${this.config.clientId}` +
      `&redirect_uri=${encodeURIComponent(this.config.redirectUri)}` +
      `&response_type=code`;
  }

  /// Validate code using wso2 token endpoint
  public async login(code: string): Promise<boolean> {
    const body = `grant_type=authorization_code` +
      `&redirect_uri=${encodeURIComponent(this.config.redirectUri)}` +
      `&client_id=${this.config.clientId}` +
      `&client_secret=${this.config.clientSecret}&code=${code}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    let success = false;
    const token = await this
      .http
      .post<NgxWso2Token>(this.config.tokenUri, body, { headers })
      .pipe(retry(3))
      .toPromise();

    if (token != null) {
      this.saveAccessToken(token);
      success = true;
    }

    return success;
  }

  /// Delete token from local storage
  public logout(): void {
    localStorage.removeItem(this.config.storageName);
  }

  /// Update access token using refresh token
  public refreshToken(): Observable<NgxWso2Token> {
    const body = `grant_type=refresh_token` +
      `&refresh_token=${this.tokenStorage.refresh_token}` +
      `&client_id=${this.config.clientId}` +
      `&client_secret=${this.config.clientSecret}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this
      .http
      // tslint:disable-next-line: object-literal-shorthand
      .post<NgxWso2Token>(this.config.tokenUri, body, { headers: headers });
  }

  /// Check if token is expired
  public get isExpired(): boolean {
    const sysdate = new Date();
    sysdate.setSeconds(sysdate.getSeconds() + 10);
    return this.tokenStorage && sysdate > new Date(this.tokenStorage.expires_date || sysdate);
  }

  /// Check if user is logged
  public get isLogged(): boolean {
    return this.tokenStorage != null && this.tokenStorage.access_token != null;
  }

  /// Returns user data
  public async GetUserData(): Promise<User> {
    if (this.config.userDataUri == null || this.config.userDataUri === '') {
      return null;
    }

    const user = await this
      .http
      .get<User>(this.config.userDataUri)
      .pipe(retry(3))
      .toPromise();

    if (user != null) {
      this.saveUserData(user);
    }
    return user;
  }

  /// Check if user has role
  public async hasRole(role: string): Promise<boolean> {
    if (this.user == null && this.isLogged) {
      await this.GetUserData();
    }

    return this.user != null && this.user.roles != null && this.user.roles.includes(role);
  }
}
