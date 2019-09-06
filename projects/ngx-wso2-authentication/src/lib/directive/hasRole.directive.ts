import { Directive, ElementRef, Input, OnInit, ViewContainerRef } from '@angular/core';
import { NgxWso2AuthenticationService } from '../service/authentication.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[ngxHasRole]'
})
export class HasRoleDirective implements OnInit {

  constructor(private el: ElementRef,
              private viewContainer: ViewContainerRef,
              private authService: NgxWso2AuthenticationService) {
  }

  @Input('ngxHasRole') role: string;

  ngOnInit(): void {
    if (this.role != null && !this.authService.hasRole(this.role)) {
      const ele = this.el.nativeElement;
      ele.parentNode.removeChild(ele);
    }
  }
}
