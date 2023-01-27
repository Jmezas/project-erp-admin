import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { concatMap, forkJoin, from, map, Observable, Subscriber, switchMap, toArray } from "rxjs";
import { Result } from "src/app/shared/models/result";
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
      title: "BIENBENIDOS A LA TIENDA VIRTUAL",
      desc: "Ideal para MYPES y PYMES",
    },
    {
      title: "BIENBENIDOS A LA TIENDA VIRTUAL",
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
    this.api.login(this.loginForm.value).subscribe((resx: any) => {
      console.log("res", resx);
      const roles = this.api.getUserInfo().roles;
      let menuRole = [];
      for (let i = 0; i < roles.length; i++) {
        forkJoin({
          roles: this.api.menuRole(roles[i]),
        }).subscribe((res) => {
          console.log("res", res);
          menuRole.push(res.roles["payload"].data);
          let arrayLocal = JSON.parse(localStorage.getItem("MENU"));
          if (arrayLocal) menuRole.push(res.roles["payload"].data);
          localStorage.setItem("MENU", JSON.stringify(menuRole));
          if (i == roles.length - 1) {
            this.router.navigateByUrl("/dashboard/default");
          }
        });
      }
    });
  }

  MENU_KEY = "MENU";
  DASHBOARD_URL = "/dashboard/default";
  async handleLogin() {
    debugger;
    try {
      const resx = await this.api.login(this.loginForm.value).subscribe(async (res: Result) => {
        const roles = this.api.getUserInfo().roles;
        const menuRole = await this.handleRoles(roles);
        localStorage.setItem(this.MENU_KEY, JSON.stringify(menuRole));
        this.router.navigateByUrl(this.DASHBOARD_URL);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async handleRoles(roles) {
    const menuRole = [];
    const roleData = await Promise.all(
      roles.map(async (role) => {
        await this.api.menuRole(role).subscribe((res: Result) => {
          return res["payload"].data;
        });
      })
    );
    const localData = JSON.parse(localStorage.getItem(this.MENU_KEY)) || [];
    return Object.assign(menuRole, localData, roleData);
  }
}
