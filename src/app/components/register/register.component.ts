import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoteriaService } from 'src/app/service/loteria.service';

interface ErrorDetail {
  rule: string;
  field: string;
  message: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  errorMessage: string | null = null; 

  constructor(private fb: FormBuilder, private loteriaService: LoteriaService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmarPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')!.value;
    const confirmarPassword = control.get('confirmarPassword')!.value;
    if (password !== confirmarPassword) {
      return { mismatch: true };
    }
    return null;
  }

  onSubmit() {
    this.errorMessage = null;
    if (this.registerForm.valid) {
      const { name, lastname, email, password } = this.registerForm.value;

      this.loteriaService.register({ name, lastname, email, password }).subscribe(
        response => {
          console.log('Registro exitoso', response);
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error al registrar', error);
          if (error.error?.errors) {
            const uniqueError = error.error.errors.find((e: ErrorDetail) => e.rule === 'unique' && e.field === 'email');
            this.errorMessage = 'Correo ya registrado';
          } else {
            this.errorMessage = 'Error desconocido';
          }
        }
      );
    }
  }
}
