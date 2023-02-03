import { Component } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Result } from "src/app/shared/models/result";
import { AuthService } from "src/app/shared/service/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.scss"],
})
export class ForgetPasswordComponent {
  forgetForm: UntypedFormGroup;
  constructor(private formBuilder: UntypedFormBuilder, private api: AuthService) {
    this.createForm();
  }

  createForm() {
    this.forgetForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }
  onSubmit() {
    if (this.forgetForm.invalid) {
      return Object.values(this.forgetForm.controls).forEach((control) => {
        if (control instanceof UntypedFormGroup) {
          Object.values(control.controls).forEach((control) => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    this.api.getByEmail(this.forgetForm.value.email).subscribe({
      next: (res: Result) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Compruebe su correo electrónico para restablecer la contraseña",
        });
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.error.message,
        });
      },
    });
  }
}
