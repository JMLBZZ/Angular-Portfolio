import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button/primary-button.component';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TextFieldComponent,
    PrimaryButtonComponent,
  ],
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent implements OnInit {
  isSubmitting = false;
  errorMessage = '';

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        this.isSubmitting = false;

        if (error?.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect.';
          return;
        }

        this.errorMessage = 'Impossible de se connecter au backoffice.';
      },
    });
  }

  get emailControl(): FormControl<string> {
    return this.form.controls.email;
  }

  get passwordControl(): FormControl<string> {
    return this.form.controls.password;
  }
}