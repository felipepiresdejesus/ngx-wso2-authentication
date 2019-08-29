import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxWso2AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'ngx-wso2-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: NgxWso2AuthenticationService) { }

  ngOnInit() {

    // if (this.authService.isLogged) {
    //   if (this.authService.user.roles == null) {
    //     this.authService.GetUserData()
    //       .then(() => {
    //         this.router.navigate(['/']);
    //         return;
    //       });
    //   } else {
    //     this.router.navigate(['/']);
    //     return;
    //   }

    // }

    const authCode = this.route.snapshot.queryParams.code || this.route.snapshot.queryParams.CODE;

    if (authCode) {
      this.authService.login(authCode)
        .then(() => {
          this.authService.GetUserData()
            .then(() => {
              this.router.navigate(['/']);
            });
        });
    } else {
      window.location.replace(this.authService.authorizeUri);
    }
  }

}
