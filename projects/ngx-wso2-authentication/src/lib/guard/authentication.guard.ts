import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { NgxWso2AuthenticationService } from '../service/authentication.service';

@Injectable()
export class NgxWso2AuthenticationGuard implements CanActivate {

  constructor(private router: Router, private service: NgxWso2AuthenticationService) {
    console.log(this.router);
    console.log(this.service);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.service.isLogged) {
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }

}
