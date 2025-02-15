import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/authservice';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appRoleVisibility]',
  standalone: false
})
export class RoleVisibilityDirective implements OnInit, OnDestroy {
  @Input() appRoleVisibility: string[] = []; // Roles permitidos
  private subscription: Subscription = new Subscription();

  constructor(private el: ElementRef, private authService: AuthService) {}

  ngOnInit() {
    this.subscription = this.authService.getUserRole().subscribe(role => {
      const userRole = role || ''; // Asegura que siempre sea una cadena
      if (this.appRoleVisibility.includes(userRole)) {
        this.el.nativeElement.style.display = 'block'; // Mostrar
      } else {
        this.el.nativeElement.style.display = 'none'; // Ocultar
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // Evitar fugas de memoria
  }
}
