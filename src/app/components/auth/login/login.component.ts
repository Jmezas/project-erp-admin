import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/service/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public loginForm: UntypedFormGroup;
  public registerForm: UntypedFormGroup;
  public active = 1;

  constructor(private formBuilder: UntypedFormBuilder, private api: AuthService, private router: Router) {
    this.createLoginForm();
    this.createRegisterForm();
  }

  owlcarousel = [
    {
      title: "Welcome to Multikart",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to Multikart",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to Multikart",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
  ];
  owlcarouselOptions = {
    loop: true,
    items: 1,
    dots: true,
  };

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: [""],
      password: [""],
    });
  }
  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      userName: [""],
      password: [""],
      confirmPassword: [""],
    });
  }

  ngOnInit() {}

  onSubmit() {
    this.api.login(this.loginForm.value).subscribe((res: any) => {
      this.router.navigateByUrl("/dashboard/default");
    });
  }
}
