import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  FormGroup,
} from '@angular/forms';
import { AuthService } from '../../services/user/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.css',
})
export class RegistrationFormComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private formbuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formbuilder.group({
      email: this.formbuilder.control('', [
        Validators.required,
        Validators.email,
      ]),
      password: this.formbuilder.control('', [
        Validators.required,
        this.passwordValidator,
      ]),
      confirmPassword: this.formbuilder.control('', Validators.required),
    });
  }
  passwordValidator(control: AbstractControl): Validators | null {
    const password: string = control.value;

    if (!password) {
      return { passwordError: 'Please enter a password' };
    }

    const strongPasswordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return strongPasswordPattern.test(password)
      ? null
      : { passwordError: 'Password is not strong enough' };
  }

  signupForm!: FormGroup;
}
