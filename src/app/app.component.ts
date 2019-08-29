import { Component, OnInit } from '@angular/core';
import { NgxWso2AuthenticationService } from 'ngx-wso2-authentication';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Wso2Authentication';

  ngOnInit(): void {
  }

  constructor(public authService: NgxWso2AuthenticationService) {
  }

}
