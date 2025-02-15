import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/authservice';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  loginForm: FormGroup;
 

  constructor(private router: Router,private authService: AuthService,private fb: FormBuilder, private snackBar: MatSnackBar) {
    
    
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    return;
    }
    this.authService.login(this.loginForm.value);
     
    this.authService.isAuthenticated().subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate(['/dashboard/home']);
  
   
   // Mostrar el rol con un Snackbar
   this.authService.getUserRole().subscribe(role => {
    this.snackBar.open(`Bienvenido, has iniciado sesión como: ${role}`, 'Cerrar', {
      duration: 3000, 
    });
  });
}
});
}
}