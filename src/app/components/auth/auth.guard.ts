import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs-compat";

import { AuthService } from "src/app/shared/service/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //return this.checkuserLogin(router);
    return true;
  }
  checkuserLogin(router: ActivatedRouteSnapshot): boolean {
    const scopes = ([] = this.auth.getUserInfo().roles);
    if (scopes.includes(router.data.role)) {
      return true;
    } else {
      this.router.navigate(["/auth/login"]);
      return false;
    }
  }
}
