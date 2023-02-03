import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs-compat";
import { Result } from "src/app/shared/models/result";

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
    if (this.auth.isLogged()) {
      return true;
    } else {
      this.auth.refreshToken().subscribe((res: Result) => {
        console.log(res.payload.data.accessToken);
        this.auth.saveToken(res.payload.data.accessToken, res.payload.data.refreshToken);
        return true;
      });
      //return this.router.navigate(["/auth/login"]);
    }
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
