import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { catchError, concatMap, forkJoin, from, map, Observable, Subscriber, switchMap, tap, toArray } from "rxjs";
import { Result } from "src/app/shared/models/result";
import { AuthService } from "src/app/shared/service/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  active: boolean = false;
  menuRole: any = [];
  constructor(private formBuilder: UntypedFormBuilder, private api: AuthService, private router: Router) {
    const active = JSON.parse(localStorage.getItem("ACTIVE")) ?? { active: false };

    if (active.active) {
      this.loginForm = this.formBuilder.group({
        email: [active.email, [Validators.required, Validators.email]],
        password: [active.password, Validators.required],
        active: [active.active],
      });
    } else {
      this.createLoginForm();
    }
  }

  owlcarousel = [
    {
      title: "BIENVENIDOS A LA TIENDA VIRTUAL",
      desc: "Ideal para MYPES y PYMES",
    },
    {
      title: "BIENVENIDOS A LA TIENDA VIRTUAL",
      desc: "cp. 12342",
    },
  ];
  owlcarouselOptions = {
    loop: true,
    items: 1,
    dots: true,
  };

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      userName: ["", [Validators.required]],
      password: ["", Validators.required],
      active: [this.active],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.invalid) {
      return Object.values(this.loginForm.controls).forEach((control) => {
        if (control instanceof UntypedFormGroup) {
          Object.values(control.controls).forEach((control) => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    if (this.loginForm.value.active) {
      localStorage.setItem("ACTIVE", JSON.stringify(this.loginForm.value));
    } else {
      localStorage.removeItem("ACTIVE");
    }
    this.api.login(this.loginForm.value).subscribe((res: Result) => {
      console.log(res);
      this.api.saveToken(res.payload.data.accessToken, res.payload.data.refreshToken);
      this.router.navigateByUrl("/dashboard/default");
    });
  }
}
