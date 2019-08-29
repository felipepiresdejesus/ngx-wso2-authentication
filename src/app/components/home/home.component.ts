import { Component, OnInit } from '@angular/core';
import { NgxWso2AuthenticationService } from 'ngx-wso2-authentication';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public authService: NgxWso2AuthenticationService) { }

  ngOnInit() {
  }
}
