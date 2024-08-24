import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  FormGroup,
} from '@angular/forms';
import { AuthService } from '../../services/user/auth.service';
import { InputsStyleService } from '../../services/inputs-style.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: [
    './registration-form.component.css',
    '../login/login.component.css',
  ],
})
export class RegistrationFormComponent implements OnInit, OnDestroy {
  formSubmitted = false;
  passwordSubmitted = false;
  emailSubmitted = false;
  email = false;
  isPasswordHidden = true;
  inputsStyleService = inject(InputsStyleService);
  paswwordDontMatchError: string = '';

  constructor(
    private authService: AuthService,
    private formbuilder: FormBuilder
  ) {}
  ngOnDestroy(): void {
    this.formSubmitted = false;
    this.passwordSubmitted = false;
    this.emailSubmitted = false;
  }

  hiddeError(isSubmitted: string) {
    if (isSubmitted === 'email') {
      this.emailSubmitted = false;
    }
    if (isSubmitted === 'password') {
      this.passwordSubmitted = false;
    }
  }

  signupForm!: FormGroup;

  ngOnInit(): void {
    this.authService.IsHeaderAndFooterOpen(false, false);

    this.signupForm = this.formbuilder.group({
      email: this.formbuilder.control('', [
        Validators.required,
        Validators.email,
      ]),
      password: this.formbuilder.control('', [
        Validators.required,
        this.passwordValidator,
        Validators.minLength(8),
        Validators.maxLength(20),
      ]),
      confirmPassword: this.formbuilder.control('', [Validators.required]),
    });
  }
  passwordValidator(control: AbstractControl): Validators | null {
    const password: string = control.value;

    if (!password) {
      return { passwordError: 'לא לשכוח להזין סיסמה' };
    }

    const passwordContainsNumbers = /[0-9]/.test(password);
    const passwordContainsLetters = /[a-zA-Z]/.test(password);

    if (!passwordContainsNumbers || !passwordContainsLetters) {
      return { passwordError: ' נבקש שהסיסמה תכלול אותיות באנגלית וספרות   ' };
    }

    if (password.length < 8 || password.length <= 20) {
      return { passwordError: '  נבקש סיסמה באורך 8-20 תווים ' };
    }

    return null;
  }

  async handleSubmit() {
    const email: string = this.signupForm.get('email')?.value;
    const password: string = this.signupForm.get('password')?.value;
    const confirmPassword: string =
      this.signupForm.get('confirmPassword')?.value;
    this.formSubmitted = true;
    this.passwordSubmitted = true;
    this.emailSubmitted = true;
    const validLogin = this.areFieldsEmpty(this.signupForm);

    if (password !== confirmPassword) {
      this.paswwordDontMatchError = 'הסיסמאות אינן תואמות';
      return;
    }

    await this.authService.register(email, password, confirmPassword);
    if (this.signupForm.valid) {
      // this.inputsStyleService.navigateTomainPage();
      return;
    }
    if (validLogin) {
      return;
    }
  }

  areFieldsEmpty(form: FormGroup): boolean {
    for (const controlName in form.controls) {
      const control = form.get(controlName);
      if (control && control.value.trim() === '') {
        return true;
      }
    }
    return false;
  }

  togglePasswordVisibility() {
    this.isPasswordHidden = !this.isPasswordHidden;
    const passwordInput = document.getElementById(
      'password'
    ) as HTMLInputElement;
    const confirmPasswordInput = document.getElementById(
      'confirmPassword'
    ) as HTMLInputElement;
    if (
      passwordInput.type === 'password' ||
      confirmPasswordInput.type === 'password'
    ) {
      passwordInput.type = 'text';
      confirmPasswordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
      confirmPasswordInput.type = 'password';
    }
  }
}
