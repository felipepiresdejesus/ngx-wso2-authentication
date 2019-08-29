import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { NgxWso2AuthenticationService } from '../service/authentication.service';

@Injectable()
export class NgxWso2AuthenticationGuard implements CanActivate {

  constructor(private router: Router, private service: NgxWso2AuthenticationService) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const expectedRole = route.data.expectedRole;

    if (this.service.isLogged) {
      if (expectedRole != null) {
        return await this.service.hasRole(expectedRole);
      } else {
        return true;
      }
    }
    this.router.navigate(['login']);
    return false;
  }

}
