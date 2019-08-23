import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxWso2AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'lib-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: NgxWso2AuthenticationService) { }

  ngOnInit() {
    const authCode = this.route.snapshot.queryParams['code'] || this.route.snapshot.queryParams['CODE'];

    debugger;

    console.log(authCode);

    if (authCode) {
      this.authService.login(authCode)
        .then(success => {
          if (success === true) {
            this.router.navigate(['/']);
          } else {
            window.location.replace(this.authService.authorizeUri);
          }
        });
    } else {
      window.location.replace(this.authService.authorizeUri);
    }
  }

}
