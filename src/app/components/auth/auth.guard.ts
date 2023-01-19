import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from "@angular/router";

import { AuthService } from "src/app/shared/service/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate() {
    if (this.auth.isLogged()) {
      return true;
    } else {
      return this.router.navigate(["/auth/login"]);
    }
  }
}
