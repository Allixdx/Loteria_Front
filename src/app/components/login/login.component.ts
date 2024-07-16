import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoteriaService } from 'src/app/service/loteria.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private loteriaService: LoteriaService, private router: Router) {
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.loteriaService.login(this.loginForm.value.identifier, this.loginForm.value.password)
        .subscribe({
          next: (response) => {
            console.log('Login exitoso', response);
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.errorMessage = 'Por favor, verifica tus credenciales.';
            console.error('Error en el login', error);
          }
        });
    }
  }
}
